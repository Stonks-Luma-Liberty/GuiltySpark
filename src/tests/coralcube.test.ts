import { PublicKey, TokenBalance } from '@solana/web3.js'
import { DE_LISTING, LISTING } from '../constants'
import { connection } from '../settings'
import {
    fetchTransaction,
    inferMarketPlace,
    inferTradeDirection,
} from '../utils'

describe('CoralCube module', () => {
    test('infers transaction is a listing on coral cube', async () => {
        let tradeDirection = ''
        const signature =
            '3UfMKc4yVM9ATQYh3YrJ8aeYby7CTFLYHpN6dyNzvQDKgWcNUq9LGvVH1ZbEpizwL8WeychxkHxmFNKc16mpbBRo'
        const wallet: PublicKey = new PublicKey(
            '9ixrBE3dkqCqKSPz59fy6ApGsBEwGCa8pF45agPR6CgK'
        )

        const txn = await fetchTransaction(connection, signature)

        const preTokenBalances = txn.meta
            ?.preTokenBalances as Array<TokenBalance>
        const postTokenBalances = txn.meta
            ?.postTokenBalances as Array<TokenBalance>
        const mintToken = postTokenBalances[0]?.mint

        if (mintToken) {
            const accountKeys = txn.transaction.message.staticAccountKeys

            const marketPlace = await inferMarketPlace(accountKeys)

            if (marketPlace) {
                expect(marketPlace.name).toBe('CoralCube')
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
