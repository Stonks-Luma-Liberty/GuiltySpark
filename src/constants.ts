type ProgramAccountType = {
    [key: string]: string[]
}

type ProgramAccountUrlType = {
    [key: string]: string
}

export const PROGRAM_ACCOUNTS: ProgramAccountType = {
    MagicEden: [
        'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8',
        'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
    ],
    Solanart: [
        'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz',
        'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk',
    ],
    MortuaryInc: ['minc9MLymfBSEs9ho1pUaXbQQPdfnTnxUvJa8TWx85E'],
    Yawww: ['5SKmrbAxnHV2sgqyDXkGrLrokZYtWWVEEk5Soed7VLVN'],
    Hyperspace: ['HYPERfwdTjyJ2SCaKHmpF2MtrXqWxrsotYDsTrshHWq8'],
}

export const PROGRAM_ACCOUNT_URLS: ProgramAccountUrlType = {
    MagicEden: 'https://www.magiceden.io/item-details',
    Solanart: 'https://solanart.io/search',
    MortuaryInc: 'https://mortuary-inc.io',
    Yawww: 'https://www.yawww.io/marketplace/listing',
    Hyperspace: 'https://hyperspace.xyz/token',
}

export const BUY = 'BUY 🛒'
export const SELL = 'SELL 💰'
export const BURN = 'BURN 🔥'
export const LISTING = 'LISTING 🛍️'
export const DE_LISTING = 'DE-LISTING 🏃'
export const MAX_SUPPORTED_TRANSACTION_VERSION = 0
