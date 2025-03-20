
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, LineChart, TrendingUp, Activity, ShieldCheck } from "lucide-react";

const Recommendations = () => {
  const [riskLevel, setRiskLevel] = useState("moderate");
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 mt-10">
          <h1 className="text-4xl font-bold mb-4">AI-Powered Recommendations</h1>
          <p className="text-muted-foreground max-w-3xl">
            Get personalized Bitcoin investment recommendations based on real-time market analysis and your risk profile.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glass-card mb-8">
              <CardHeader>
                <CardTitle>Current Interest Rates</CardTitle>
                <CardDescription>Compare interest rates for Bitcoin holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-500">B1</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">BlockFi</h3>
                        <p className="text-xs text-muted-foreground">Flexible terms</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">4.5%</p>
                      <p className="text-xs text-muted-foreground">APY</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <div className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center">
                          <span className="text-xs font-bold text-green-500">C2</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Celsius</h3>
                        <p className="text-xs text-muted-foreground">3-month lock</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">5.8%</p>
                      <p className="text-xs text-muted-foreground">APY</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-500">N3</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Nexo</h3>
                        <p className="text-xs text-muted-foreground">6-month lock</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">6.2%</p>
                      <p className="text-xs text-muted-foreground">APY</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/20 to-yellow-400/20 rounded-lg border border-primary/30">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center mr-3">
                        <div className="w-6 h-6 rounded-full bg-primary/40 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">BG</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">BitGuardian Smart Yield</h3>
                        <p className="text-xs text-muted-foreground">AI-optimized allocation</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">7.5%</p>
                      <p className="text-xs text-muted-foreground">APY</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Personalized Strategy</CardTitle>
                <CardDescription>Based on your risk profile and market analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <p className="text-sm mb-3">Select your risk tolerance:</p>
                  <Tabs value={riskLevel} onValueChange={setRiskLevel}>
                    <TabsList className="w-full">
                      <TabsTrigger value="conservative">Conservative</TabsTrigger>
                      <TabsTrigger value="moderate">Moderate</TabsTrigger>
                      <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="bg-muted/20 p-5 rounded-lg space-y-4">
                  <div className="flex items-start">
                    <LineChart className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium">AI Analysis</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on current market conditions and your {riskLevel} risk profile, we recommend the following allocation strategy.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-card p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">HODL</p>
                      <p className="text-lg font-bold">
                        {riskLevel === "conservative" ? "60%" : riskLevel === "moderate" ? "50%" : "30%"}
                      </p>
                    </div>
                    <div className="bg-card p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">Yield Farming</p>
                      <p className="text-lg font-bold">
                        {riskLevel === "conservative" ? "30%" : riskLevel === "moderate" ? "35%" : "40%"}
                      </p>
                    </div>
                    <div className="bg-card p-3 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">Trading</p>
                      <p className="text-lg font-bold">
                        {riskLevel === "conservative" ? "10%" : riskLevel === "moderate" ? "15%" : "30%"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button className="w-full">Apply This Strategy</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Market Signals</CardTitle>
                <CardDescription>Current market indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-muted">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Moving Average (50d)</span>
                    </div>
                    <span className="text-sm font-medium text-green-500">Bullish</span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-2 border-b border-muted">
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-sm">Volatility Index</span>
                    </div>
                    <span className="text-sm font-medium text-amber-500">Moderate</span>
                  </div>
                  
                  <div className="flex items-center justify-between pb-2 border-b border-muted">
                    <div className="flex items-center">
                      <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Network Security</span>
                    </div>
                    <span className="text-sm font-medium text-green-500">Strong</span>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm font-medium text-green-500 mb-1">AI Prediction</p>
                    <p className="text-xs">Based on on-chain analytics and technical indicators, Bitcoin is likely to test resistance at $68,000 within the next 14 days.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Recent Recommendations</CardTitle>
                <CardDescription>AI-generated insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">2 days ago</p>
                    <p className="text-sm mb-2">Increase DCA amount by 15% during market dip below $60,000</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-500">+3.8% gain</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Details <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">5 days ago</p>
                    <p className="text-sm mb-2">Move 10% of holdings to BitGuardian Smart Yield</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-500">+1.2% APY increase</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Details <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">1 week ago</p>
                    <p className="text-sm mb-2">Set up smart contract to take profit at $72,000</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-500">Pending</span>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Details <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
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

export default Recommendations;
