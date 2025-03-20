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

contract CollateralManager {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    IERC20 public collateralToken; // ERC-20 token used as collateral
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract

    // Collateral mappings
    mapping(address => uint256) public collateralBalances; // Borrower collateral balances
    mapping(uint256 => address) public loanCollateral; // Loan ID to borrower mapping

    // Events
    event CollateralDeposited(address borrower, uint256 amount);
    event CollateralWithdrawn(address borrower, uint256 amount);
    event CollateralLiquidated(uint256 loanId, address borrower, uint256 amount);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor(address _collateralToken, address _uniswapRouter) {
        admin = msg.sender;
        collateralToken = IERC20(_collateralToken);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
    }

    // Function to deposit collateral
    function depositCollateral(address borrower, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer collateral tokens from borrower to this contract
        require(collateralToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Update borrower's collateral balance
        collateralBalances[borrower] = collateralBalances[borrower].add(amount);

        emit CollateralDeposited(borrower, amount);
    }

    // Function to withdraw collateral
    function withdrawCollateral(address borrower, uint256 amount) external {
        require(collateralBalances[borrower] >= amount, "Insufficient collateral balance");

        // Update borrower's collateral balance
        collateralBalances[borrower] = collateralBalances[borrower].sub(amount);

        // Transfer collateral tokens back to the borrower
        require(collateralToken.transfer(borrower, amount), "Transfer failed");

        emit CollateralWithdrawn(borrower, amount);
    }

    // Function to liquidate collateral
    function liquidateCollateral(uint256 loanId, address[] calldata path, uint256 amountOutMin) external onlyAdmin {
        address borrower = loanCollateral[loanId];
        require(borrower != address(0), "Invalid loan ID");

        uint256 collateralAmount = collateralBalances[borrower];
        require(collateralAmount > 0, "No collateral to liquidate");

        // Reset borrower's collateral balance
        collateralBalances[borrower] = 0;

        // Swap collateral tokens on Uniswap if necessary
        if (path.length > 1) {
            require(collateralToken.approve(address(uniswapRouter), collateralAmount), "Approval failed");
            uniswapRouter.swapExactTokensForTokens(
                collateralAmount,
                amountOutMin,
                path,
                address(this),
                block.timestamp + 300 // 5-minute deadline
            );
        }

        emit CollateralLiquidated(loanId, borrower, collateralAmount);
    }

    // Function to associate a loan with collateral
    function associateLoanWithCollateral(uint256 loanId, address borrower) external onlyAdmin {
        loanCollateral[loanId] = borrower;
    }
}