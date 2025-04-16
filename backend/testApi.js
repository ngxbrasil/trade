import dotenv from 'dotenv';
import axios from 'axios';
import { ClientSdk, LoginPasswordAuthMethod } from '@quadcode-tech/client-sdk-js';

// Carrega variáveis de ambiente
dotenv.config();

// Obtém email e senha dos parâmetros da linha de comando
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('\nUso: node testApi.js <email> <senha>\n');
  process.exit(1);
}

console.log('\n=== TESTE DE CONEXÃO API POLARIUM ===');
console.log(`Configurações atuais:`);
console.log(`- API_URL: ${process.env.API_URL}`);
console.log(`- PLATFORM_ID: ${process.env.PLATFORM_ID}`);
console.log(`- WEBSOCKET_API_ENDPOINT: ${process.env.WEBSOCKET_API_ENDPOINT}`);
console.log(`- Email: ${email}\n`);

/**
 * Testa conexão direta com a API
 */
async function testDirectApi() {
  console.log('=== TESTE 1: Conexão direta com a API ===');
  try {
    // Tenta fazer uma requisição GET para a URL base da API
    console.log(`Testando conexão com ${process.env.API_URL}...`);
    const response = await axios.get(process.env.API_URL, {
      timeout: 10000,
      validateStatus: () => true // Aceita qualquer código de status
    });

    console.log(`Sucesso! Status: ${response.status}`);
    console.log(`Headers: ${JSON.stringify(response.headers)}`);
    console.log('Dados recebidos:');
    console.log(JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
    return true;
  } catch (error) {
    console.error(`Falha na conexão direta:`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Dados: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error(`Sem resposta da API. Possível problema de rede ou timeout.`);
    } else {
      console.error(`Erro: ${error.message}`);
    }
    return false;
  }
}

/**
 * Testa diferentes configurações de login
 */
async function testLoginConfigurations() {
  console.log('\n=== TESTE 2: Configurações de Login ===');
  
  // URLs para testar
  const apiUrls = [
    {name: "URL Original", url: process.env.API_URL},
    {name: "URL sem /", url: process.env.API_URL.endsWith('/') ? process.env.API_URL.slice(0, -1) : process.env.API_URL},
    {name: "URL com /api", url: `${process.env.API_URL.replace(/\/+$/, '')}/api`},
    {name: "URL Alternativa", url: "https://trade.polariumbroker.com/api"}
  ];
  
  let anySuccess = false;

  for (const apiConfig of apiUrls) {
    try {
      console.log(`\nTestando login com: ${apiConfig.name} (${apiConfig.url})...`);
      
      // Estrutura do corpo da requisição para login
      const loginData = {
        email: email,
        password: password
      };
      
      // Faz a requisição para a API
      const response = await axios.post(`${apiConfig.url}/auth`, loginData, {
        timeout: 15000,
        validateStatus: () => true, // Aceita qualquer código de status
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Status: ${response.status}`);
      
      if (response.status >= 200 && response.status < 300) {
        console.log('✅ Login bem-sucedido!');
        console.log('Resposta resumida:');
        console.log(JSON.stringify(response.data, null, 2).substring(0, 300) + '...');
        anySuccess = true;
      } else {
        console.log('❌ Login falhou');
        console.log(`Resposta: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao testar ${apiConfig.name}:`);
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Dados: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error(`Sem resposta da API. Possível problema de rede ou timeout.`);
      } else {
        console.error(`Erro: ${error.message}`);
      }
    }
  }
  
  return anySuccess;
}

/**
 * Testa a rota /user do backend local
 */
async function testLocalUserRoute() {
  console.log('\n=== TESTE 3: Rota /user do Backend Local ===');
  try {
    // URL do backend local - assumindo que esteja rodando na porta 3001
    const localBackendUrl = 'http://localhost:3001';
    
    console.log(`Testando rota POST /user no backend local (${localBackendUrl}/user)...`);
    
    // Corpo da requisição com email e senha
    const userData = {
      email,
      password
    };
    
    // Tenta fazer a requisição POST para a rota /user
    const response = await axios.post(`${localBackendUrl}/user`, userData, {
      timeout: 20000,
      validateStatus: () => true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ Requisição bem-sucedida!');
      console.log('Resposta resumida:');
      console.log(JSON.stringify(response.data, null, 2).substring(0, 500) + '...');
      return true;
    } else {
      console.log('❌ Requisição falhou');
      console.log(`Resposta: ${JSON.stringify(response.data)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erro ao testar rota /user local:`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Dados: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error(`Sem resposta do backend local. Verifique se o servidor está rodando.`);
    } else {
      console.error(`Erro: ${error.message}`);
    }
    return false;
  }
}

/**
 * Testa a SDK diretamente
 */
async function testClientSdk() {
  console.log('\n=== TESTE 4: ClientSdk Direto ===');
  
  // Configurações para testar
  const configs = [
    {
      name: "Configuração Original",
      websocketEndpoint: process.env.WEBSOCKET_API_ENDPOINT,
      platformId: process.env.PLATFORM_ID,
      apiUrl: process.env.API_URL
    },
    {
      name: "URL Alternativa",
      websocketEndpoint: process.env.WEBSOCKET_API_ENDPOINT,
      platformId: process.env.PLATFORM_ID,
      apiUrl: "https://trade.polariumbroker.com/api"
    }
  ];
  
  let anySuccess = false;
  
  for (const config of configs) {
    try {
      console.log(`\nTestando ClientSdk com: ${config.name} (${config.apiUrl})...`);
      console.log(`- WebSocket: ${config.websocketEndpoint}`);
      console.log(`- Platform ID: ${config.platformId}`);
      
      // Cria instância da SDK
      console.log(`Conectando via ClientSdk...`);
      
      const sdk = await ClientSdk.create(
        config.websocketEndpoint,
        config.platformId,
        new LoginPasswordAuthMethod(config.apiUrl, email, password),
        { timeout: 15000 }
      );
      
      console.log('✅ Conexão bem-sucedida!');
      
      // Tenta obter o perfil do usuário
      const profile = sdk.userProfile;
      console.log(`Perfil do usuário: ID=${profile.userId}, Nome=${profile.firstName} ${profile.lastName}`);
      
      // Tenta obter saldo
      console.log(`Buscando saldo...`);
      const balances = await sdk.balances();
      const realBalances = balances.getBalances().filter(balance => balance.type == 'real');
      console.log(`Saldo: ${realBalances[0]?.amount || 0} ${realBalances[0]?.currency || 'BRL'}`);
      
      anySuccess = true;
    } catch (error) {
      console.error(`❌ Erro com ${config.name}:`);
      console.error(`Mensagem: ${error.message}`);
      
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Dados: ${JSON.stringify(error.response.data || {})}`);
      }
    }
  }
  
  return anySuccess;
}

/**
 * Função principal que executa todos os testes
 */
async function runTests() {
  try {
    // Testa conexão direta
    const directApiSuccess = await testDirectApi();
    
    // Testa configurações de login
    const loginSuccess = await testLoginConfigurations();
    
    // Testa rota /user do backend local
    const userRouteSuccess = await testLocalUserRoute();
    
    // Testa SDK diretamente
    const sdkSuccess = await testClientSdk();
    
    // Resumo
    console.log('\n=== RESUMO DOS TESTES ===');
    console.log(`Conexão Direta à API: ${directApiSuccess ? '✅ Sucesso' : '❌ Falha'}`);
    console.log(`Login API: ${loginSuccess ? '✅ Pelo menos uma configuração funcionou' : '❌ Todas as configurações falharam'}`);
    console.log(`Rota /user Local: ${userRouteSuccess ? '✅ Sucesso' : '❌ Falha'}`);
    console.log(`ClientSdk Direto: ${sdkSuccess ? '✅ Sucesso' : '❌ Falha'}`);
    
    if (!directApiSuccess && !loginSuccess && !sdkSuccess) {
      console.log('\n⚠️ TODOS OS TESTES DE API FALHARAM');
      console.log('Sugestões:');
      console.log('1. Verifique se a API_URL no arquivo .env está correta');
      console.log('2. Confirme se existe conectividade com a internet');
      console.log('3. Verifique se o servidor da Polarium está no ar');
      console.log('4. Tente as URLs alternativas manualmente no código');
    }
    
    if (!userRouteSuccess) {
      console.log('\n⚠️ TESTE LOCAL FALHOU');
      console.log('Sugestões:');
      console.log('1. Verifique se o servidor backend está rodando na porta 3001');
      console.log('2. Confira os logs do servidor para ver detalhes do erro');
      console.log('3. Verifique se as variáveis de ambiente estão configuradas corretamente');
    }
  } catch (error) {
    console.error('Erro ao executar testes:', error);
  }
}

// Executa os testes
runTests(); 