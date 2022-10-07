import { PublicKey, TokenBalance } from '@solana/web3.js'
import { LISTING } from '../constants'
import { connection } from '../settings'
import { inferMarketPlace, inferTradeDirection } from '../utils'

describe('Solanart module', () => {
    test('infers transaction is a listing on solanart', async () => {
        let tradeDirection = ''
        const signature =
            'aJZt4c9Rjde8aj3AByeoDvixCLGnc5mE82PqtuRDAZPeNqCMrPJvQZUjAiiYNKwfjf7fKSSH6CDeJSWnB4QzMP7'
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
