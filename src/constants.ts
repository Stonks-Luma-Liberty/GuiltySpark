type ProgramAccountType = {
  [key: string]: string[];
};

type ProgramAccountUrlType = {
  [key: string]: string;
};

export const PROGRAM_ACCOUNTS: ProgramAccountType = {
  MagicEden: [
    "MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8",
    "M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K",
  ],
  Solanart: ["CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz"],
  MortuaryInc: ["minc9MLymfBSEs9ho1pUaXbQQPdfnTnxUvJa8TWx85E"],
};

export const PROGRAM_ACCOUNT_URLS: ProgramAccountUrlType = {
  MagicEden: "https://www.magiceden.io/item-details",
  Solanart: "https://solanart.io/search",
  MortuaryInc: "https://mortuary-inc.io",
};

export const BUY: string = "BUY 🛒";
export const SELL: string = "SELL 💰";
export const BURN: string = "BURN 🔥";
export const LISTING: string = "LISTING 🛍️";
export const DE_LISTING: string = "DE-LISTING 🏃";
