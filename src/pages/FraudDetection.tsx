
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import FraudDetectionPanel from "@/components/FraudDetectionPanel";
import RiskAssessment from "@/components/RiskAssessment";
import { ShieldAlert, TrendingUp, Shield, Lock } from "lucide-react";

const FraudDetection = () => {
  const protectionFeatures = [
    {
      icon: <ShieldAlert size={24} className="text-primary" />,
      title: "Real-time Alerts",
      description: "Receive instant notifications about suspicious activities related to Bitcoin."
    },
    {
      icon: <TrendingUp size={24} className="text-primary" />,
      title: "Market Trend Analysis",
      description: "AI-powered analysis identifies unusual patterns that may indicate fraud."
    },
    {
      icon: <Shield size={24} className="text-primary" />,
      title: "Network Security Monitoring",
      description: "Continuous monitoring of the Bitcoin network for potential security threats."
    },
    {
      icon: <Lock size={24} className="text-primary" />,
      title: "Wallet Protection",
      description: "Advanced security features to protect your Bitcoin wallet from unauthorized access."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">Fraud Detection & Security</h1>
            <p className="text-muted-foreground mt-2">
              Advanced AI-powered fraud detection and risk assessment for Bitcoin
            </p>
          </div>
          
          <div className="mb-12">
            <FraudDetectionPanel />
          </div>
          
          <div className="mb-12">
            <RiskAssessment />
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Bitcoin Protection Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {protectionFeatures.map((feature, index) => (
                <Card key={index} className="glass-card card-hover">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-card flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="mb-12">
            <Card className="glass-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Common Bitcoin Scams to Watch For</h3>
                
                <ul className="space-y-4">
                  <li className="bg-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Fake Exchanges</h4>
                    <p className="text-sm text-muted-foreground">
                      Scammers create fake exchange websites that mimic legitimate platforms to steal your credentials and funds.
                    </p>
                  </li>
                  <li className="bg-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Phishing Attacks</h4>
                    <p className="text-sm text-muted-foreground">
                      Emails or messages purporting to be from legitimate services asking for your private keys or login information.
                    </p>
                  </li>
                  <li className="bg-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Ponzi Schemes</h4>
                    <p className="text-sm text-muted-foreground">
                      Investment opportunities promising unrealistic returns that use new investor funds to pay earlier investors.
                    </p>
                  </li>
                  <li className="bg-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium mb-1">Fake Bitcoin Wallets</h4>
                    <p className="text-sm text-muted-foreground">
                      Malicious wallet apps that steal your Bitcoin as soon as funds are transferred.
                    </p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FraudDetection;
