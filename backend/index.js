import dotenv from 'dotenv'

dotenv.config()

import express from 'express'
import cors from 'cors'

const app = express()

const port = process.env.PORT || 5000;

// Configuração do CORS
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

import userRoutes from './routes/userRoutes.js'

app.use('/user', userRoutes)

app.get('/', (req, res) => {
    console.log(`[Polarium API] Ei! Você não pode fazer isso!`)
})

app.listen(port, '0.0.0.0', () => {
    console.log(`[Polarium API] Sistema inicializado com sucesso.`)
    console.log(`[Polarium API] Rodando na porta: ${port}`)
})
