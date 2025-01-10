const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SecureFund Contract", function () {
  let SecureFundFactory;
  let secureFund;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Deploy the contract
    SecureFundFactory = await ethers.getContractFactory("SecureFund");
    [owner, addr1, addr2] = await ethers.getSigners();
    secureFund = await SecureFundFactory.deploy();
  });

  describe("Deposit Functionality", function () {
    it("Should allow any address to deposit ETH", async function () {
      // Deposit 1 ETH from addr1
      const depositAmount = ethers.parseEther("1.0");
      await expect(() =>
        secureFund.connect(addr1).deposit({ value: depositAmount })
      ).to.changeEtherBalance(addr1, -depositAmount);

      // Check the contract balance
      const contractBalance = await secureFund.getContractBalance();
      expect(contractBalance).to.equal(depositAmount);

      // Check the funded amount for addr1
      const fundedAmount = await secureFund.getAddressToAmountFunded(addr1.address);
      expect(fundedAmount).to.equal(depositAmount);
    });

    it("Should revert if deposit amount is zero", async function () {
      // Attempt to deposit 0 ETH
      await expect(
        secureFund.connect(addr1).deposit({ value: 0 })
      ).to.be.revertedWith("Deposit amount must be greater than zero");
    });
  });

  describe("Withdrawal Functionality", function () {
    it("Should allow the owner to withdraw ETH", async function () {
      // Deposit 1 ETH from addr1
      const depositAmount = ethers.parseEther("1.0");
      await secureFund.connect(addr1).deposit({ value: depositAmount });

      // Withdraw 1 ETH as the owner
      await expect(() =>
        secureFund.connect(owner).withdraw(depositAmount)
      ).to.changeEtherBalance(owner, depositAmount);

      // Check the contract balance after withdrawal
      const contractBalance = await secureFund.getContractBalance();
      expect(contractBalance).to.equal(0);
    });

    it("Should revert if a non-owner attempts to withdraw ETH", async function () {
      // Deposit 1 ETH from addr1
      const depositAmount = ethers.parseEther("1.0");
      await secureFund.connect(addr1).deposit({ value: depositAmount });

      // Attempt to withdraw 1 ETH as addr1 (non-owner)
      await expect(
        secureFund.connect(addr1).withdraw(depositAmount)
      ).to.be.revertedWithCustomError(secureFund, "Fund__Error").withArgs(2, 0, 0); // Error.NotAuthorized = 2
    });

    it("Should revert if the withdrawal amount exceeds the contract balance", async function () {
      // Deposit 1 ETH from addr1
      const depositAmount = ethers.parseEther("1.0");
      await secureFund.connect(addr1).deposit({ value: depositAmount });

      // Attempt to withdraw 2 ETH as the owner
      const withdrawalAmount = ethers.parseEther("2.0");
      await expect(
        secureFund.connect(owner).withdraw(withdrawalAmount)
      ).to.be.revertedWithCustomError(secureFund, "Fund__Error").withArgs(1, withdrawalAmount, depositAmount); // Error.InsufficientBalance = 1
    });

    it("Should revert if the withdrawal amount is zero", async function () {
      // Attempt to withdraw 0 ETH as the owner
      await expect(
        secureFund.connect(owner).withdraw(0)
      ).to.be.revertedWithCustomError(secureFund, "Fund__Error").withArgs(1, 0, 0); // Error.InsufficientBalance = 1
    });
  });

  describe("View Functions", function () {
    it("Should return the correct owner address", async function () {
      const contractOwner = await secureFund.getOwner();
      expect(contractOwner).to.equal(owner.address);
    });

    it("Should return the correct funded amount for a specific address", async function () {
      // Deposit 1 ETH from addr1
      const depositAmount = ethers.parseEther("1.0");
      await secureFund.connect(addr1).deposit({ value: depositAmount });

      // Check the funded amount for addr1
      const fundedAmount = await secureFund.getAddressToAmountFunded(addr1.address);
      expect(fundedAmount).to.equal(depositAmount);
    });

    it("Should return the correct contract balance", async function () {
      // Deposit 1 ETH from addr1
      const depositAmount = ethers.parseEther("1.0");
      await secureFund.connect(addr1).deposit({ value: depositAmount });

      // Check the contract balance
      const contractBalance = await secureFund.getContractBalance();
      expect(contractBalance).to.equal(depositAmount);
    });
  });
});