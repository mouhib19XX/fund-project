const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const SecureFundFactory = await hre.ethers.getContractFactory("SecureFund");

  // Deploy the contract
  const secureFund = await SecureFundFactory.deploy();


  console.log("SecureFund deployed to:", secureFund);
}

// Run the deployment script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
