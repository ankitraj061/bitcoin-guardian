import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  Bitcoin, 
  CircleUser, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Shield, 
  Info, 
  AlertTriangle, 
  ChevronRight, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity
} from "lucide-react";

// Mock data for charts and analytics
const mockBitcoinData = {
  price: 64891,
  priceChange: 2.45,
  marketCap: "1.23T",
  volume24h: "45.7B",
  circulatingSupply: "19.4M",
  riskScore: 35,
  priceHistory: [35000, 38000, 42000, 40000, 43000, 47000, 50000, 54000, 58000, 56000, 60000, 64000, 65000],
  recentTransactions: [
    { id: 1, type: "received", amount: 0.12, time: "Today, 2:45 PM", status: "completed", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
    { id: 2, type: "sent", amount: 0.05, time: "Yesterday, 11:20 AM", status: "completed", address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy" },
    { id: 3, type: "received", amount: 0.08, time: "Mar 15, 2025", status: "completed", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" }
  ],
  insights: [
    { id: 1, type: "info", title: "Bull Market Continues", description: "Bitcoin showing strong upward momentum in the current market cycle." },
    { id: 2, type: "warning", title: "Volatility Alert", description: "Prepare for potential price swings as market shows signs of uncertainty." },
    { id: 3, type: "success", title: "Security Check Passed", description: "Your wallet security is optimal. Last scan: Today" }
  ]
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [bitcoinData, setBitcoinData] = useState(mockBitcoinData);
  
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Simple price chart component using divs
  const SimplePriceChart = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="w-full flex items-end h-16 gap-1">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100;
          const isCurrentMonth = index === data.length - 1;
          
          return (
            <div 
              key={index}
              className="flex-1"
            >
              <motion.div 
                className={`${isCurrentMonth ? 'bg-primary' : 'bg-primary/50'} rounded-t`}
                style={{ height: `${height}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: index * 0.05, type: "spring" }}
              />
            </div>
          );
        })}
      </div>
    );
  };
  
  // Risk score calculation
  const getRiskColor = (score: number) => {
    if (score <= 33) return "text-green-500";
    if (score <= 66) return "text-yellow-500";
    return "text-red-500";
  };
  
  const getRiskLabel = (score: number) => {
    if (score <= 33) return "Low";
    if (score <= 66) return "Moderate";
    return "High";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header section with welcome message */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Alex</h1>
            <p className="text-muted-foreground">Here's what's happening with your Bitcoin today</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="outline" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            <Link to="/profile">
              <Avatar className="cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="bg-primary/10 text-primary">AJ</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </motion.div>
        
        {/* Main tabs for different dashboard views */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-6 bg-muted/50 p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-background">
                <BarChart3 size={16} />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Wallet size={16} />
                <span className="hidden sm:inline">Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Shield size={16} />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Activity size={16} />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Price overview card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  variants={itemVariants}
                  className="col-span-1 md:col-span-2"
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Bitcoin Price</CardTitle>
                        <CardDescription>Live price and 12-month trend</CardDescription>
                      </div>
                      <Bitcoin size={24} className="text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                        <div>
                          <p className="text-3xl font-bold mb-2">
                            ${bitcoinData.price.toLocaleString()}
                            <span className={`text-sm ml-2 ${bitcoinData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {bitcoinData.priceChange >= 0 ? '+' : ''}{bitcoinData.priceChange}%
                            </span>
                          </p>
                          <p className="text-muted-foreground text-sm">Last updated: March 18, 2025 · 2:45 PM</p>
                        </div>
                        <div className="flex gap-4 mt-4 md:mt-0">
                          <div>
                            <p className="text-sm text-muted-foreground">Market Cap</p>
                            <p className="font-medium">${bitcoinData.marketCap}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">24h Volume</p>
                            <p className="font-medium">${bitcoinData.volume24h}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        {isLoading ? (
                          <div className="w-full h-16 bg-muted/30 rounded animate-pulse" />
                        ) : (
                          <SimplePriceChart data={bitcoinData.priceHistory} />
                        )}
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                          <span>Mar 2024</span>
                          <span>Mar 2025</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Link to="/bitcoin-info" className="text-primary text-sm flex items-center hover:underline">
                        View detailed analysis
                        <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Risk Assessment</CardTitle>
                      <CardDescription>Current market risk analysis</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[calc(100%-130px)]">
                      <div className="relative w-36 h-36 mb-6">
                        {isLoading ? (
                          <div className="w-full h-full rounded-full bg-muted/30 animate-pulse" />
                        ) : (
                          <>
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                className="text-muted/20"
                              />
                              <motion.circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="10"
                                strokeDasharray={`${bitcoinData.riskScore * 2.83} 283`}
                                className={getRiskColor(bitcoinData.riskScore)}
                                initial={{ strokeDasharray: "0 283" }}
                                animate={{ strokeDasharray: `${bitcoinData.riskScore * 2.83} 283` }}
                                transition={{ duration: 1, delay: 0.5 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <p className={`text-3xl font-bold ${getRiskColor(bitcoinData.riskScore)}`}>
                                {bitcoinData.riskScore}%
                              </p>
                              <p className="text-sm">{getRiskLabel(bitcoinData.riskScore)} Risk</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Market Volatility</span>
                          <span className="font-medium">Moderate</span>
                        </div>
                        <Progress value={55} className="h-2" />
                        
                        <div className="flex justify-between text-sm mt-3">
                          <span>Liquidity</span>
                          <span className="font-medium">High</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              {/* AI Insights section */}
              <motion.div variants={itemVariants}>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Info size={18} className="mr-2 text-primary" />
                  AI Insights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {bitcoinData.insights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + insight.id * 0.1 }}
                    >
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex gap-4 items-start">
                            {insight.type === 'info' && (
                              <div className="rounded-full p-2 bg-blue-500/10 text-blue-500">
                                <Info size={18} />
                              </div>
                            )}
                            {insight.type === 'warning' && (
                              <div className="rounded-full p-2 bg-yellow-500/10 text-yellow-500">
                                <AlertTriangle size={18} />
                              </div>
                            )}
                            {insight.type === 'success' && (
                              <div className="rounded-full p-2 bg-green-500/10 text-green-500">
                                <Shield size={18} />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium mb-1">{insight.title}</h3>
                              <p className="text-sm text-muted-foreground">{insight.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Recent transactions */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your latest Bitcoin transactions</CardDescription>
                      </div>
                      <Link to="/transactions">
                        <Button variant="ghost" size="sm" className="text-primary">
                          View All
                          <ExternalLink size={14} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bitcoinData.recentTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${
                              tx.type === 'received' 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-muted text-primary'
                            }`}>
                              {tx.type === 'received' ? (
                                <ArrowDownRight size={16} />
                              ) : (
                                <ArrowUpRight size={16} />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {tx.type === 'received' ? 'Received BTC' : 'Sent BTC'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.time} • {tx.address.substring(0, 6)}...{tx.address.substring(tx.address.length - 4)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${tx.type === 'received' ? 'text-green-500' : ''}`}>
                              {tx.type === 'received' ? '+' : '-'} {tx.amount} BTC
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${(tx.amount * bitcoinData.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="wallet">
              <motion.div variants={itemVariants}>
                <div className="bg-muted/20 rounded-lg p-8 text-center">
                  <Wallet className="mx-auto h-12 w-12 text-primary opacity-50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Wallet Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're working on a comprehensive wallet management system to help you track and secure your Bitcoin assets.
                  </p>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="security">
              <motion.div variants={itemVariants}>
                <div className="bg-muted/20 rounded-lg p-8 text-center">
                  <Shield className="mx-auto h-12 w-12 text-primary opacity-50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Security Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Advanced security features and monitoring tools are being developed to keep your Bitcoin investments safe.
                  </p>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="activity">
              <motion.div variants={itemVariants}>
                <div className="bg-muted/20 rounded-lg p-8 text-center">
                  <Activity className="mx-auto h-12 w-12 text-primary opacity-50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Activity Dashboard Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Track all your Bitcoin-related activities, transactions, and interactions with the BitGuardian platform.
                  </p>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;