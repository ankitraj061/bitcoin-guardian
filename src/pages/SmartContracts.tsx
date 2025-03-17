
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, XOctagon } from "lucide-react";
import SmartContractPanel from "@/components/SmartContractPanel";
import AssetAllocationPanel from "@/components/AssetAllocationPanel";

const SmartContracts = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">Smart Contracts & Asset Allocation</h1>
            <p className="text-muted-foreground mt-2">
              Automated portfolio management and asset protection features
            </p>
          </div>
          
          <div className="mb-12">
            <SmartContractPanel />
          </div>
          
          <div className="mb-12">
            <AssetAllocationPanel />
          </div>
          
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How Smart Contracts Work</h3>
                
                <p className="text-muted-foreground mb-4">
                  Smart contracts are self-executing contracts with the terms directly written into code. 
                  They automatically enforce and execute agreements without intermediaries.
                </p>
                
                <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
                  <li>Define your contract terms and allocation preferences</li>
                  <li>Our system converts your preferences into secure code</li>
                  <li>The contract executes automatically when conditions are met</li>
                  <li>All transactions are recorded and verified on the blockchain</li>
                  <li>Monitor and modify your contracts through our dashboard</li>
                </ol>
                
                <div className="mt-6">
                  <Button variant="outline" className="flex items-center">
                    <FileText size={18} className="mr-2" />
                    Learn More About Smart Contracts
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Safety & Security</h3>
                
                <div className="space-y-4">
                  <div className="bg-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Multi-signature Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      All smart contracts require multiple signatures for execution, providing an extra layer of security.
                    </p>
                  </div>
                  
                  <div className="bg-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Audit Trail</h4>
                    <p className="text-sm text-muted-foreground">
                      Every action is recorded and immutably stored on the blockchain, ensuring complete transparency.
                    </p>
                  </div>
                  
                  <div className="bg-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Cancellation Options</h4>
                    <p className="text-sm text-muted-foreground">
                      All contracts can be cancelled within a 24-hour window with proper authentication.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="flex items-center text-destructive">
                    <XOctagon size={18} className="mr-2" />
                    Emergency Contract Suspension
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SmartContracts;
