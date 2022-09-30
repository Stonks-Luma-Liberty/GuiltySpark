import { Connection } from '@solana/web3.js'
import dotenv from 'dotenv'
import { Format } from 'logform'
import { createLogger, format, Logger, transports } from 'winston'
import { Connection as MetaplexConnection } from '@metaplex/js'
import { CoinGeckoClient } from 'coingecko-api-v3'

dotenv.config()

const myFormat: Format = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`
})

export const logger: Logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        myFormat
    ),
    transports: [new transports.Console({})],
})

export const { SUPABASE_URL } = process.env
export const { SUPABASE_KEY } = process.env
export const { DISCORD_WEBHOOK_URL } = process.env
export const SOLANA_CLUSTER_ENDPOINT = process.env
    .SOLANA_CLUSTER_ENDPOINT as string

export const connection = new Connection(SOLANA_CLUSTER_ENDPOINT, 'confirmed')
export const metaplexConnection = new MetaplexConnection(
    SOLANA_CLUSTER_ENDPOINT
)
export const coingeckoClient = new CoinGeckoClient({
    autoRetry: true,
})
