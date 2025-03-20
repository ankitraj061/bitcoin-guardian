import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchBitcoinData, fetchFearGreedIndex } from "@/services/bitcoinService";
import { generateTradingSignals } from "@/services/tradingSignalService";
import { generateRecommendations, generateAIAnalysis, Recommendation } from "@/services/recommendationService";
import RecommendationCard from "@/components/RecommendationCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, TrendingUp, TrendingDown, Activity, LineChart, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Recommendations = () => {
  const [bitcoinData, setBitcoinData] = useState<any>(null);
  const [fearGreedIndex, setFearGreedIndex] = useState<any>(null);
  const [tradingSignals, setTradingSignals] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [userRiskProfile, setUserRiskProfile] = useState<string>("moderate");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState<number>(5);

  const fetchAllData = async () => {
    setLoading(true);
    
    try {
      // Fetch all necessary data in parallel
      const [btcData, fgIndex, signals] = await Promise.all([
        fetchBitcoinData(),
        fetchFearGreedIndex(),
        generateTradingSignals()
      ]);
      
      setBitcoinData(btcData);
      setFearGreedIndex(fgIndex);
      setTradingSignals(signals);
      
      // Generate recommendations based on fetched data
      const recs = generateRecommendations(btcData, fgIndex, signals);
      setRecommendations(recs);
      
      // Generate AI analysis
      const analysis = generateAIAnalysis(btcData, fgIndex, signals, userRiskProfile);
      setAiAnalysis(analysis);
      
      // Update last refreshed time
      setLastUpdated(new Date());
      
      // Reset countdown
      setCountdown(5);
    } catch (error) {
      console.error('Error loading recommendation data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to start auto-refresh
  const startAutoRefresh = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
    }
    
    // Set up the auto-refresh interval
    refreshTimerRef.current = setInterval(() => {
      if (!loading) { // Don't trigger if already loading
        fetchAllData();
      }
    }, 5000); // 5 seconds
    
    // Start countdown timer
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 5));
    }, 1000);
  };

  // Function to stop auto-refresh
  const stopAutoRefresh = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    if (isAutoRefreshing) {
      stopAutoRefresh();
    } else {
      startAutoRefresh();
      // Reset countdown when turning auto-refresh back on
      setCountdown(5);
    }
    setIsAutoRefreshing(!isAutoRefreshing);
  };
  
  // Fetch data on component mount and when risk profile changes
  useEffect(() => {
    fetchAllData();
    
    // Start auto-refresh if enabled
    if (isAutoRefreshing) {
      startAutoRefresh();
    }
    
    // Clean up on component unmount
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [userRiskProfile]);
  
  const handleRefresh = () => {
    fetchAllData();
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 mt-12">Bitcoin Recommendations</h1>
            <p className="text-muted-foreground flex items-center">
              AI-powered insights to help guide your Bitcoin strategy
              {isAutoRefreshing && (
                <span className="ml-2 text-xs text-primary flex items-center">
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Auto-refresh in {countdown}s
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div>
              <label htmlFor="risk-profile" className="text-sm font-medium mr-2">
                Risk Profile:
              </label>
              <select
                id="risk-profile"
                value={userRiskProfile}
                onChange={(e) => setUserRiskProfile(e.target.value)}
                className="rounded border p-1 bg-background text-sm"
              >
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
            <Button 
              variant={isAutoRefreshing ? "default" : "outline"} 
              size="sm" 
              onClick={toggleAutoRefresh}
              className={isAutoRefreshing ? "bg-primary text-primary-foreground" : ""}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isAutoRefreshing ? "animate-spin" : ""}`} />
              {isAutoRefreshing ? "Auto: ON" : "Auto: OFF"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Last updated indicator */}
        <div className="flex items-center justify-end mb-4 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" /> Last updated: {formatLastUpdated()}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[300px] rounded-lg" />
              <Skeleton className="h-[300px] rounded-lg" />
            </div>
          </div>
        ) : (
          <>
            {/* Market Overview Card */}
            <Card className="mb-6 glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Bitcoin Price</h3>
                    <div className="text-2xl font-bold">${bitcoinData?.price.toLocaleString()}</div>
                    <div className={bitcoinData?.priceChange24h >= 0 ? "text-green-500 flex items-center" : "text-red-500 flex items-center"}>
                      {bitcoinData?.priceChange24h >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {bitcoinData?.priceChangePercentage24h.toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Fear & Greed Index</h3>
                    <div className="text-2xl font-bold">{fearGreedIndex?.value}</div>
                    <div className={
                      fearGreedIndex?.value <= 25 ? "text-red-500" : 
                      fearGreedIndex?.value <= 50 ? "text-yellow-500" : 
                      fearGreedIndex?.value <= 75 ? "text-green-500" : 
                      "text-orange-500"
                    }>
                      {fearGreedIndex?.valueText}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">Technical Outlook</h3>
                    <div className="text-2xl font-bold">{tradingSignals?.summary?.recommendation.replace('_', ' ')}</div>
                    <div className="flex items-center">
                      <Activity className="h-4 w-4 mr-1" />
                      Score: {tradingSignals?.summary?.score}/100
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - AI Analysis & Recommendations */}
              <div className="lg:col-span-2">
                {/* AI Analysis Section */}
                <Card className="mb-6 glass-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">AI Analysis</CardTitle>
                    <CardDescription>Personalized insights based on your {userRiskProfile} risk profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      {aiAnalysis.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recommendations */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Smart Recommendations</h2>
                    <span className="text-xs text-muted-foreground">Updated {new Date().toLocaleDateString()}</span>
                  </div>
                  
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="buy">Buy</TabsTrigger>
                      <TabsTrigger value="sell">Sell</TabsTrigger>
                      <TabsTrigger value="dca">DCA</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      {recommendations.length > 0 ? (
                        recommendations.map((rec) => (
                          <RecommendationCard key={rec.id} recommendation={rec} />
                        ))
                      ) : (
                        <p className="text-muted-foreground">No recommendations available at this time.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="buy">
                      {recommendations.filter(rec => rec.category === 'buy').length > 0 ? (
                        recommendations
                          .filter(rec => rec.category === 'buy')
                          .map((rec) => (
                            <RecommendationCard key={rec.id} recommendation={rec} />
                          ))
                      ) : (
                        <p className="text-muted-foreground">No buy recommendations available at this time.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="sell">
                      {recommendations.filter(rec => rec.category === 'sell').length > 0 ? (
                        recommendations
                          .filter(rec => rec.category === 'sell')
                          .map((rec) => (
                            <RecommendationCard key={rec.id} recommendation={rec} />
                          ))
                      ) : (
                        <p className="text-muted-foreground">No sell recommendations available at this time.</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="dca">
                      {recommendations.filter(rec => rec.category === 'dca').length > 0 ? (
                        recommendations
                          .filter(rec => rec.category === 'dca')
                          .map((rec) => (
                            <RecommendationCard key={rec.id} recommendation={rec} />
                          ))
                      ) : (
                        <p className="text-muted-foreground">No DCA recommendations available at this time.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              
              {/* Right Column - Technical Indicators */}
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Technical Indicators</CardTitle>
                    <CardDescription>Real-time market signals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="font-medium mb-2 text-sm">Moving Averages</h3>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Buy</span>
                        <span className="text-xs font-medium">{tradingSignals?.movingAverages?.buy}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${(tradingSignals?.movingAverages?.buy / 17) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Neutral</span>
                        <span className="text-xs font-medium">{tradingSignals?.movingAverages?.neutral}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ width: `${(tradingSignals?.movingAverages?.neutral / 17) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Sell</span>
                        <span className="text-xs font-medium">{tradingSignals?.movingAverages?.sell}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: `${(tradingSignals?.movingAverages?.sell / 17) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-medium mb-2 text-sm">Oscillators</h3>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Buy</span>
                        <span className="text-xs font-medium">{tradingSignals?.oscillators?.buy}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${(tradingSignals?.oscillators?.buy / 17) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Neutral</span>
                        <span className="text-xs font-medium">{tradingSignals?.oscillators?.neutral}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full" 
                          style={{ width: `${(tradingSignals?.oscillators?.neutral / 17) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between mb-1">
                        <span className="text-xs">Sell</span>
                        <span className="text-xs font-medium">{tradingSignals?.oscillators?.sell}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: `${(tradingSignals?.oscillators?.sell / 17) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <div className={`p-3 rounded-lg ${
                        tradingSignals?.summary?.recommendation.includes('BUY') ? 
                          'bg-green-500/10 border border-green-500/20' : 
                        tradingSignals?.summary?.recommendation.includes('SELL') ?
                          'bg-red-500/10 border border-red-500/20' :
                          'bg-yellow-500/10 border border-yellow-500/20'
                      }`}>
                        <div className="flex items-center mb-1">
                          <LineChart className={`h-4 w-4 mr-2 ${
                            tradingSignals?.summary?.recommendation.includes('BUY') ? 'text-green-500' : 
                            tradingSignals?.summary?.recommendation.includes('SELL') ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <p className={`text-sm font-medium ${
                            tradingSignals?.summary?.recommendation.includes('BUY') ? 'text-green-500' : 
                            tradingSignals?.summary?.recommendation.includes('SELL') ? 'text-red-500' : 'text-yellow-500'
                          }`}>
                            {tradingSignals?.summary?.recommendation.replace('_', ' ')}
                          </p>
                        </div>
                        <p className="text-xs">Based on the analysis of 34 technical indicators across multiple timeframes.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Market Sentiment</CardTitle>
                    <CardDescription>Fear & Greed Index</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mb-4">
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center ${
                        fearGreedIndex?.value <= 25 ? "bg-red-500/20" : 
                        fearGreedIndex?.value <= 50 ? "bg-yellow-500/20" : 
                        fearGreedIndex?.value <= 75 ? "bg-green-500/20" : 
                        "bg-orange-500/20"
                      }`}>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                          fearGreedIndex?.value <= 25 ? "bg-red-500/30" : 
                          fearGreedIndex?.value <= 50 ? "bg-yellow-500/30" : 
                          fearGreedIndex?.value <= 75 ? "bg-green-500/30" : 
                          "bg-orange-500/30"
                        }`}>
                          <div className="text-center">
                            <p className={`text-3xl font-bold ${
                              fearGreedIndex?.value <= 25 ? "text-red-500" : 
                              fearGreedIndex?.value <= 50 ? "text-yellow-500" : 
                              fearGreedIndex?.value <= 75 ? "text-green-500" : 
                              "text-orange-500"
                            }`}>{fearGreedIndex?.value}</p>
                            <p className="text-xs">{fearGreedIndex?.valueText}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Extreme Fear</span>
                        <span className="text-xs">Extreme Greed</span>
                      </div>
                      <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 rounded-full">
                        <div 
                          className="w-3 h-3 bg-background border-2 border-primary rounded-full relative -top-0.5"
                          style={{ marginLeft: `calc(${fearGreedIndex?.value}% - 6px)` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-4">
                      <p className="mb-2">The Fear & Greed Index measures market sentiment:</p>
                      <ul className="space-y-1">
                        <li>0-25: <span className="text-red-500">Extreme Fear</span> (potential buying opportunity)</li>
                        <li>26-50: <span className="text-yellow-500">Fear</span></li>
                        <li>51-75: <span className="text-green-500">Greed</span></li>
                        <li>76-100: <span className="text-orange-500">Extreme Greed</span> (potential correction ahead)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Strategy Allocation</CardTitle>
                    <CardDescription>Suggested for {userRiskProfile} profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">HODL (Long-term)</span>
                          <span className="text-sm font-bold">
                            {userRiskProfile === "conservative" ? "60%" : userRiskProfile === "moderate" ? "50%" : "30%"}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: userRiskProfile === "conservative" ? "60%" : 
                                    userRiskProfile === "moderate" ? "50%" : "30%" 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Yield Generation</span>
                          <span className="text-sm font-bold">
                            {userRiskProfile === "conservative" ? "30%" : userRiskProfile === "moderate" ? "35%" : "40%"}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: userRiskProfile === "conservative" ? "30%" : 
                                    userRiskProfile === "moderate" ? "35%" : "40%" 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Trading</span>
                          <span className="text-sm font-bold">
                            {userRiskProfile === "conservative" ? "10%" : userRiskProfile === "moderate" ? "15%" : "30%"}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ 
                              width: userRiskProfile === "conservative" ? "10%" : 
                                    userRiskProfile === "moderate" ? "15%" : "30%" 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button className="w-full">
                        Apply This Strategy <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;