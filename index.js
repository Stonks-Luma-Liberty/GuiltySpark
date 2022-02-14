import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Connection as MetaplexConnection, programs } from "@metaplex/js";
import axios from "axios";
import { createLogger, format, transports } from "winston";
import { postSaleToDiscord } from "./discord.js";
import { marketPlaceURLs, marketPlaces } from "./constants.js";
dotenv.config();

let wallets = [];
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const myFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    myFormat
  ),
  transports: [new transports.Console({})],
});

const { SOLANA_CLUSTER_ENDPOINT } = process.env;
const {
  metadata: { Metadata },
} = programs;
const connection = new Connection(
  clusterApiUrl(SOLANA_CLUSTER_ENDPOINT),
  "confirmed"
);
const metaplexConnection = new MetaplexConnection(SOLANA_CLUSTER_ENDPOINT);
logger.info(`Connected to solana cluster ${SOLANA_CLUSTER_ENDPOINT}`);

const getMetaData = async (tokenPubKey) => {
  try {
    const addr = await Metadata.getPDA(tokenPubKey);
    const resp = await Metadata.load(metaplexConnection, addr);
    const { data } = await axios.get(resp.data.data.uri);

    return data;
  } catch (error) {
    logger.error(error);
  }
};

const onAccountChangeCallBack = async (accountInfo, context) => {
  logger.info("Account change detected");
  const { slot } = context;
  let wallet = null;
  logger.info(`Slot: ${slot}`);

  logger.info("Retrieving block");

  try {
    let block = await connection.getBlock(slot);
    const { transactions } = block;

    logger.info("Searching transactions");
    const transaction = transactions.find((item) => {
      const { accountKeys } = item.transaction.message;
      let publicKey = accountKeys.find((publicKey) =>
        wallets.includes(publicKey.toString())
      );
      if (publicKey) {
        wallet = publicKey;
        return item;
      }
    })?.transaction;

    logger.info("Transaction found");
    const signature = transaction.signatures[0];
    logger.info(`Getting transaction signature: ${signature}`);

    const txn = await connection.getTransaction(signature);
    const { preBalances, postBalances, postTokenBalances, preTokenBalances } =
      txn.meta;
    const price = Math.abs(preBalances[0] - postBalances[0]) / LAMPORTS_PER_SOL;
    const mintToken = postTokenBalances[0]?.mint;

    if (mintToken) {
      let tradeDirection = "";
      const { accountKeys } = txn.transaction.message;
      const marketplaceAccount = accountKeys.at(-1).toString();

      for (const [key, value] of Object.entries(marketPlaces)) {
        if (value.includes(marketplaceAccount)) {
          let marketPlaceURL = marketPlaceURLs[key]

          if (key === "Magic Eden") {
            marketPlaceURL += `/${mintToken}`
            tradeDirection =
              preTokenBalances[0].owner === wallet.toString() ? "SELL" : "BUY";
          }
          else {
            marketPlaceURL += `/?token=${mintToken}`
            tradeDirection =
              postTokenBalances[0].owner === wallet.toString() ? "BUY" : "SELL";
          }

          if (price < 0.009) {
            tradeDirection = preTokenBalances[0].owner === wallet.toString() ? "LISTING" : "DE-LISTING";
          }
          const metadata = await getMetaData(mintToken);
          const nftMeta = {
            name: metadata.name,
            tradeDirection: tradeDirection,
            price: price,
            image: metadata.image,
            transactionDate: txn.blockTime,
            marketPlaceURL: marketPlaceURL,
          };
          postSaleToDiscord(nftMeta, signature);
        }
      }
    } else {
      logger.info("Not an NFT transaction");
    }
  } catch (e) {
    logger.error(e);
  }
};

const runBot = async () => {
  logger.info("Starting GuiltySpark bot");

  let { data: walletmonitor, error } = await supabase
    .from("walletmonitor")
    .select("*");

  walletmonitor.forEach((item) => {
    const { address } = item;
    wallets.push(address);

    logger.info(`Subscribing to account changes for ${address}`);
    connection.onAccountChange(
      new PublicKey(address),
      onAccountChangeCallBack,
      "confirmed"
    );
  });
};
runBot();
