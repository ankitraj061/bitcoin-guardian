import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, TrendingDown, TrendingUp, Info, Clock, BarChart2, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type Signal = 'HOLD' | 'SELL' | 'BUY' | null;

interface SignalFactors {
  priceMovement: number;
  volatility: number;
  volume: number;
  sentiment: number;
}

const BitcoinAnalysis = () => {
  const [signal, setSignal] = useState<Signal>(null);
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [factors, setFactors] = useState<SignalFactors>({
    priceMovement: 0,
    volatility: 0,
    volume: 0,
    sentiment: 0
  });
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);

  const generateAnalysis = useCallback(() => {
    setLoading(true);
    
    // In a real app, this would be an API call to your ML model
    setTimeout(() => {
      // Generate random signal
      const signals: Signal[] = ['HOLD', 'SELL', 'BUY'];
      const randomSignal = signals[Math.floor(Math.random() * signals.length)];
      setSignal(randomSignal);
      
      // Generate random confidence between 60-95%
      const randomConfidence = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
      setConfidence(randomConfidence);
      
      // Generate random factors that influenced the decision
      const newFactors = {
        priceMovement: Math.floor(Math.random() * 100),
        volatility: Math.floor(Math.random() * 100),
        volume: Math.floor(Math.random() * 100),
        sentiment: Math.floor(Math.random() * 100)
      };
      setFactors(newFactors);
      
      setLastUpdated(new Date());
      setTimeSinceUpdate(0);
      setLoading(false);
    }, 1500);
  }, []);
  
  useEffect(() => {
    generateAnalysis();
    
    // Update analysis every 5 minutes
    const analysisInterval = setInterval(generateAnalysis, 300000);
    
    // Update time since update every second
    const timerInterval = setInterval(() => {
      setTimeSinceUpdate(prev => prev + 1);
    }, 1000);
    
    return () => {
      clearInterval(analysisInterval);
      clearInterval(timerInterval);
    };
  }, [generateAnalysis]);

  const getSignalDisplay = () => {
    if (loading) {
      return (
        <div className="h-24 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-sm text-muted-foreground">Analyzing market data...</span>
        </div>
      );
    }

    switch (signal) {
      case 'HOLD':
        return (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3 transition-all duration-300 hover:scale-110">
              <Lock size={36} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-500">HOLD</h3>
            <p className="text-sm text-muted-foreground mt-1">Maintain current positions</p>
          </div>
        );
      case 'SELL':
        return (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mb-3 transition-all duration-300 hover:scale-110">
              <TrendingDown size={36} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-red-500">SELL</h3>
            <p className="text-sm text-muted-foreground mt-1">Consider taking profits</p>
          </div>
        );
      case 'BUY':
        return (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mb-3 transition-all duration-300 hover:scale-110">
              <TrendingUp size={36} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-green-500">BUY</h3>
            <p className="text-sm text-muted-foreground mt-1">Favorable entry point</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center">
            <div className="h-20 w-20 rounded-full bg-muted/20 flex items-center justify-center mb-3">
              <AlertTriangle size={36} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-muted-foreground">NO SIGNAL</h3>
            <p className="text-sm text-muted-foreground mt-1">Insufficient data</p>
          </div>
        );
    }
  };

  const getSignalColor = () => {
    switch (signal) {
      case 'HOLD': return 'text-yellow-500';
      case 'SELL': return 'text-red-500';
      case 'BUY': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getSignalBgColor = () => {
    switch (signal) {
      case 'HOLD': return 'bg-yellow-500';
      case 'SELL': return 'bg-red-500';
      case 'BUY': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  return (
    <TooltipProvider>
      <Card className="glass-card h-full card-hover shadow-md border-primary/10">
        <CardHeader className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-primary" />
            <CardTitle className="text-lg">AI Market Signal</CardTitle>
          </div>
          <Badge variant="outline" className={`
            flex items-center gap-1 text-xs
            ${timeSinceUpdate < 60 ? 'bg-green-500/10 text-green-500' : ''}
            ${timeSinceUpdate >= 60 && timeSinceUpdate < 180 ? 'bg-amber-500/10 text-amber-500' : ''}
            ${timeSinceUpdate >= 180 ? 'bg-red-500/10 text-red-500' : ''}
          `}>
            <Clock size={12} />
            {timeSinceUpdate < 60 
              ? `Updated ${timeSinceUpdate}s ago`
              : `Updated ${Math.floor(timeSinceUpdate/60)}m ${timeSinceUpdate%60}s ago`
            }
          </Badge>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex justify-center my-6">
            {getSignalDisplay()}
          </div>
          
          {!loading && (
            <>
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">AI Confidence</span>
                  <span className={`font-medium ${getSignalColor()}`}>{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-2" style={{ ["--progress-background" as any]: getSignalBgColor() }} />
              </div>
              
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Info size={14} className="text-muted-foreground" />
                  Analysis Factors
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Price Movement</span>
                            <span>{factors.priceMovement}/100</span>
                          </div>
                          <Progress value={factors.priceMovement} className="h-1" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Recent price action trends</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Volatility</span>
                            <span>{factors.volatility}/100</span>
                          </div>
                          <Progress value={factors.volatility} className="h-1" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Market price stability</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Volume</span>
                            <span>{factors.volume}/100</span>
                          </div>
                          <Progress value={factors.volume} className="h-1" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Trading activity strength</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Sentiment</span>
                            <span>{factors.sentiment}/100</span>
                          </div>
                          <Progress value={factors.sentiment} className="h-1" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Market sentiment analysis</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="px-6 pb-6 pt-0">
          <div className="w-full space-y-3">
            <Link to="/recommendations" className="w-full">
              <Button variant="default" className="w-full gap-2">
                <History size={16} />
                Get Detailed Analysis
              </Button>
            </Link>
            <p className="text-xs text-center text-muted-foreground">
              AI analysis based on historical patterns, on-chain data, and market sentiment
            </p>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default BitcoinAnalysis;