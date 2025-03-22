// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BTCLending
 * @dev Manages Bitcoin lending with collateral
 */
contract BTCLending {
    // Events
    event LoanCreated(uint256 loanId, address lender, uint256 btcAmount);
    event LoanTaken(uint256 loanId, address borrower);
    event LoanRepaid(uint256 loanId, address borrower);

    // Loan structure
    struct Loan {
        address lender;
        address borrower;
        uint256 btcAmount;
        uint256 collateralAmount;
        bool isRepaid;
    }

    // Mapping from loan ID to Loan
    mapping(uint256 => Loan) public loans;
    uint256 public loanCounter;

    /**
     * @dev Creates a loan offer
     * @param btcAmount Amount of BTC to lend
     * @param collateralAmount Amount of collateral required
     */
    function provideLoan(uint256 btcAmount, uint256 collateralAmount) public payable {
        require(msg.value == btcAmount, "BTC deposit must match loan amount");

        loanCounter++;
        loans[loanCounter] = Loan({
            lender: msg.sender,
            borrower: address(0),
            btcAmount: btcAmount,
            collateralAmount: collateralAmount,
            isRepaid: false
        });
        
        emit LoanCreated(loanCounter, msg.sender, btcAmount);
    }

    /**
     * @dev Borrow BTC by providing collateral
     * @param loanId ID of the loan to take
     */
    function takeLoan(uint256 loanId) public payable {
        Loan storage loan = loans[loanId];
        require(loan.borrower == address(0), "Loan already taken");
        require(msg.value == loan.collateralAmount, "Collateral must match required amount");

        loan.borrower = msg.sender;
        payable(msg.sender).transfer(loan.btcAmount);

        emit LoanTaken(loanId, msg.sender);
    }

    /**
     * @dev Repay a loan
     * @param loanId ID of the loan to repay
     */
    function repayLoan(uint256 loanId) public payable {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Only borrower can repay");
        require(!loan.isRepaid, "Loan already repaid");
        require(msg.value == loan.btcAmount, "Must repay the exact loan amount");

        loan.isRepaid = true;
        payable(loan.lender).transfer(loan.btcAmount); // Return BTC to lender
        payable(loan.borrower).transfer(loan.collateralAmount); // Return collateral to borrower
        
        emit LoanRepaid(loanId, msg.sender);
    }

    /**
     * @dev Get all available loans
     */
    function getAvailableLoans() public view returns (uint256[] memory) {
        // Count available loans first
        uint256 count = 0;
        for (uint256 i = 1; i <= loanCounter; i++) {
            if (loans[i].borrower == address(0)) {
                count++;
            }
        }

        // Create the result array
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= loanCounter; i++) {
            if (loans[i].borrower == address(0)) {
                result[index] = i;
                index++;
            }
        }

        return result;
    }
}