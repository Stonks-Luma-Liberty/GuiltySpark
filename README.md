# GuiltySpark

[![Github Issues](https://img.shields.io/github/issues/Stonks-Luma-Liberty/GuiltySpark?logo=github&style=for-the-badge)](https://github.com/Stonks-Luma-Liberty/GuiltySpark/issues)
[![Codacy Badge](https://img.shields.io/codacy/grade/8cd6dec921e64e1e938f66264610a0f9?logo=codacy&style=for-the-badge)](https://www.codacy.com/gh/Stonks-Luma-Liberty/GuiltySpark/dashboard?utm_source=github.com&utm_medium=referral&utm_content=Stonks-Luma-Liberty/GuiltySpark&utm_campaign=Badge_Grade)
[![Github Top Language](https://img.shields.io/github/languages/top/Stonks-Luma-Liberty/GuiltySpark?style=for-the-badge)](https://www.typescriptlang.org)

A brief description of what this project does and who it's for
Solana NFT wallet monitor. Keeps track of specified solana wallets for any NFT trades executed on various NFT marketplaces. Additionally, monitors wallets for NFT token burns

## Contents

- [Features](#features)

- [Environment Variables](#environment-variables)

- [Run Locally](#run-locally)

  - [With Docker](#with-docker)
  - [Without Docker](#without-docker)

## Features

- Monitors wallets for NFT token transactions involving Solana NFT marketplaces
- Monitors wallets for NFT token burns
- Posts transaction details directly to your discord webhook URL
- Error handling
- Logging

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`SOLANA_CLUSTER_ENDPOINT` - "devnet" | "testnet" | "mainnet-beta"

`SUPABASE_URL` - URL to your supabase backend

`SUPABASE_KEY` - API key to access supabase backend

`DISCORD_WEBHOOK_URL` - Webhook url so that bot may post messages

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

### With Docker

Use docker-compose to start the bot

```bash
docker-compose up -d --build
```

### Without Docker

Install dependencies

```bash
  yarn install
```

Start the bot

```bash
  yarn start
```
