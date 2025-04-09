import { Router } from 'express'
import { ClientSdk, LoginPasswordAuthMethod } from '@quadcode-tech/client-sdk-js'

const router = Router()

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                status: 'ERROR',
                code: 400,
                message: 'Email e senha são obrigatórios.'
            })
        }

        const sdk = await ClientSdk.create(
            process.env.WEBSOCKET_API_ENDPOINT,
            process.env.PLATFORM_ID,
            new LoginPasswordAuthMethod(process.env.API_URL, email, password)
        )

        const balances = await sdk.balances()
        const realBalances = balances.getBalances().filter(balance => balance.type == 'real')

        const amount = realBalances[0]?.amount || 0

        if (amount < 0) {
            return res.status(401).json({
                status: 'AMOUNT_ERROR',
                code: 401,
                message: 'Saldo insuficiente.'
            })
        }

        const currency = realBalances[0]?.currency || 'BRL'
        
        const data = {
            id: sdk.userProfile.userId,
            name: sdk.userProfile.name,
            email: email,
            platformId: process.env.PLATFORM_ID,
            apiUrl: process.env.API_URL,
            websocketApiEndpoint: process.env.WEBSOCKET_API_ENDPOINT,
            balance: {
                amount: amount,
                currency: currency
            }
        }

        res.status(200).json({
            status: 'OK',
            code: 200,
            data: data
        })

        // Atualizar o saldo do usuário
    } catch (error) {
        res.status(404).json({
            status: 'ERROR',
            code: 401,
            message: 'Autenticação inválida.',
            error: error.message
        })
    }
})

export default router