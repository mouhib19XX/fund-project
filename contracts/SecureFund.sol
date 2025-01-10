// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Custom errors with enum
error Fund__Error(Error error, uint256 requested, uint256 available);

// Enum for error types
enum Error {
    None,
    InsufficientBalance,
    NotAuthorized
}

/**
 * @title Fund Smart Contract
 * @notice This contract allows users to deposit ETH and enables the owner to withdraw funds securely.
 */
contract SecureFund is ReentrancyGuard {
    // State Variables
    address private immutable i_owner;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    uint256 private s_totalBalance;

    // Events
    event Deposited(address indexed funder, uint256 amount);
    event Withdrawn(address indexed owner, uint256 amount);

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Fund__Error(Error.NotAuthorized, 0, 0);
        }
        _;
    }

    /**
     * @dev Constructor to set the deployer as the contract owner.
     */
    constructor() {
        i_owner = msg.sender;
    }

    /**
     * @notice Deposits ETH into the contract. The deposited amount is recorded for each funder.
     * @dev Requires a non-zero amount of ETH to be sent.
     */
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
        s_totalBalance += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @notice Withdraws funds from the contract. Only the owner can call this function.
     * @dev Ensures the contract has sufficient balance before transferring funds.
     * @param amount The amount of ETH to withdraw.
     */
    function withdraw(uint256 amount) public onlyOwner nonReentrant {
        if (amount == 0) {
            revert Fund__Error(Error.InsufficientBalance, 0, 0);
        }
        if (amount > s_totalBalance) {
            revert Fund__Error(Error.InsufficientBalance, amount, s_totalBalance);
        }

        // Transfer funds to the owner
        (bool success, ) = i_owner.call{value: amount}("");
        require(success, "Withdrawal failed");
        s_totalBalance -= amount;
        emit Withdrawn(i_owner, amount);
    }

    /**
     * @notice Returns the amount of ETH funded by a specific address.
     * @param funder Address of the funder.
     * @return Amount of ETH funded.
     */
    function getAddressToAmountFunded(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    /**
     * @notice Returns the contract's owner address.
     * @return Owner address.
     */
    function getOwner() public view returns (address) {
        return i_owner;
    }

    /**
     * @notice Returns the total balance of the contract.
     * @return Contract balance in wei.
     */
    function getContractBalance() public view returns (uint256) {
        return s_totalBalance;
    }
}