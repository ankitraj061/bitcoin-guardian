
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BarChart3, LucideIcon, Lock, RefreshCw, Shield } from 'lucide-react';

interface SmartContract {
  id: string;
  name: string;
  description: string;
  active: boolean;
  icon: LucideIcon;
}

const SmartContractPanel = () => {
  const [contracts, setContracts] = useState<SmartContract[]>([
    {
      id: "auto-rebalance",
      name: "Auto-Rebalance",
      description: "Automatically rebalance your portfolio based on pre-set allocation targets.",
      active: true,
      icon: RefreshCw
    },
    {
      id: "security-lock",
      name: "Security Lock",
      description: "Lock your Bitcoin for a set period to prevent impulse selling during market volatility.",
      active: false,
      icon: Lock
    },
    {
      id: "fraud-protection",
      name: "Fraud Protection",
      description: "Implement additional security checks for transactions above a certain threshold.",
      active: true,
      icon: Shield
    },
    {
      id: "performance-tracking",
      name: "Performance Tracking",
      description: "Track your portfolio performance and receive detailed analytics.",
      active: false,
      icon: BarChart3
    }
  ]);

  const toggleContract = (id: string) => {
    setContracts(contracts.map(contract => 
      contract.id === id ? { ...contract, active: !contract.active } : contract
    ));
  };

  return (
    <Card className="glass-card w-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6">Smart Contracts</h3>
        
        <div className="space-y-6">
          {contracts.map((contract) => {
            const Icon = contract.icon;
            return (
              <div key={contract.id} className="flex items-center justify-between bg-muted/10 p-4 rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/20 text-primary mt-1">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium">{contract.name}</h4>
                    <p className="text-sm text-muted-foreground">{contract.description}</p>
                  </div>
                </div>
                <Switch
                  checked={contract.active}
                  onCheckedChange={() => toggleContract(contract.id)}
                />
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-end mt-6">
          <Button className="bg-primary hover:bg-primary/90">
            Apply Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartContractPanel;
