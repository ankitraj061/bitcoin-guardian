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

contract LendingPool {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    IERC20 public token; // ERC-20 token used for deposits
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract
    uint256 public interestRate; // Current interest rate (e.g., 5% = 500)
    mapping(address => uint256) public balances; // User balances

    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event FundsReallocated(uint256 amount);

    // Constructor
    constructor(address _token, address _uniswapRouter) {
        admin = msg.sender;
        token = IERC20(_token);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        interestRate = 500; // 5% interest rate (500 basis points)
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Deposit function
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from user to the contract
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Update user balance
        balances[msg.sender] = balances[msg.sender].add(amount);

        emit Deposited(msg.sender, amount);
    }

    // Withdraw function
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");

        // Update user balance
        balances[msg.sender] = balances[msg.sender].sub(amount);

        // Transfer tokens back to the user
        require(token.transfer(msg.sender, amount), "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    // Get current interest rate
    function getInterestRate() external view returns (uint256) {
        return interestRate;
    }

    // Reallocate funds to maximize returns using Uniswap
    function reallocateFunds(address[] calldata path, uint256 amountOutMin) external onlyAdmin {
        require(path.length >= 2, "Invalid path");

        uint256 balance = token.balanceOf(address(this));

        // Approve Uniswap Router to spend tokens
        require(token.approve(address(uniswapRouter), balance), "Approval failed");

        // Swap tokens on Uniswap
        uint256[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            balance,
            amountOutMin,
            path,
            address(this),
            block.timestamp + 300 // 5-minute deadline
        );

        emit FundsReallocated(amounts[amounts.length - 1]);
    }

    // Admin function to update interest rate
    function updateInterestRate(uint256 newRate) external onlyAdmin {
        interestRate = newRate;
    }
}