import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loan } from "@/services/lendingService";
import { formatAddress } from "@/utils/formatAddress";
import { useState } from "react";
import { ethers } from "ethers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLendingContract from "@/hooks/useLendingContract";

interface LoanCardProps {
  loan: Loan;
  userAddress: string;
  onLoanAction: () => void;
}

export default function LoanCard({ loan, userAddress, onLoanAction }: LoanCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { takeLoan, repayLoan } = useLendingContract();
  
  const isLender = loan.lender.toLowerCase() === userAddress?.toLowerCase();
  const isBorrower = loan.borrower.toLowerCase() === userAddress?.toLowerCase();
  
  const handleTakeLoan = async () => {
    try {
      setIsProcessing(true);
      await takeLoan(loan.id, loan.collateralAmount);
      setIsDialogOpen(false);
      onLoanAction();
    } catch (error) {
      console.error("Error taking loan:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRepayLoan = async () => {
    try {
      setIsProcessing(true);
      await repayLoan(loan.id, loan.btcAmount);
      setIsDialogOpen(false);
      onLoanAction();
    } catch (error) {
      console.error("Error repaying loan:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Loan #{loan.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">{parseFloat(loan.btcAmount).toFixed(8)} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Collateral Required:</span>
              <span className="font-medium">{parseFloat(loan.collateralAmount).toFixed(8)} BTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lender:</span>
              <span className={`${isLender ? "text-primary" : ""}`}>
                {formatAddress(loan.lender)} {isLender && "(You)"}
              </span>
            </div>
            {loan.borrower !== ethers.constants.AddressZero && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Borrower:</span>
                <span className={`${isBorrower ? "text-primary" : ""}`}>
                  {formatAddress(loan.borrower)} {isBorrower && "(You)"}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className={`font-medium ${loan.isRepaid ? "text-green-500" : ""}`}>
                {loan.isRepaid ? "Repaid" : 
                  loan.borrower === ethers.constants.AddressZero ? "Available" : "Active"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          {loan.borrower === ethers.constants.AddressZero && !isLender && (
            <Button 
              className="w-full" 
              onClick={() => setIsDialogOpen(true)}
            >
              Take Loan
            </Button>
          )}
          
          {isBorrower && !loan.isRepaid && (
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={() => setIsDialogOpen(true)}
            >
              Repay Loan
            </Button>
          )}
          
          {(isLender && loan.borrower === ethers.constants.AddressZero) && (
            <Button className="w-full" variant="ghost" disabled>Your Loan Offer</Button>
          )}
          
          {(!isLender && !isBorrower && loan.borrower !== ethers.constants.AddressZero) && (
            <Button className="w-full" variant="ghost" disabled>Loan Taken</Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {loan.borrower === ethers.constants.AddressZero ? "Take Loan" : "Repay Loan"}
            </DialogTitle>
            <DialogDescription>
              {loan.borrower === ethers.constants.AddressZero 
                ? `Provide ${parseFloat(loan.collateralAmount).toFixed(8)} BTC as collateral to receive ${parseFloat(loan.btcAmount).toFixed(8)} BTC loan.`
                : `Repay ${parseFloat(loan.btcAmount).toFixed(8)} BTC to release your ${parseFloat(loan.collateralAmount).toFixed(8)} BTC collateral.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {loan.borrower === ethers.constants.AddressZero ? (
              <>
                <div className="flex justify-between">
                  <Label>Required Collateral:</Label>
                  <span className="font-medium">{parseFloat(loan.collateralAmount).toFixed(8)} BTC</span>
                </div>
                <div className="flex justify-between">
                  <Label>You Will Receive:</Label>
                  <span className="font-medium">{parseFloat(loan.btcAmount).toFixed(8)} BTC</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <Label>Amount to Repay:</Label>
                  <span className="font-medium">{parseFloat(loan.btcAmount).toFixed(8)} BTC</span>
                </div>
                <div className="flex justify-between">
                  <Label>Collateral to Release:</Label>
                  <span className="font-medium">{parseFloat(loan.collateralAmount).toFixed(8)} BTC</span>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={loan.borrower === ethers.constants.AddressZero ? handleTakeLoan : handleRepayLoan}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : loan.borrower === ethers.constants.AddressZero ? "Confirm & Take Loan" : "Confirm & Repay"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}