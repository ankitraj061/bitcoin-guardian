
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface RiskFactor {
  name: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
}

const RiskAssessment = () => {
  // In a real application, this would come from an API
  const [riskFactors] = useState<RiskFactor[]>([
    {
      name: "Price Volatility",
      riskLevel: "high",
      description: "Bitcoin's price can experience significant fluctuations over short periods."
    },
    {
      name: "Regulatory Risks",
      riskLevel: "medium",
      description: "Government regulations regarding cryptocurrencies could impact Bitcoin's value."
    },
    {
      name: "Market Manipulation",
      riskLevel: "medium",
      description: "Large holders can influence price through coordinated buying or selling."
    },
    {
      name: "Security Vulnerabilities",
      riskLevel: "low",
      description: "While Bitcoin's network is secure, exchanges and wallets can be vulnerable."
    },
    {
      name: "Adoption Uncertainty",
      riskLevel: "medium",
      description: "Long-term value depends on continued adoption and acceptance."
    }
  ]);

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle size={20} className="text-green-500" />;
      case "medium":
        return <Shield size={20} className="text-yellow-500" />;
      case "high":
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/30";
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      default:
        return "";
    }
  };

  return (
    <Card className="glass-card w-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-6">Risk Assessment</h3>
        
        <div className="space-y-4">
          {riskFactors.map((factor, index) => (
            <div key={index} className="bg-muted/10 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {getRiskIcon(factor.riskLevel)}
                  <h4 className="ml-2 font-medium">{factor.name}</h4>
                </div>
                <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getRiskColor(factor.riskLevel)}`}>
                  {factor.riskLevel.charAt(0).toUpperCase() + factor.riskLevel.slice(1)} Risk
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{factor.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-muted">
          <h4 className="font-medium mb-3">Overall Assessment</h4>
          <p className="text-sm text-muted-foreground">
            Based on current market conditions and historical data, Bitcoin presents a <span className="text-yellow-500 font-medium">moderate risk</span> investment. 
            Our AI analysis suggests maintaining a balanced portfolio with no more than 5-10% allocation to Bitcoin for most investors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskAssessment;
