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

contract RewardDistribution {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    IERC20 public rewardToken; // ERC-20 token used for rewards
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract
    mapping(address => uint256) public lenderContributions; // Lender contributions
    mapping(address => uint256) public lenderRewards; // Lender rewards
    uint256 public totalContributions; // Total contributions from all lenders
    uint256 public totalRewards; // Total rewards distributed

    // Events
    event RewardsDistributed(address indexed lender, uint256 amount);
    event RewardsCalculated(address indexed lender, uint256 amount);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor(address _rewardToken, address _uniswapRouter) {
        admin = msg.sender;
        rewardToken = IERC20(_rewardToken);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
    }

    // Function to update lender contributions
    function updateContribution(address lender, uint256 amount) external onlyAdmin {
        require(amount > 0, "Amount must be greater than 0");

        // Update lender's contribution and total contributions
        lenderContributions[lender] = lenderContributions[lender].add(amount);
        totalContributions = totalContributions.add(amount);
    }

    // Function to distribute rewards to lenders
    function distributeRewards(address[] calldata path, uint256 amountOutMin) external onlyAdmin {
        require(totalContributions > 0, "No contributions to distribute rewards");

        uint256 totalRewardAmount = rewardToken.balanceOf(address(this));
        require(totalRewardAmount > 0, "No rewards to distribute");

        // Distribute rewards proportionally based on contributions
        for (uint256 i = 0; i < path.length; i++) {
            address lender = path[i];
            uint256 lenderContribution = lenderContributions[lender];
            if (lenderContribution > 0) {
                uint256 rewardAmount = totalRewardAmount.mul(lenderContribution).div(totalContributions);
                lenderRewards[lender] = lenderRewards[lender].add(rewardAmount);
                totalRewards = totalRewards.add(rewardAmount);

                // Transfer rewards to lender
                require(rewardToken.transfer(lender, rewardAmount), "Transfer failed");

                emit RewardsDistributed(lender, rewardAmount);
            }
        }

        // Swap tokens on Uniswap if necessary
        if (path.length > 1) {
            require(rewardToken.approve(address(uniswapRouter), totalRewardAmount), "Approval failed");
            uniswapRouter.swapExactTokensForTokens(
                totalRewardAmount,
                amountOutMin,
                path,
                address(this),
                block.timestamp + 300 // 5-minute deadline
            );
        }
    }

    // Function to calculate rewards for a specific lender
    function calculateRewards(address lender) external view returns (uint256) {
        require(lenderContributions[lender] > 0, "No contributions from this lender");

        uint256 totalRewardAmount = rewardToken.balanceOf(address(this));
        uint256 rewardAmount = totalRewardAmount.mul(lenderContributions[lender]).div(totalContributions);

        emit RewardsCalculated(lender, rewardAmount);
        return rewardAmount;
    }
}