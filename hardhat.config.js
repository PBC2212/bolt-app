require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const path = require("path");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "66b22f40af0d5bb9f7f234775c1ed7524803b350e7e6ab613a074da5e36338e8";
const BSC_TESTNET_RPC = process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.binance.org:8545";
const BSC_MAINNET_RPC = "https://bsc-dataseed.binance.org/"; // ✅ Mainnet RPC added

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    bscTestnet: {
      url: BSC_TESTNET_RPC,
      chainId: 97,
      accounts: [PRIVATE_KEY],
    },
    bscMainnet: {
      url: BSC_MAINNET_RPC,
      chainId: 56,
      accounts: [PRIVATE_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test",
  },
  resolver: {
    alias: {
      "@chainlink": path.resolve(__dirname, "node_modules/@chainlink"),
    },
  },
};
