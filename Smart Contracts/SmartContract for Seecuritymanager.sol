// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin's ERC-20 and SafeMath libraries
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

// Interface for Uniswap V2 Router
interface IUniswapV2Router {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
}

contract SecurityManager {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    mapping(address => bool) public frozenAccounts; // Mapping of frozen accounts
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract

    // Events
    event AccountFrozen(address indexed account);
    event AccountUnfrozen(address indexed account);
    event SuspiciousActivityDetected(address indexed account, uint256 amount);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor(address _uniswapRouter) {
        admin = msg.sender;
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
    }

    // Function to monitor transactions for suspicious activities
    function monitorTransactions(address token, address from, address to, uint256 amount) external {
        // Example: Detect suspicious activity if the amount is above a threshold
        uint256 threshold = 10000 * 10**18; // Example threshold (10000 tokens)
        if (amount > threshold) {
            emit SuspiciousActivityDetected(from, amount);
            freezeAccount(from);
        }
    }

    // Function to freeze an account
    function freezeAccount(address account) public onlyAdmin {
        require(!frozenAccounts[account], "Account is already frozen");

        // Freeze the account
        frozenAccounts[account] = true;

        emit AccountFrozen(account);
    }

    // Function to unfreeze an account
    function unfreezeAccount(address account) external onlyAdmin {
        require(frozenAccounts[account], "Account is not frozen");

        // Unfreeze the account
        frozenAccounts[account] = false;

        emit AccountUnfrozen(account);
    }

    // Function to check if an account is frozen
    function isAccountFrozen(address account) external view returns (bool) {
        return frozenAccounts[account];
    }
}