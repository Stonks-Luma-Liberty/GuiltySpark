import { programs } from '@metaplex/js'
import {
    Connection,
    PublicKey,
    TokenBalance,
    VersionedTransactionResponse,
} from '@solana/web3.js'
import axios from 'axios'
import {
    BUY,
    DE_LISTING,
    LISTING,
    MAX_SUPPORTED_TRANSACTION_VERSION,
    PROGRAM_ACCOUNTS,
    PROGRAM_ACCOUNT_URLS,
    SELL,
} from './constants'
import { logger, metaplexConnection } from './settings'
import { MarketPlace } from './types'

const {
    metadata: { Metadata },
} = programs

/**
 * It takes a token public key as an argument, gets the address of the metadata associated with that
 * token, loads the metadata from the metaplex, and then returns the data from the metadata's URI.
 * @param {string} tokenPubKey - The public key of the token you want to get metadata for.
 * @returns The data is being returned.
 */
export const getMetaData = async (tokenPubKey: string) => {
    logger.info('Getting token metadata')
    try {
        const addr = await Metadata.getPDA(tokenPubKey)
        const resp = await Metadata.load(metaplexConnection, addr)
        const { data } = await axios.get(resp.data.data.uri)

        return data
    } catch (error) {
        logger.error(error)
    }
}

/**
 * It takes an array of public keys and returns a market place object if it finds a match in the
 * `PROGRAM_ACCOUNTS` object
 * @param {PublicKey[]} accountKeys - PublicKey[]
 */
export const inferMarketPlace = async (
    accountKeys: PublicKey[]
): Promise<MarketPlace | null> => {
    logger.info('Inferring solana marketplace')
    for (const [key, value] of Object.entries(PROGRAM_ACCOUNTS)) {
        let account = accountKeys.find((publicKey) =>
            value.includes(publicKey.toString())
        )
        if (account) {
            return { name: key, url: PROGRAM_ACCOUNT_URLS[key] }
        }
    }
    return null
}

/**
 * It takes in a wallet address, a list of log messages, a list of token balances before the
 * transaction, and a list of token balances after the transaction, and returns a string representing
 * the trade direction
 * @param {string} wallet - string,
 * @param {string[]} logMessages - An array of strings that are the logs from the transaction.
 * @param {TokenBalance[]} preTokenBalances - TokenBalance[]
 * @param {TokenBalance[]} postTokenBalances - [{
 * @returns a string.
 */
export const inferTradeDirection = (
    wallet: string,
    logMessages: string[],
    preTokenBalances: TokenBalance[],
    postTokenBalances: TokenBalance[]
) => {
    logger.info('Determining trade direction')
    const isListingInstruction = Boolean(
        logMessages.find(
            (message) =>
                message.includes('Instruction: List item') ||
                message.includes('Instruction: Sell')
        )
    )
    const isDelistingInstruction = Boolean(
        logMessages.find(
            (message) =>
                message.includes('Instruction: CancelSell') ||
                message.includes('Instruction: Cancel listing')
        )
    )
    const isBuyInstruction = Boolean(
        logMessages.find((message) => message.includes('Instruction: Deposit'))
    )

    if (isListingInstruction) {
        return LISTING
    }

    if (isDelistingInstruction) {
        return DE_LISTING
    }

    if (isBuyInstruction) {
        return postTokenBalances[0].owner === wallet ? BUY : SELL
    }
    return ''
}

/**
 * It fetches a transaction from the blockchain using the connection object and the transaction
 * signature
 * @param {Connection} connection - Connection - The connection to the node.
 * @param {string} signature - The signature of the transaction you want to fetch.
 * @returns A VersionedTransactionResponse object.
 */
export const fetchTransaction = async (
    connection: Connection,
    signature: string
): Promise<VersionedTransactionResponse> => {
    logger.info(`Getting transaction signature: ${signature}`)
    const txn = await connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: MAX_SUPPORTED_TRANSACTION_VERSION,
    })

    if (txn == null) {
        throw new Error('Captured transaction is null')
    }
    return txn
}
