
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SmartContractPanel from "@/components/SmartContractPanel";
import AssetAllocationPanel from "@/components/AssetAllocationPanel";

const SmartContracts = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 mt-10">
          <h1 className="text-4xl font-bold mb-4">Smart Contracts & Auto-Reallocation</h1>
          <p className="text-muted-foreground max-w-3xl">
            Leverage the power of automated smart contracts and AI-driven asset reallocation to optimize your Bitcoin portfolio and secure your assets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SmartContractPanel />
          <AssetAllocationPanel />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Secure Storage</CardTitle>
              <CardDescription>Cold wallet integration</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect your hardware wallets and set up automatic transfers to cold storage for enhanced security.
              </p>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center text-xs">
                  <span>Ledger compatibility</span>
                  <span className="text-green-500">Available</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>Trezor compatibility</span>
                  <span className="text-green-500">Available</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>Multi-sig support</span>
                  <span className="text-green-500">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Automated Trading</CardTitle>
              <CardDescription>AI-powered trading algorithms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up rule-based trading strategies that execute automatically based on market conditions.
              </p>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center text-xs">
                  <span>DCA strategy</span>
                  <span className="text-green-500">Available</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>Grid trading</span>
                  <span className="text-green-500">Available</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>Limit orders</span>
                  <span className="text-green-500">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Tax Optimization</CardTitle>
              <CardDescription>Minimize tax liability</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Intelligently manage your transactions to optimize for tax efficiency and maintain compliance.
              </p>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-center text-xs">
                  <span>Tax-loss harvesting</span>
                  <span className="text-green-500">Available</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>FIFO/LIFO methods</span>
                  <span className="text-green-500">Available</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span>Transaction reports</span>
                  <span className="text-green-500">Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SmartContracts;
