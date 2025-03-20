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

contract LoanManager {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    IERC20 public token; // ERC-20 token used for loans
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract

    // Loan structure
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 dueDate;
        bool isRepaid;
        bool isLiquidated;
    }

    // Loan mappings
    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;

    // Events
    event LoanCreated(uint256 loanId, address borrower, uint256 amount, uint256 interestRate, uint256 dueDate);
    event LoanRepaid(uint256 loanId, address borrower, uint256 amount);
    event LoanLiquidated(uint256 loanId, address borrower, uint256 amount);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor(address _token, address _uniswapRouter) {
        admin = msg.sender;
        token = IERC20(_token);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        loanCounter = 0;
    }

    // Function to create a new loan
    function createLoan(address borrower, uint256 amount, uint256 interestRate, uint256 duration) external onlyAdmin {
        require(amount > 0, "Loan amount must be greater than 0");
        require(interestRate > 0, "Interest rate must be greater than 0");

        // Calculate due date
        uint256 dueDate = block.timestamp.add(duration);

        // Create new loan
        loans[loanCounter] = Loan({
            borrower: borrower,
            amount: amount,
            interestRate: interestRate,
            dueDate: dueDate,
            isRepaid: false,
            isLiquidated: false
        });

        // Transfer tokens to the borrower
        require(token.transfer(borrower, amount), "Transfer failed");

        emit LoanCreated(loanCounter, borrower, amount, interestRate, dueDate);
        loanCounter++;
    }

    // Function to repay a loan
    function repayLoan(uint256 loanId, address[] calldata path, uint256 amountOutMin) external {
        require(loanId < loanCounter, "Invalid loan ID");
        Loan storage loan = loans[loanId];
        require(msg.sender == loan.borrower, "Only borrower can repay the loan");
        require(!loan.isRepaid, "Loan is already repaid");
        require(!loan.isLiquidated, "Loan is liquidated");

        // Calculate repayment amount (principal + interest)
        uint256 repaymentAmount = loan.amount.add(loan.amount.mul(loan.interestRate).div(100);

        // Transfer tokens from borrower to this contract
        require(token.transferFrom(msg.sender, address(this), repaymentAmount), "Transfer failed");

        // Swap tokens on Uniswap if necessary (e.g., repay in a different token)
        if (path.length > 1) {
            require(token.approve(address(uniswapRouter), repaymentAmount), "Approval failed");
            uniswapRouter.swapExactTokensForTokens(
                repaymentAmount,
                amountOutMin,
                path,
                address(this),
                block.timestamp + 300 // 5-minute deadline
            );
        }

        // Mark loan as repaid
        loan.isRepaid = true;

        emit LoanRepaid(loanId, msg.sender, repaymentAmount);
    }

    // Function to liquidate a loan
    function liquidateLoan(uint256 loanId, address[] calldata path, uint256 amountOutMin) external onlyAdmin {
        require(loanId < loanCounter, "Invalid loan ID");
        Loan storage loan = loans[loanId];
        require(!loan.isRepaid, "Loan is already repaid");
        require(!loan.isLiquidated, "Loan is already liquidated");
        require(block.timestamp > loan.dueDate, "Loan is not yet due");

        // Calculate liquidation amount (principal + interest)
        uint256 liquidationAmount = loan.amount.add(loan.amount.mul(loan.interestRate).div(100));

        // Swap collateral on Uniswap if necessary
        if (path.length > 1) {
            require(token.approve(address(uniswapRouter), liquidationAmount), "Approval failed");
            uniswapRouter.swapExactTokensForTokens(
                liquidationAmount,
                amountOutMin,
                path,
                address(this),
                block.timestamp + 300 // 5-minute deadline
            );
        }

        // Mark loan as liquidated
        loan.isLiquidated = true;

        emit LoanLiquidated(loanId, loan.borrower, liquidationAmount);
    }
}