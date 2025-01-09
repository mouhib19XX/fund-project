require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19", // Use the same Solidity version as your contract
  networks: {
    hardhat: {}, // Local Hardhat network for testing
  },
  paths: {
    artifacts: "./artifacts", // Directory for compiled contracts
    cache: "./cache", // Directory for cached files
    sources: "./contracts", // Directory for Solidity source files
    tests: "./test", // Directory for test files
  },
};