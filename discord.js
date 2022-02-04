import axios from 'axios';
import { logger } from './index.js';

export const postSaleToDiscord = (nftMeta, signature) => {
    logger.info("Posting sale info to discord")
    const { tradeDirection, name, marketPlaceURL, price, transactionDate, image } = nftMeta
    axios.post(process.env.DISCORD_WEBHOOK_URL,
        {
            "embeds": [
                {
                    "title": `NFT ${tradeDirection}`,
                    "description": `[${name}](${marketPlaceURL})`,
                    "fields": [
                        {
                            "name": "Price",
                            "value": `${price} SOL`,
                            "inline": true
                        },
                        {
                            "name": "Date",
                            "value": `<t:${transactionDate}>`,
                            "inline": true
                        },
                        {
                            "name": "Explorer",
                            "value": `[SolScan](https://solscan.io/tx/${signature})`
                        }
                    ],
                    "image": {
                        "url": `${image}`,
                    }
                }
            ]
        }
    )
}
