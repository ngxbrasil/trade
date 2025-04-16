import { Router } from 'express'
import { ClientSdk, LoginPasswordAuthMethod } from '@quadcode-tech/client-sdk-js'

const router = Router()

// Cache para armazenar autenticações recentes e reduzir chamadas à API
// Chave: email:senha, Valor: { data: dados do usuário, timestamp: hora de criação }
const authCache = new Map();
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutos em milissegundos

// Função para tentar conectar à API externa com retentativas
async function connectWithRetries(email, password, attempts = 3) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
        try {
            console.log(`[AuthAttempt] Tentativa ${i+1} para ${email}`);
            
            const sdk = await ClientSdk.create(
                process.env.WEBSOCKET_API_ENDPOINT,
                process.env.PLATFORM_ID,
                new LoginPasswordAuthMethod(process.env.API_URL, email, password),
                // Adicionando timeout para a conexão
                { timeout: 10000 } // 10 segundos de timeout
            );

            console.log(`[AuthSuccess] Conectado com sucesso para ${email}`);
            return sdk;
        } catch (error) {
            console.error(`[AuthError] Tentativa ${i+1} falhou: ${error.message}`);
            lastError = error;
            
            // Aguardar antes da próxima tentativa (tempo exponencial)
            if (i < attempts - 1) {
                const delay = Math.pow(2, i) * 1000; // Backoff exponencial
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    throw lastError;
}

// Limpador periódico de cache expirado
const cleanupInterval = setInterval(() => {
    const now = Date.now();
    console.log(`[CacheCleanup] Verificando itens expirados no cache de autenticação...`);
    
    for (const [key, value] of authCache.entries()) {
        if (now - value.timestamp > CACHE_EXPIRY) {
            console.log(`[CacheCleanup] Removendo item expirado: ${key.split(':')[0]}`);
            authCache.delete(key);
        }
    }
}, 5 * 60 * 1000); // Verificar a cada 5 minutos

// Para evitar vazamentos de memória se o módulo for reiniciado
process.on('exit', () => {
    clearInterval(cleanupInterval);
});

router.post('/', async (req, res) => {
    const startTime = Date.now();
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                status: 'ERROR',
                code: 400,
                message: 'Email e senha são obrigatórios.'
            })
        }
        
        // Gerar chave de cache
        const cacheKey = `${email}:${password}`;
        
        // Verificar se já temos uma autenticação em cache
        if (authCache.has(cacheKey)) {
            const cachedAuth = authCache.get(cacheKey);
            const cacheAge = Date.now() - cachedAuth.timestamp;
            
            // Se o cache ainda é válido
            if (cacheAge < CACHE_EXPIRY) {
                console.log(`[Auth] Usando dados em cache para ${email} (idade: ${cacheAge / 1000}s)`);
                return res.status(200).json({
                    status: 'OK',
                    code: 200,
                    data: cachedAuth.data,
                    fromCache: true
                });
            } else {
                // Cache expirado, removê-lo
                console.log(`[Auth] Cache expirado para ${email}, removendo`);
                authCache.delete(cacheKey);
            }
        }

        // Tentar conectar à API externa com retentativas
        console.log(`[Auth] Iniciando autenticação para ${email}`);
        const sdk = await connectWithRetries(email, password);

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
            platformId: process.env.PLATFORM_ID,
            apiUrl: process.env.API_URL,
            websocketApiEndpoint: process.env.WEBSOCKET_API_ENDPOINT,
            balance: {
                amount: amount,
                currency: currency
            },
            canGenerateSignals: canGenerateSignals
        };
        
        // Armazenar no cache
        authCache.set(cacheKey, {
            data: userData,
            timestamp: Date.now()
        });
        
        const processingTime = Date.now() - startTime;
        console.log(`[Auth] Autenticação bem-sucedida para ${email} em ${processingTime}ms`);

        return res.status(200).json({
            status: 'OK',
            code: 200,
            data: userData
        });
    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`[Auth] Erro após ${processingTime}ms: ${error.message}`);
        console.error(error.stack);
        
        return res.status(401).json({
            status: 'ERROR',
            code: 401,
            message: 'Autenticação inválida.',
            error: error.message
        });
    }
});

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
            minBalance: 60 
        });
    } catch (error) {
        console.error(`[CheckSignals] Erro: ${error.message}`);
        return res.status(500).json({
            status: 'ERROR',
            code: 500,
            message: 'Erro ao verificar elegibilidade para sinais.',
            error: error.message
        });
    }
});

// Rota adicional para verificação da autenticação
router.get('/check', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        code: 200,
        message: 'Serviço de autenticação está funcionando.',
        cacheSize: authCache.size,
        uptime: process.uptime()
    });
});

export default router