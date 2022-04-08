import {
    AccountInfo,
    BlockResponse,
    ConfirmedTransactionMeta,
    Context,
    LAMPORTS_PER_SOL,
    PublicKey,
    TokenBalance,
    TransactionResponse,
} from '@solana/web3.js'
import { createClient } from '@supabase/supabase-js'
import { retryAsync } from 'ts-retry'
import {
    BURN,
    BUY,
    DE_LISTING,
    LISTING,
    PROGRAM_ACCOUNTS,
    PROGRAM_ACCOUNT_URLS,
    SELL,
} from './constants'
import { postSaleToDiscord } from './discord'
import { connection, logger, SUPABASE_KEY, SUPABASE_URL } from './settings'
import { NFTMetaType } from './types'
import { getMetaData } from './utils'

const wallets: string[] = []
export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_KEY ?? '')

/**
 * Retrieve a processed block from the solana cluster
 * @param slot Slot where block is located
 * @returns Fetched block
 */
const retrieveBlock = async (slot: number): Promise<BlockResponse> => {
    return await retryAsync(
        async () => {
            logger.info(`Attempting to retrieve block in slot: ${slot}`)
            return (await connection.getBlock(slot)) as BlockResponse
        },
        { delay: 300, maxTry: 3 }
    )
}

const onAccountChangeCallBack = async (
    _accountInfo: AccountInfo<Buffer>,
    context: Context
) => {
    logger.info('Account change detected')
    const { slot } = context
    let wallet: PublicKey = new PublicKey(PublicKey.default)

    try {
        const block: BlockResponse = await retrieveBlock(slot)
        const { transactions } = block

        logger.info('Searching transactions')
        const transaction = transactions.find((item) => {
            const { accountKeys } = item.transaction.message
            const publicKey = accountKeys.find((publicKey) =>
                wallets.includes(publicKey.toString())
            )
            if (publicKey) {
                wallet = publicKey
                return item
            }
        })?.transaction

        logger.info('Transaction found')
        const signature = transaction?.signatures[0] ?? ''
        logger.info(`Getting transaction signature: ${signature}`)

        const txn: TransactionResponse = (await connection.getTransaction(
            signature
        )) as TransactionResponse
        const { preBalances, postBalances } =
            txn.meta as ConfirmedTransactionMeta
        const preTokenBalances = txn.meta
            ?.preTokenBalances as Array<TokenBalance>
        const postTokenBalances = txn.meta
            ?.postTokenBalances as Array<TokenBalance>
        const price =
            Math.abs(preBalances[0] - postBalances[0]) / LAMPORTS_PER_SOL
        let mintToken = postTokenBalances[0]?.mint

        if (mintToken) {
            let tradeDirection = ''
            const accountKeys = txn.transaction.message.accountKeys
            const programAccount = accountKeys.at(-1)?.toString() as string

            for (const [key, value] of Object.entries(PROGRAM_ACCOUNTS)) {
                if (value.includes(programAccount)) {
                    let programAccountUrl = PROGRAM_ACCOUNT_URLS[key]
                    const walletString = wallet.toString() as string

                    if (key === 'MortuaryInc') {
                        tradeDirection = BURN
                        mintToken = preTokenBalances[1].mint
                    } else if (price < 0.009) {
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? LISTING
                                : DE_LISTING
                    } else if (key === 'Magic Eden') {
                        programAccountUrl += `/${mintToken}`
                        tradeDirection =
                            preTokenBalances[0].owner === walletString
                                ? SELL
                                : BUY
                    } else {
                        programAccountUrl += `/?token=${mintToken}`
                        tradeDirection =
                            postTokenBalances[0].owner === walletString
                                ? BUY
                                : SELL
                    }

                    const metadata = await getMetaData(mintToken)
                    const nftMeta: NFTMetaType = {
                        name: metadata.name,
                        tradeDirection,
                        price: price,
                        image: metadata.image,
                        transactionDate: txn.blockTime as number,
                        marketPlaceURL: programAccountUrl,
                    }
                    postSaleToDiscord(nftMeta, signature)
                }
            }
        } else {
            logger.info('Not an NFT transaction')
        }
    } catch (e) {
        logger.error(e)
    }
}

const runBot = async () => {
    logger.info('Starting GuiltySpark bot')

    const { data: walletmonitor } = await supabase
        .from('walletmonitor')
        .select('*')

    walletmonitor?.forEach((item) => {
        const { address } = item
        wallets.push(address)

        logger.info(`Subscribing to account changes for ${address}`)
        connection.onAccountChange(
            new PublicKey(address),
            onAccountChangeCallBack,
            'confirmed'
        )
    })
}

if (require.main) {
    void runBot()
}
