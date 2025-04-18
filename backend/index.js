import dotenv from 'dotenv'

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
})
