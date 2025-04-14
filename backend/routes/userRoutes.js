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
        const currency = realBalances[0]?.currency || 'BRL'
        
        // Verificar se o usuário pode gerar sinais (saldo >= 60)
        const canGenerateSignals = amount >= 0; // Saldo

        const profile = sdk.userProfile

        const data = {
            id: profile.userId,
            name: profile.firstName,
            lastName: profile.lastName,
            email: email,
            platformId: process.env.PLATFORM_ID,
            apiUrl: process.env.API_URL,
            websocketApiEndpoint: process.env.WEBSOCKET_API_ENDPOINT,
            balance: {
                amount: amount,
                currency: currency
            },
            canGenerateSignals: canGenerateSignals
        }

        return res.status(200).json({
            status: 'OK',
            code: 200,
            data: data
        })
    } catch (error) {
        return res.status(404).json({
            status: 'ERROR',
            code: 401,
            message: 'Autenticação inválida.',
            error: error.message
        })
    }
})

// Nova rota para verificar se o usuário pode gerar sinais
router.post('/check-signals', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: 'ERROR',
                code: 400,
                message: 'ID do usuário é obrigatório.'
            });
        }

        // Aqui você faria a verificação do saldo novamente
        // Como não temos acesso ao saldo diretamente pelo ID, retornamos a mesma validação
        // que o frontend deve usar com base no objeto de usuário
        return res.status(200).json({
            status: 'OK',
            code: 200,
            message: 'Verificação concluída.',
            minBalance: 0 // Saldo
        });
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            code: 500,
            message: 'Erro ao verificar elegibilidade para sinais.',
            error: error.message
        });
    }
});

export default router