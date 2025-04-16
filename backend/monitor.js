// Arquivo de monitoramento para garantir que o API esteja funcionando
import dotenv from 'dotenv';
import fs from 'fs';
import { exec } from 'child_process';
import http from 'http';

dotenv.config();

// Configurações
const port = process.env.PORT || 5001;
const CHECK_INTERVAL = 60 * 1000; // Verificar a cada 1 minuto
const healthEndpoint = `http://localhost:${port}/health`;
const userCheckEndpoint = `http://localhost:${port}/user/check`;
const logFile = './monitor.log';

// Função para escrever no log
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    // Acrescentar ao arquivo de log
    fs.appendFileSync(logFile, logMessage + '\n');
}

// Função para verificar se o servidor está respondendo
async function checkServerHealth() {
    try {
        // Verificar o endpoint de health
        const healthResponse = await fetch(healthEndpoint);
        if (healthResponse.status !== 200) {
            throw new Error(`Health check falhou com status ${healthResponse.status}`);
        }
        
        // Verificar o endpoint do userRoutes
        const userResponse = await fetch(userCheckEndpoint);
        if (userResponse.status !== 200) {
            throw new Error(`User check falhou com status ${userResponse.status}`);
        }
        
        log("Servidor está saudável!");
        return true;
    } catch (error) {
        log(`Erro na verificação de saúde: ${error.message}`);
        return false;
    }
}

// Função para reiniciar o servidor
function restartServer() {
    log("Tentando reiniciar o servidor...");
    
    // Comandos de reinicialização dependem de como o servidor está sendo executado
    // Por exemplo, se estiver usando PM2:
    exec('pm2 restart all', (error, stdout, stderr) => {
        if (error) {
            log(`Erro ao reiniciar: ${error.message}`);
            return;
        }
        if (stderr) {
            log(`Erro: ${stderr}`);
            return;
        }
        log(`Reinicialização iniciada: ${stdout}`);
    });
}

// Função principal de monitoramento
async function monitor() {
    log("Iniciando monitoramento do servidor API...");
    
    // Verificar imediatamente
    const isHealthy = await checkServerHealth();
    if (!isHealthy) {
        log("Servidor não está saudável na verificação inicial!");
        restartServer();
    }
    
    // Configurar verificação periódica
    setInterval(async () => {
        log("Executando verificação periódica...");
        const isHealthy = await checkServerHealth();
        
        if (!isHealthy) {
            log("Servidor não está respondendo corretamente!");
            restartServer();
        }
    }, CHECK_INTERVAL);
}

// Iniciar o monitoramento
monitor().catch(error => {
    log(`Erro fatal no monitoramento: ${error.message}`);
    process.exit(1);
}); 