import { ethers } from 'ethers';

// We'll replace this with actual ABI after contract compilation
const BTCLendingABI = [
  "function provideLoan(uint256 btcAmount, uint256 collateralAmount) public payable",
  "function takeLoan(uint256 loanId) public payable",
  "function repayLoan(uint256 loanId) public payable",
  "function getAvailableLoans() public view returns (uint256[] memory)",
  "function loans(uint256 id) public view returns (address lender, address borrower, uint256 btcAmount, uint256 collateralAmount, bool isRepaid)",
  "function loanCounter() public view returns (uint256)"
];

// Contract address (to be replaced after deployment)
const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; 

export interface Loan {
  id: number;
  lender: string;
  borrower: string;
  btcAmount: string;
  collateralAmount: string;
  isRepaid: boolean;
}

class LendingService {
  private provider: ethers.providers.Web3Provider;
  private contract: ethers.Contract;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        BTCLendingABI,
        this.provider.getSigner()
      );
    }
  }

  /**
   * Connect wallet to the service
   */
  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error('Ethereum provider not available');
    }
    
    // Request account access
    await this.provider.send('eth_requestAccounts', []);
    const signer = this.provider.getSigner();
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, BTCLendingABI, signer);
    
    return signer.getAddress();
  }

  /**
   * Create a new loan offer
   */
  async createLoan(btcAmount: string, collateralAmount: string): Promise<number> {
    try {
      const tx = await this.contract.provideLoan(
        ethers.utils.parseEther(btcAmount),
        ethers.utils.parseEther(collateralAmount),
        { value: ethers.utils.parseEther(btcAmount) }
      );
      
      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'LoanCreated');
      return event?.args?.loanId?.toNumber() || 0;
    } catch (error) {
      console.error('Error creating loan:', error);
      throw error;
    }
  }

  /**
   * Take an existing loan by providing collateral
   */
  async takeLoan(loanId: number, collateralAmount: string): Promise<boolean> {
    try {
      const tx = await this.contract.takeLoan(loanId, {
        value: ethers.utils.parseEther(collateralAmount)
      });
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error taking loan:', error);
      throw error;
    }
  }

  /**
   * Repay a loan
   */
  async repayLoan(loanId: number, btcAmount: string): Promise<boolean> {
    try {
      const tx = await this.contract.repayLoan(loanId, {
        value: ethers.utils.parseEther(btcAmount)
      });
      
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error repaying loan:', error);
      throw error;
    }
  }

  /**
   * Get available loans
   */
  async getAvailableLoans(): Promise<Loan[]> {
    try {
      const loanIds = await this.contract.getAvailableLoans();
      const loans: Loan[] = [];
      
      for (const id of loanIds) {
        const loanData = await this.contract.loans(id);
        loans.push({
          id: id.toNumber(),
          lender: loanData.lender,
          borrower: loanData.borrower,
          btcAmount: ethers.utils.formatEther(loanData.btcAmount),
          collateralAmount: ethers.utils.formatEther(loanData.collateralAmount),
          isRepaid: loanData.isRepaid
        });
      }
      
      return loans;
    } catch (error) {
      console.error('Error fetching available loans:', error);
      throw error;
    }
  }
}

export const lendingService = new LendingService();
export default lendingService;