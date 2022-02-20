import {
  ConfirmedTransactionMeta,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionResponse,
} from "@solana/web3.js";
import {
  BURN,
  BUY,
  DE_LISTING,
  LISTING,
  PROGRAM_ACCOUNTS,
  PROGRAM_ACCOUNT_URLS,
  SELL,
} from "../constants";
import { postSaleToDiscord } from "../discord";
import { connection, logger } from "../settings";
import { NFTMetaType } from "../types";
import { getMetaData } from "../utils";

const runTest = async () => {
  try {
    let signature: string = "";
    let wallet: PublicKey = new PublicKey("");

    const txn: TransactionResponse = (await connection.getTransaction(
      signature
    )) as TransactionResponse;
    const { preBalances, postBalances, postTokenBalances, preTokenBalances } =
      txn.meta as ConfirmedTransactionMeta;
    const price = Math.abs(preBalances[0] - postBalances[0]) / LAMPORTS_PER_SOL;
    let mintToken: string = postTokenBalances![0]?.mint;

    if (mintToken) {
      let tradeDirection = "";
      const { accountKeys } = txn.transaction.message;
      const programAccount: string = accountKeys.at(-1)!.toString();

      for (const [key, value] of Object.entries(PROGRAM_ACCOUNTS)) {
        if (value.includes(programAccount)) {
          let programAccountUrl = PROGRAM_ACCOUNT_URLS[key];
          let walletString = wallet!.toString();

          if (key === "MortuaryInc") {
            tradeDirection = BURN;
            mintToken = preTokenBalances![1].mint;
          } else if (price < 0.009) {
            tradeDirection =
              preTokenBalances![0].owner === walletString
                ? LISTING
                : DE_LISTING;
          } else if (key === "Magic Eden") {
            programAccountUrl += `/${mintToken}`;
            tradeDirection =
              preTokenBalances![0].owner === walletString ? SELL : BUY;
          } else {
            programAccountUrl += `/?token=${mintToken}`;
            tradeDirection =
              postTokenBalances![0].owner === walletString ? BUY : SELL;
          }

          const metadata = await getMetaData(mintToken);
          const nftMeta: NFTMetaType = {
            name: metadata.name,
            tradeDirection: tradeDirection,
            price: price,
            image: metadata.image,
            transactionDate: txn.blockTime as number,
            marketPlaceURL: programAccountUrl,
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

if (require.main) {
  runTest();
}
