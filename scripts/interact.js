const hre = require("hardhat");

async function main() {
  const contractAddress = "0x8Fd84f2e22C0262C2def9b8FE9F29F348603338c"; // Replace with your contract address
  const SecureFundFactory = await hre.ethers.getContractFactory("SecureFund");
  const secureFund = await SecureFundFactory.attach(contractAddress);

  // Deposit 1 ETH
  const depositAmount = ethers.parseEther("1.0");
  const depositTx = await secureFund.deposit({ value: depositAmount });
  await depositTx.wait();

  console.log("Deposited 1 ETH into the contract");

  // Deposit another 5 ETH to ensure sufficient balance
  const additionalDepositAmount = ethers.parseEther("5.0");
  const additionalDepositTx = await secureFund.deposit({ value: additionalDepositAmount });
  await additionalDepositTx.wait();

  console.log("Deposited an additional 5 ETH into the contract");

  // Check contract balance
  const balance = await secureFund.getContractBalance();
  console.log("Contract balance:", ethers.formatEther(balance), "ETH");

  // Withdraw 6 ETH (only the owner can call this)
  const withdrawAmount = ethers.parseEther("6.0");
  try {
    const withdrawTx = await secureFund.withdraw(withdrawAmount);
    await withdrawTx.wait();
    console.log("Withdrew 6 ETH from the contract");
  } catch (error) {
    console.error("Failed to withdraw 6 ETH:");

    // Decode the custom error
    if (error.data) {
      const decodedError = secureFund.interface.parseError(error.data);
      console.error("Custom error:", decodedError.name);
      console.error("Error args:", decodedError.args);
    } else {
      console.error("Error:", error.message);
    }
  }

  // Check contract balance after withdrawal
  const newBalance = await secureFund.getContractBalance();
  console.log("Contract balance after withdrawal:", ethers.formatEther(newBalance), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});