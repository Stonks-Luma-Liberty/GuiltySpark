import axios from 'axios';
import {logger} from './index.js';

export const postSaleToDiscord = (title, tradeDirection, price, date, signature, imageURL) => {
    logger.info("Posting sale info to discord");
    axios.post(process.env.DISCORD_WEBHOOK_URL,
        {
            "embeds": [
                {
                    "title": `Sale`,
                    "description": `${tradeDirection}:  ${title}`,
                    "fields": [
                        {
                            "name": "Price",
                            "value": `${price} SOL`,
                            "inline": true
                        },
                        {
                            "name": "Date",
                            "value": `${date}`,
                            "inline": true
                        },
                        {
                            "name": "Explorer",
                            "value": `https://explorer.solana.com/tx/${signature}`
                        }
                    ],
                    "image": {
                        "url": `${imageURL}`,
                    }
                }
            ]
        }
    )
}
