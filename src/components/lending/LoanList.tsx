import { Loan } from "@/services/lendingService";
import LoanCard from "./LoanCard";

interface LoanListProps {
  loans: Loan[];
  userAddress: string;
  onLoanAction: () => void;
  isLoading: boolean;
}

export default function LoanList({ loans, userAddress, onLoanAction, isLoading }: LoanListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse bg-muted h-40 rounded-lg"></div>
        <div className="animate-pulse bg-muted h-40 rounded-lg"></div>
        <div className="animate-pulse bg-muted h-40 rounded-lg"></div>
      </div>
    );
  }
  
  if (loans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No loans available at the moment.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <LoanCard 
          key={loan.id} 
          loan={loan} 
          userAddress={userAddress}
          onLoanAction={onLoanAction}
        />
      ))}
    </div>
  );
}