import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useLendingContract from "@/hooks/useLendingContract";

interface LoanFormProps {
  onLoanCreated: () => void;
}

export default function LoanForm({ onLoanCreated }: LoanFormProps) {
  const [btcAmount, setBtcAmount] = useState("");
  const [collateralAmount, setCollateralAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { createLoan } = useLendingContract();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!btcAmount || !collateralAmount || 
        parseFloat(btcAmount) <= 0 || 
        parseFloat(collateralAmount) <= 0) {
      return;
    }
    
    try {
      setIsCreating(true);
      await createLoan(btcAmount, collateralAmount);
      setBtcAmount("");
      setCollateralAmount("");
      onLoanCreated();
    } catch (error) {
      console.error("Error creating loan:", error);
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Loan Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="btcAmount">BTC Amount to Lend</Label>
            <Input
              id="btcAmount"
              type="number"
              step="0.00000001"
              value={btcAmount}
              onChange={(e) => setBtcAmount(e.target.value)}
              placeholder="0.0"
              required
            />
            <p className="text-xs text-muted-foreground">
              The amount of BTC you'll provide to the borrower.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="collateralAmount">Required Collateral (BTC)</Label>
            <Input
              id="collateralAmount"
              type="number"
              step="0.00000001"
              value={collateralAmount}
              onChange={(e) => setCollateralAmount(e.target.value)}
              placeholder="0.0"
              required
            />
            <p className="text-xs text-muted-foreground">
              The amount of collateral the borrower must provide.
            </p>
          </div>
          
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Loan Offer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}