import { PublicKey, TokenBalance } from '@solana/web3.js'
import { LISTING } from '../constants'
import { connection } from '../settings'
import { inferMarketPlace, inferTradeDirection } from '../utils'

describe('Opensea module', () => {
    test('infers transaction is a listing on opensea', async () => {
        let tradeDirection = ''
        const signature =
            '4SPTzT94AaZ3ANnEs8YfnqxhAbgdZSZpiQRJRUQnJHDv3YR7CwmjjpNBVRtyj6NxdkyFjBeSHTakjDX85EbqE5gT'
        const wallet: PublicKey = new PublicKey(
            '9ixrBE3dkqCqKSPz59fy6ApGsBEwGCa8pF45agPR6CgK'
        )

        const txn = await connection.getTransaction(signature, {
            commitment: 'finalized',
            maxSupportedTransactionVersion: 2,
        })

        if (txn === null) {
            throw new Error('Captured transaction is null')
        }

        const preTokenBalances = txn.meta
            ?.preTokenBalances as Array<TokenBalance>
        const postTokenBalances = txn.meta
            ?.postTokenBalances as Array<TokenBalance>
        const mintToken = postTokenBalances[0]?.mint

        if (mintToken) {
            const accountKeys = txn.transaction.message.staticAccountKeys

            const marketPlace = await inferMarketPlace(accountKeys)

            if (marketPlace) {
                tradeDirection = inferTradeDirection(
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
