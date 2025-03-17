
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const FraudAlertPreview = () => {
  // Random risk score between 1-100 for demo
  const riskScore = Math.floor(Math.random() * 100) + 1;
  
  // Determine risk level based on score
  const getRiskLevel = () => {
    if (riskScore < 30) return { level: "Low", color: "text-green-500", bg: "bg-green-500/20" };
    if (riskScore < 70) return { level: "Medium", color: "text-yellow-500", bg: "bg-yellow-500/20" };
    return { level: "High", color: "text-red-500", bg: "bg-red-500/20" };
  };
  
  const risk = getRiskLevel();

  return (
    <Card className="glass-card card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-12 w-12 rounded-full bg-bitcoin/20 flex items-center justify-center mr-4">
              <ShieldCheck size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-bold">Fraud Detection System</h3>
          </div>
          
          <div className={`px-4 py-2 rounded-full flex items-center ${risk.bg}`}>
            {risk.level === "High" ? (
              <AlertTriangle size={16} className={risk.color} />
            ) : (
              <Lock size={16} className={risk.color} />
            )}
            <span className={`ml-2 font-medium ${risk.color}`}>
              {risk.level} Risk
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Risk Score</span>
            <span className="font-medium">{riskScore}/100</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                risk.level === "Low" ? "bg-green-500" :
                risk.level === "Medium" ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-6">
          Our AI-powered system monitors blockchain transactions and market activities to protect your investments from fraudulent activities.
        </p>
        
        <Link to="/fraud-detection" className="w-full block">
          <Button className="w-full">Check Fraud Analytics</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FraudAlertPreview;
