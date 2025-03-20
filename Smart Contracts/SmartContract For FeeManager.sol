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

contract FeeManager {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    IERC20 public feeToken; // ERC-20 token used for fees
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract
    uint256 public feePercentage; // Fee percentage (e.g., 1% = 100)
    uint256 public totalFeesCollected; // Total fees collected
    mapping(address => uint256) public stakeholderShares; // Mapping of stakeholders to their shares

    // Events
    event FeeCalculated(uint256 amount, uint256 fee);
    event FeesDistributed(address indexed stakeholder, uint256 amount);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor(address _feeToken, address _uniswapRouter, uint256 _feePercentage) {
        admin = msg.sender;
        feeToken = IERC20(_feeToken);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        feePercentage = _feePercentage;
    }

    // Function to calculate the fee for a transaction
    function calculateFee(uint256 amount) external view returns (uint256) {
        return amount.mul(feePercentage).div(10000); // Calculate fee based on percentage
    }

    // Function to collect fees
    function collectFee(uint256 amount) external {
        uint256 fee = calculateFee(amount);
        require(feeToken.transferFrom(msg.sender, address(this), fee), "Transfer failed");

        // Update total fees collected
        totalFeesCollected = totalFeesCollected.add(fee);

        emit FeeCalculated(amount, fee);
    }

    // Function to distribute collected fees to the platform and stakeholders
    function distributeFees(address[] calldata stakeholders, uint256[] calldata shares, address[] calldata path, uint256 amountOutMin) external onlyAdmin {
        require(stakeholders.length == shares.length, "Invalid input");

        uint256 totalShares = 0;
        for (uint256 i = 0; i < shares.length; i++) {
            totalShares = totalShares.add(shares[i]);
        }

        uint256 totalFeeAmount = feeToken.balanceOf(address(this));
        require(totalFeeAmount > 0, "No fees to distribute");

        // Distribute fees proportionally based on shares
        for (uint256 i = 0; i < stakeholders.length; i++) {
            address stakeholder = stakeholders[i];
            uint256 share = shares[i];
            uint256 feeAmount = totalFeeAmount.mul(share).div(totalShares);

            // Transfer fees to stakeholder
            require(feeToken.transfer(stakeholder, feeAmount), "Transfer failed");

            emit FeesDistributed(stakeholder, feeAmount);
        }

        // Swap tokens on Uniswap if necessary
        if (path.length > 1) {
            require(feeToken.approve(address(uniswapRouter), totalFeeAmount), "Approval failed");
            uniswapRouter.swapExactTokensForTokens(
                totalFeeAmount,
                amountOutMin,
                path,
                address(this),
                block.timestamp + 300 // 5-minute deadline
            );
        }
    }

    // Function to update stakeholder shares
    function updateStakeholderShare(address stakeholder, uint256 share) external onlyAdmin {
        stakeholderShares[stakeholder] = share;
    }
}