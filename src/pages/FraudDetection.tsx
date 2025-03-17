
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FraudDetectionPanel from "@/components/FraudDetectionPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, Eye, Lock } from "lucide-react";

const FraudDetection = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 mt-10">
          <h1 className="text-4xl font-bold mb-4">AI Fraud Detection</h1>
          <p className="text-muted-foreground max-w-3xl">
            BitGuardian's AI constantly monitors the blockchain for suspicious activities and potential threats to your Bitcoin assets. Stay protected with real-time alerts and smart risk assessment.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FraudDetectionPanel />
          </div>
          
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>Our AI-powered security system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/20 rounded-full">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Continuous Monitoring</h3>
                      <p className="text-xs text-muted-foreground">
                        Our AI analyzes blockchain transactions 24/7 to identify suspicious patterns.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/20 rounded-full">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Real-time Alerts</h3>
                      <p className="text-xs text-muted-foreground">
                        Receive instant notifications when potentially fraudulent activities are detected.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/20 rounded-full">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Threat Assessment</h3>
                      <p className="text-xs text-muted-foreground">
                        AI-powered risk scoring helps you understand the severity of potential threats.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-4 p-2 bg-primary/20 rounded-full">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Automatic Protection</h3>
                      <p className="text-xs text-muted-foreground">
                        Enable automatic blocking of suspicious transactions for maximum security.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Threats</CardTitle>
                <CardDescription>Global Bitcoin ecosystem threats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Phishing Campaign</span>
                      <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">High Risk</span>
                    </div>
                    <p className="text-xs text-muted-foreground">New wave of sophisticated phishing emails targeting Bitcoin holders detected.</p>
                  </div>
                  
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Suspicious Exchange</span>
                      <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">Medium Risk</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Unusual withdrawal patterns detected at smaller exchanges.</p>
                  </div>
                  
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Smart Contract Flaw</span>
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Fixed</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Recently identified vulnerability in popular DeFi protocol has been patched.</p>
                  </div>
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

export default FraudDetection;
