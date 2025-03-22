import { useState, useCallback, useEffect } from 'react';
import lendingService, { Loan } from '@/services/lendingService';

interface UseLendingContractReturn {
  account: string | null;
  connectWallet: () => Promise<void>;
  isConnecting: boolean;
  createLoan: (btcAmount: string, collateralAmount: string) => Promise<number>;
  takeLoan: (loanId: number, collateralAmount: string) => Promise<boolean>;
  repayLoan: (loanId: number, btcAmount: string) => Promise<boolean>;
  availableLoans: Loan[];
  loading: boolean;
  error: string | null;
  refreshLoans: () => Promise<void>;
}

export function useLendingContract(): UseLendingContractReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableLoans, setAvailableLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const address = await lendingService.connectWallet();
      setAccount(address);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Make sure MetaMask is installed and unlocked.');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const createLoan = useCallback(async (btcAmount: string, collateralAmount: string) => {
    try {
      setError(null);
      return await lendingService.createLoan(btcAmount, collateralAmount);
    } catch (err) {
      console.error('Failed to create loan:', err);
      setError('Failed to create loan. Please try again.');
      throw err;
    }
  }, []);

  const takeLoan = useCallback(async (loanId: number, collateralAmount: string) => {
    try {
      setError(null);
      return await lendingService.takeLoan(loanId, collateralAmount);
    } catch (err) {
      console.error('Failed to take loan:', err);
      setError('Failed to take loan. Please try again.');
      throw err;
    }
  }, []);

  const repayLoan = useCallback(async (loanId: number, btcAmount: string) => {
    try {
      setError(null);
      return await lendingService.repayLoan(loanId, btcAmount);
    } catch (err) {
      console.error('Failed to repay loan:', err);
      setError('Failed to repay loan. Please try again.');
      throw err;
    }
  }, []);

  const refreshLoans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loans = await lendingService.getAvailableLoans();
      setAvailableLoans(loans);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      setError('Failed to fetch available loans. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load of available loans
  useEffect(() => {
    if (account) {
      refreshLoans();
    }
  }, [account, refreshLoans]);

  return {
    account,
    connectWallet,
    isConnecting,
    createLoan,
    takeLoan,
    repayLoan,
    availableLoans,
    loading,
    error,
    refreshLoans
  };
}

export default useLendingContract;