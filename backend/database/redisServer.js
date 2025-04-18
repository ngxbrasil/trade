import { createClient } from 'redis'

const redis = createClient()

redis.on('error', (err) => {
    console.error('Redis Error', err)
})

await redis.connect()
    .then(() => console.log(`[Redis] Conexão estabelecida com sucesso!`))

export const setEx = async (key, value, expirationTime = 3600) => {
    try {
        await redis.set(key, value, {
            EX: expirationTime // expiration time in seconds
        })
        return true
    } catch (error) {
        console.error(`[Redis] Erro ao definir chave temporária: ${error}`)
        return false
    }
}

export const get = async (key) => {
    try {
        const value = await redis.get(key)
        return value
    } catch (error) {
        console.error(`[Redis] Erro ao obter chave: ${error}`)
        return null
    }
}

export const has = async (key) => {
    try {
        const exists = await redis.exists(key)
        return exists > 0
    } catch (error) {
        console.error(`[Redis] Erro ao verificar se a chave existe: ${error}`)
        return false
    }
}

export const deleteKey = async (key) => {
    try {
        await redis.del(key)
        return true
    } catch (error) {
        console.error(`[Redis] Erro ao deletar a chave (${key}): ${error}`)
        return false
    }
}

export { redis }
