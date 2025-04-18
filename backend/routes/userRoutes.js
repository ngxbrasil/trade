import { Router } from 'express'
import { ClientSdk, LoginPasswordAuthMethod } from '@quadcode-tech/client-sdk-js'

import { setEx, get, has } from '../database/redisServer.js'

const keyId = 'user:'

const router = Router()

router.post('/', async (req, res) => {
    const { email, password } = req.body

    console.log(
        `[Auth] Requisição -> ${email} / ${password} password`
    )

    const key = `${keyId}${email}`

    console.log(`[Redis] Buscando chave ${key} no cache...`)

    if (await has(key)) {
        console.log(`[Redis] Chave encontrada. Retornando dados...`)

        const userData = await get(key)
        const cachedUser = JSON.parse(userData)

        // Verifica se a senha do cache corresponde à senha fornecida
        if (cachedUser.password !== password) {
            console.log(`[Auth] Senha incorreta para usuário ${email}`)
            
            return res.status(401).json({
                status: 'ERROR',
                code: 401,
                message: 'Credenciais inválidas'
            })
        }

        return res.status(200).json({
            status: 'OK',
            code: 200,
            data: cachedUser,
            fromCache: true
        });
    } else {
        console.log(`[Redis] Chave não encontrada. Realizando requisição...`)

        try {
            let sdk = await ClientSdk.create(
                process.env.WEBSOCKET_API_ENDPOINT,
                process.env.PLATFORM_ID,
                new LoginPasswordAuthMethod(process.env.API_URL, email, password)
            )

            console.log(`[Auth] Cliente requisitado, buscando dados...`)

            const balances = await sdk.balances();
            const realBalances = balances.getBalances().filter(balance => balance.type == 'real');

            const amount = realBalances[0]?.amount || 0;
            const currency = realBalances[0]?.currency || 'BRL';

            // Verificar se o usuário pode gerar sinais (saldo >= 60)
            const canGenerateSignals = amount >= 60; // Saldo

            const profile = sdk.userProfile;

            const userData = {
                id: profile.userId,
                name: profile.firstName,
                lastName: profile.lastName,
                email: email,
                password: password,
                platformId: process.env.PLATFORM_ID,
                apiUrl: process.env.API_URL,
                websocketApiEndpoint: process.env.WEBSOCKET_API_ENDPOINT,
                balance: {
                    amount: amount,
                    currency: currency
                },
                canGenerateSignals: canGenerateSignals
            };

            await setEx(key, JSON.stringify(userData), 86400)

            return res.status(200).json({
                status: 'OK',
                code: 200,
                data: userData
            });
        } catch (error) {
            console.error(`[Auth] Erro após efetuar a requisição: ${error.message}`);
            console.error(error);

            return res.status(401).json({
                status: 'ERROR',
                code: 401,
                message: 'Autenticação inválida ou serviço temporariamente indisponível.',
                error: error.message
            });
        }
    }
})

export default router