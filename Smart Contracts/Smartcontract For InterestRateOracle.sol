// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InterestRateOracle {
    // State variables
    address public admin; // Admin address
    mapping(string => uint256) public interestRates; // Mapping of platform names to interest rates
    string[] public platforms; // List of platforms

    // Events
    event InterestRateUpdated(string platform, uint256 newRate);
    event BestRateFetched(uint256 bestRate);

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
    }

    // Function to update interest rates for a platform
    function updateInterestRates(string memory platform, uint256 newRate) external onlyAdmin {
        require(newRate > 0, "Interest rate must be greater than 0");

        // Update or add the platform's interest rate
        if (interestRates[platform] == 0) {
            platforms.push(platform); // Add new platform to the list
        }
        interestRates[platform] = newRate;

        emit InterestRateUpdated(platform, newRate);
    }

    // Function to get the best interest rate across all platforms
    function getBestRate() external returns (uint256) {
        require(platforms.length > 0, "No platforms available");

        uint256 bestRate = interestRates[platforms[0]];
        for (uint256 i = 1; i < platforms.length; i++) {
            if (interestRates[platforms[i]] > bestRate) {
                bestRate = interestRates[platforms[i]];
            }
        }

        emit BestRateFetched(bestRate);
        return bestRate;
    }

    // Function to get the list of platforms
    function getPlatforms() external view returns (string[] memory) {
        return platforms;
    }

    // Function to get the interest rate for a specific platform
    function getRateForPlatform(string memory platform) external view returns (uint256) {
        return interestRates[platform];
    }
}