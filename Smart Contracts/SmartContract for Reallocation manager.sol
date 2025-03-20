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

// Interface for InterestRateOracle
interface IInterestRateOracle {
    function getBestRate() external returns (uint256);
    function getRateForPlatform(string memory platform) external view returns (uint256);
}

contract ReallocationManager {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    IERC20 public token; // ERC-20 token used for reallocation
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract
    IInterestRateOracle public interestRateOracle; // InterestRateOracle contract
    mapping(string => address) public platformPools; // Mapping of platform names to pool addresses

    // Events
    event FundsReallocated(string fromPlatform, string toPlatform, uint256 amount);
    event OptimalAllocationCalculated(uint256[] allocations);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor(address _token, address _uniswapRouter, address _interestRateOracle) {
        admin = msg.sender;
        token = IERC20(_token);
        uniswapRouter = IUniswapV2Router(_uniswapRouter);
        interestRateOracle = IInterestRateOracle(_interestRateOracle);
    }

    // Function to set platform pool addresses
    function setPlatformPool(string memory platform, address pool) external onlyAdmin {
        platformPools[platform] = pool;
    }

    // Function to reallocate funds to the platform offering the highest yield
    function reallocateFunds(string memory fromPlatform, string memory toPlatform, uint256 amount, address[] calldata path, uint256 amountOutMin) external onlyAdmin {
        require(platformPools[fromPlatform] != address(0), "Invalid from platform");
        require(platformPools[toPlatform] != address(0), "Invalid to platform");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from the source pool to this contract
        require(token.transferFrom(platformPools[fromPlatform], address(this), amount), "Transfer failed");

        // Approve Uniswap Router to spend tokens
        require(token.approve(address(uniswapRouter), amount), "Approval failed");

        // Swap tokens on Uniswap
        uint256[] memory amounts = uniswapRouter.swapExactTokensForTokens(
            amount,
            amountOutMin,
            path,
            platformPools[toPlatform],
            block.timestamp + 300 // 5-minute deadline
        );

        emit FundsReallocated(fromPlatform, toPlatform, amounts[amounts.length - 1]);
    }

    // Function to calculate the optimal allocation of funds across platforms
    function calculateOptimalAllocation() external onlyAdmin returns (uint256[] memory) {
        uint256 bestRate = interestRateOracle.getBestRate();
        uint256[] memory allocations = new uint256[](platformPools.length);

        // Simplified logic: Allocate 100% to the platform with the best rate
        for (uint256 i = 0; i < platformPools.length; i++) {
            allocations[i] = (bestRate == interestRateOracle.getRateForPlatform(platformPools[i])) ? 100 : 0;
        }

        emit OptimalAllocationCalculated(allocations);
        return allocations;
    }
}