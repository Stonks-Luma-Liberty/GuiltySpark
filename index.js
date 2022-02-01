import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js'
import { clusterApiUrl, Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Connection as MetaplexConnection, programs } from '@metaplex/js';
import axios from 'axios';
import { createLogger, format, transports } from 'winston';
import { postSaleToDiscord } from './discord.js'

dotenv.config()

let wallets = []
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


const myFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        myFormat),
    transports: [new transports.Console({})],
});

const marketPlaces = {
    "Magic Eden": ["MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8", "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K"]
}
const marketPlaceURLs = {
    "Magic Eden": "https://www.magiceden.io/item-details"
}

const { SOLANA_CLUSTER_ENDPOINT } = process.env
const { metadata: { Metadata } } = programs;
const connection = new Connection(
    clusterApiUrl(SOLANA_CLUSTER_ENDPOINT),
    'confirmed',
);
const metaplexConnection = new MetaplexConnection(SOLANA_CLUSTER_ENDPOINT);
logger.info(`Connected to solana cluster ${SOLANA_CLUSTER_ENDPOINT}`)


const getMetaData = async (tokenPubKey) => {
    try {
        const addr = await Metadata.getPDA(tokenPubKey)
        const resp = await Metadata.load(metaplexConnection, addr);
        const { data } = await axios.get(resp.data.data.uri);

        return data;
    } catch (error) {
        logger.error(error)
    }
}


const onAccountChangeCallBack = async (accountInfo, context) => {
    logger.info("Account change detected")
    const { slot } = context;
    let wallet = null
    logger.info(`Slot: ${slot}`)

    logger.info("Retrieving block")

    try {
        let block = await connection.getBlock(slot);
        const { transactions } = block;

        logger.info("Searching transactions")
        const transaction = transactions.find(item => {
            const { accountKeys } = item.transaction.message;
            let publicKey = accountKeys.find(publicKey => wallets.includes(publicKey.toString()));
            if (publicKey) {
                wallet = publicKey
                return item;
            }
        })?.transaction;

        logger.info("Transaction found")
        const signature = transaction.signatures[0];
        logger.info(`Getting transaction signature: ${signature}`)

        const txn = await connection.getTransaction(signature);
        const date = new Date(txn.blockTime * 1000).toLocaleString();
        const { preBalances, postBalances, postTokenBalances, preTokenBalances } = txn.meta;
        const price = Math.abs((preBalances[0] - postBalances[0])) / LAMPORTS_PER_SOL;
        const mintToken = postTokenBalances[0]?.mint

        if (mintToken) {
            let tradeDirection = ""

            if (price < 0.009) {
                tradeDirection = "Listed"
            }
            else {
                tradeDirection = preTokenBalances[0].owner === wallet.toString() ? "Sold" : "Bought"
            }
            const { accountKeys } = txn.transaction.message;
            const marketplaceAccount = accountKeys.at(-1).toString();

            for (const [key, value] of Object.entries(marketPlaces)) {
                if (value.includes(marketplaceAccount)) {
                    const marketPlaceURL = marketPlaceURLs[key]
                    const metadata = await getMetaData(mintToken);
                    postSaleToDiscord(metadata.name, tradeDirection, price, date, signature, metadata.image)
                    console.log("-------------------------------------------")
                    console.log(`Sale at ${new Date(txn.blockTime * 1000).toLocaleString()} ---> ${tradeDirection} for ${price} SOL`)
                    console.log("Signature: ", signature)
                    console.log("Name: ", metadata.name)
                    console.log("Image: ", metadata.image)
                    console.log(`Marketplace: ${marketPlaceURL}/${mintToken}`)
                    console.log("-------------------------------------------")
                }
            }
        }
        else {
            logger.info("Not an NFT transaction")
        }

    } catch (e) {
        logger.exceptions(e)
    }


};

const runBot = async () => {
    logger.info("Starting GuiltySpark bot")

    let { data: walletmonitor, error } = await supabase
        .from('walletmonitor')
        .select('*')

    walletmonitor.forEach(item => {
        const { address } = item
        wallets.push(address)

        logger.info(`Subscribing to account changes for ${address}`)
        connection.onAccountChange(
            new PublicKey(address),
            onAccountChangeCallBack,
            'confirmed',
        );

    })
}
runBot();
