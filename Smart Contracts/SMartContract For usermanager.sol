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

contract UserManager {
    using SafeMath for uint256;

    // State variables
    address public admin; // Admin address
    IUniswapV2Router public uniswapRouter; // Uniswap Router contract
    mapping(address => uint256) public userRoles; // Mapping of user addresses to roles
    mapping(address => uint256) public userBalances; // Mapping of user addresses to balances

    // Role constants
    uint256 public constant ROLE_ADMIN = 0;
    uint256 public constant ROLE_LENDER = 1;
    uint256 public constant ROLE_BORROWER = 2;

    // Events
    event UserRegistered(address indexed user);
    event UserRoleUpdated(address indexed user, uint256 role);
    event UserInfoFetched(address indexed user, uint256 role, uint256 balance);

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

    // Function to register a new user
    function registerUser(address user) external onlyAdmin {
        require(userRoles[user] == 0, "User already registered");

        // Register the user with a default role (e.g., borrower)
        userRoles[user] = ROLE_BORROWER;

        emit UserRegistered(user);
    }

    // Function to update the role of a user
    function updateUserRole(address user, uint256 role) external onlyAdmin {
        require(userRoles[user] != 0, "User not registered");
        require(role == ROLE_ADMIN || role == ROLE_LENDER || role == ROLE_BORROWER, "Invalid role");

        // Update the user's role
        userRoles[user] = role;

        emit UserRoleUpdated(user, role);
    }

    // Function to get information about a user
    function getUserInfo(address user) external view returns (uint256 role, uint256 balance) {
        require(userRoles[user] != 0, "User not registered");

        // Fetch user role and balance
        role = userRoles[user];
        balance = userBalances[user];

        emit UserInfoFetched(user, role, balance);
    }

    // Function to deposit tokens into the user's balance
    function depositTokens(address user, uint256 amount) external {
        require(userRoles[user] != 0, "User not registered");
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens from the sender to this contract
        require(IERC20(uniswapRouter.WETH()).transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Update user's balance
        userBalances[user] = userBalances[user].add(amount);
    }

    // Function to withdraw tokens from the user's balance
    function withdrawTokens(address user, uint256 amount) external {
        require(userRoles[user] != 0, "User not registered");
        require(userBalances[user] >= amount, "Insufficient balance");

        // Update user's balance
        userBalances[user] = userBalances[user].sub(amount);

        // Transfer tokens back to the user
        require(IERC20(uniswapRouter.WETH()).transfer(user, amount), "Transfer failed");
    }
}