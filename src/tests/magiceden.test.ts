import { describe, expect, test } from '@jest/globals'
import { PublicKey, TokenBalance } from '@solana/web3.js'
import { BUY, DE_LISTING, LISTING, SELL } from '../constants'
import { connection } from '../settings'
import {
    fetchTransaction,
    inferMarketPlace,
    inferTradeDirection,
} from '../utils'

describe('MagicEden module', () => {
    test('infers transaction is a buy transaction from magiceden', async () => {
        let tradeDirection = ''
        const signature =
            '35VQpsWAvNPdTcdZDNhvqEHUU1io4nP6WQKqDqsod4i7ci6VQXHwTyAD5FDjA2AdMphEq9WDBUzYHPbJR5qxQNcZ'
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
                tradeDirection = inferTradeDirection(
                    wallet.toString(),
                    txn.meta?.logMessages || [],
                    preTokenBalances || [],
                    postTokenBalances || []
                )
            }
        }
        expect(tradeDirection).toBe(BUY)
    })

    test('infers transaction is a sell transaction from magiceden', async () => {
        let tradeDirection = ''
        const signature =
            '2copWXxMmGegtb4D82KqaZioLWUhHSM6zTm48JzrVSxp5vbS4gShLnUtqoxrtRtNg7XZs6ScoiL6XQ7NswVkTt5r'
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
                tradeDirection = inferTradeDirection(
                    wallet.toString(),
                    txn.meta?.logMessages || [],
                    preTokenBalances || [],
                    postTokenBalances || []
                )
            }
        }
        expect(tradeDirection).toBe(SELL)
    })

    test('infers transaction is a listing on magiceden', async () => {
        let tradeDirection = ''
        const signature =
            '5eVhCcNmayKNoeuY7rHLQ34er75et6nuApuiKvr75buAdd7eNt2Hq5payXE1iNQMAHetqeHF1Qo3n5FSMpspaepP'
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

    test('infers transaction is a de-listing on magiceden', async () => {
        let tradeDirection = ''
        const signature =
            '2yWGifrkZjko85TyyAuDoZUbiwhJJL59J4XbBXxqS9KttxFokpD1Ckc8H6hVQ7Uvf18erFKRpMguQ5Mz6uxhcWTz'
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
