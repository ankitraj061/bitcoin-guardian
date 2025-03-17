
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock, TrendingDown, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

type Signal = 'HOLD' | 'SELL' | 'BUY' | null;

const BitcoinAnalysis = () => {
  const [signal, setSignal] = useState<Signal>(null);
  const [confidence, setConfidence] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis with a delay
    const simulateAnalysis = () => {
      setLoading(true);
      
      setTimeout(() => {
        // Generate random signal for demo purposes
        const signals: Signal[] = ['HOLD', 'SELL', 'BUY'];
        const randomSignal = signals[Math.floor(Math.random() * signals.length)];
        setSignal(randomSignal);
        
        // Generate random confidence between 60-95%
        const randomConfidence = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
        setConfidence(randomConfidence);
        
        setLoading(false);
      }, 1500);
    };
    
    simulateAnalysis();
    
    // Update analysis every 5 minutes
    const intervalId = setInterval(simulateAnalysis, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  const getSignalDisplay = () => {
    if (loading) {
      return (
        <div className="h-20 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (signal) {
      case 'HOLD':
        return (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-3">
              <Lock size={30} className="text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-yellow-500">HOLD</h3>
          </div>
        );
      case 'SELL':
        return (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
              <TrendingDown size={30} className="text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-red-500">SELL</h3>
          </div>
        );
      case 'BUY':
        return (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
              <TrendingUp size={30} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-green-500">BUY</h3>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-3">
              <AlertTriangle size={30} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-muted-foreground">NO SIGNAL</h3>
          </div>
        );
    }
  };

  return (
    <Card className="glass-card h-full card-hover">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium text-center mb-6">AI Market Signal</h3>
        
        <div className="flex justify-center my-6">
          {getSignalDisplay()}
        </div>
        
        {!loading && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium">{confidence}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  signal === 'HOLD' ? 'bg-yellow-500' :
                  signal === 'SELL' ? 'bg-red-500' :
                  signal === 'BUY' ? 'bg-green-500' : 'bg-muted'
                }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Based on historical data analysis and current market trends
        </p>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Link to="/recommendations" className="w-full">
          <Button variant="outline" className="w-full">
            Get Detailed Analysis
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BitcoinAnalysis;
