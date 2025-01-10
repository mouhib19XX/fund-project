require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20", // Use the same Solidity version as your contract
  networks: {
    hardhat: {}, // Local Hardhat network for testing
    ephemery: {
      url: "https://otter.bordel.wtf/erigon", // Ephemery RPC endpoint
      accounts: [process.env.PRIVATE_KEY], // Use your wallet's private key
    },
  },
  paths: {
    artifacts: "./artifacts", // Directory for compiled contracts
    cache: "./cache", // Directory for cached files
    sources: "./contracts", // Directory for Solidity source files
    tests: "./test", // Directory for test files
  },
};