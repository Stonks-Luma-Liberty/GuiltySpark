import axios from 'axios'
import { DISCORD_WEBHOOK_URL, logger } from './settings'
import { NFTMetaType } from './types'

export const postSaleToDiscord = (
    nftMeta: NFTMetaType,
    signature: string
): void => {
    logger.info('Posting sale info to discord')
    const {
        tradeDirection,
        name,
        marketPlaceURL,
        price,
        transactionDate,
        image,
    } = nftMeta
    axios.post(DISCORD_WEBHOOK_URL as string, {
        embeds: [
            {
                title: `NFT ${tradeDirection}`,
                description: `[${name}](${marketPlaceURL})`,
                fields: [
                    {
                        name: 'Price',
                        value: `${price} SOL`,
                        inline: true,
                    },
                    {
                        name: 'Date',
                        value: `<t:${transactionDate}>`,
                        inline: true,
                    },
                    {
                        name: 'Explorer',
                        value: `[SolScan](https://solscan.io/tx/${signature})`,
                    },
                ],
                image: {
                    url: `${image}`,
                },
            },
        ],
    })
}
