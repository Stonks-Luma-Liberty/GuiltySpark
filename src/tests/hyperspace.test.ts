import { PublicKey, TokenBalance } from '@solana/web3.js'
import { DE_LISTING, LISTING } from '../constants'
import { connection } from '../settings'
import {
    fetchTransaction,
    inferMarketPlace,
    inferTradeDirection,
} from '../utils'

describe('Hyperspace module', () => {
    test('infers transaction is a listing on hyperspace', async () => {
        let tradeDirection = ''
        const signature =
            'eW3LoxAbSquSjKELvS6pAKxUvkMX5EYazY93ED5DcDGMaMzroV5sPjiFsUNAfHz8zv3uvGzkrEiPT4rPWLmDk26'
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
                expect(marketPlace.name).toBe('Hyperspace')
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

    test('infers transaction is a listing on hyperspace', async () => {
        let tradeDirection = ''
        const signature =
            '3HJnUPRy6dFGFGGiJWxb5GPJ9GvfyJdXAjqfGffoU9Ndyxfb1eT5dagqWfhw4UBPE4MSR8RRwoguk2RSEGdei6J5'
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
                expect(marketPlace.name).toBe('Hyperspace')
                tradeDirection = inferTradeDirection(
                    wallet.toString(),
                    txn.meta?.logMessages || [],
                    preTokenBalances || [],
                    postTokenBalances || []
                )
            }
        }
        expect(tradeDirection).toBe(DE_LISTING)
    })
})
