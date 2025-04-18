import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

import express from 'express'
import cors from 'cors'
import http from 'http'

const app = express()

const port = process.env.PORT;

// Configuração do CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001',  'https://iatradersignalsx.online', 
         'https://iatradersignalsx.site', 'https://api.iatradersignalsx.online', 
         'https://api.iatradersignalsx.site'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

import userRoutes from './routes/userRoutes.js'

// Logs de solicitação para depuração
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    
    // Adiciona um listener para quando a resposta for finalizada
    res.on('finish', () => {
        console.log(`[${timestamp}] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    });
    
    next();
});

// Rota de health check para monitoramento
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/user', userRoutes)

app.get('/', (req, res) => {
    console.log(`[Polarium API] Ei! Você não pode fazer isso!`)
    res.status(200).send('API está funcionando!');
})

// Criar um servidor HTTP com configurações de timeout aprimoradas
const server = http.createServer(app);

// Configurar timeouts para evitar que conexões penduradas bloqueiem o servidor
server.keepAliveTimeout = 65000; // Aumentar o keepAliveTimeout (65 segundos)
server.headersTimeout = 66000; // Deve ser maior que o keepAliveTimeout

// Função para gerar emails e senhas aleatórios
function generateRandomCredentials() {
    const randomString = Math.random().toString(36).substring(2, 8);
    return {
        email: `test${randomString}@example.com`,
        password: `pass${randomString}`
    };
}

// Função para fazer requisições paralelas
async function makeParallelRequests() {
    console.log('\n🚀 Iniciando teste de 100 requisições paralelas...');
    const startTime = Date.now();
    
    const requests = Array(100).fill().map(async (_, index) => {
        const { email, password } = generateRandomCredentials();
        try {
            const response = await axios.post(`http://localhost:${port}/user`, {
                email,
                password
            });
            
            return {
                success: true,
                email,
                status: response.status,
                fromCache: response.data.fromCache || false,
                duration: response.headers['x-response-time'] || 'N/A'
            };
        } catch (error) {
            return {
                success: false,
                email,
                error: error.message
            };
        }
    });

    const results = await Promise.all(requests);
    const endTime = Date.now();
    const totalDuration = endTime - startTime;

    // Análise dos resultados
    const successfulRequests = results.filter(r => r.success);
    const failedRequests = results.filter(r => !r.success);
    const cachedResponses = successfulRequests.filter(r => r.fromCache);

    console.log('\n📊 Resultados do Teste:');
    console.log(`Total de requisições: ${results.length}`);
    console.log(`Requisições bem-sucedidas: ${successfulRequests.length}`);
    console.log(`Requisições com falha: ${failedRequests.length}`);
    console.log(`Respostas do cache: ${cachedResponses.length}`);
    console.log(`Tempo total: ${totalDuration}ms`);
    console.log(`Média de tempo por requisição: ${(totalDuration / results.length).toFixed(2)}ms`);
    console.log(`Requisições por segundo: ${(results.length / (totalDuration / 1000)).toFixed(2)}`);

    // Log detalhado das falhas
    if (failedRequests.length > 0) {
        console.log('\n❌ Requisições com falha:');
        failedRequests.forEach(req => {
            console.log(`Email: ${req.email} - Erro: ${req.error}`);
        });
    }
}

// Adicionar um intervalo de verificação periódica para manter a API externa viva
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutos
setInterval(() => {
    console.log(`[${new Date().toISOString()}] Executando verificação de saúde interna...`);
    try {
        // Fazer uma solicitação simples para a rota de health
        fetch(`http://localhost:${port}/health`).then(response => {
            console.log(`[Verificação de Saúde] Status: ${response.status}`);
        }).catch(err => {
            console.error(`[Verificação de Saúde] Erro: ${err.message}`);
        });
    } catch (err) {
        console.error(`[Verificação de Saúde] Erro ao executar verificação: ${err.message}`);
    }
}, PING_INTERVAL);

// Agendar o teste de requisições paralelas
setTimeout(() => {
    makeParallelRequests();
}, 10000); // 10 segundos após o servidor iniciar

// Tratamento de erros para evitar que o servidor caia
process.on('uncaughtException', (err) => {
    console.error(`[${new Date().toISOString()}] Erro não tratado: ${err.message}`);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error(`[${new Date().toISOString()}] Rejeição não tratada: ${reason}`);
});

server.listen(port, '0.0.0.0', () => {
    console.log(`[Polarium API] Sistema inicializado com sucesso.`)
    console.log(`[Polarium API] Rodando na porta: ${port}`)
    console.log(`[Teste] Teste de 100 requisições será executado em 10 segundos...`)
})
