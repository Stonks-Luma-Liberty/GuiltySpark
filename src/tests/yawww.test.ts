import {
    ConfirmedTransactionMeta,
    LAMPORTS_PER_SOL,
    PublicKey,
    TokenBalance,
} from '@solana/web3.js'
import { BUY, LISTING, SELL } from '../constants'
import { connection } from '../settings'
import { inferMarketPlace, inferTradeDirection } from '../utils'

describe('Yawww module', () => {
    test('infers transaction is a listing on yawww', async () => {
        let tradeDirection = ''
        const signature =
            '4cELCb4pXHKbutYzoYYnQQBuAa8sEL5c87UAKu7rfHT5Gn3JnanudeBhuLtp5CQRHARpvtNG87Xt3yr76QVqo7hj'
        const wallet: PublicKey = new PublicKey(
            '9ixrBE3dkqCqKSPz59fy6ApGsBEwGCa8pF45agPR6CgK'
        )

        const txn = await connection.getTransaction(signature, {
            commitment: 'finalized',
            maxSupportedTransactionVersion: 2,
        })

        if (txn == null) {
            throw new Error('Captured transaction is null')
        }

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
            const accountKeys = txn.transaction.message.staticAccountKeys

            const marketPlace = await inferMarketPlace(accountKeys)

            if (marketPlace) {
                tradeDirection = await inferTradeDirection(
                    wallet.toString(),
                    txn.meta?.logMessages || [],
                    preTokenBalances || [],
                    postTokenBalances || []
                )
            }
        }
        expect(tradeDirection).toBe(LISTING)
    })
})
