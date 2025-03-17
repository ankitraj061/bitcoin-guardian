import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Bitcoin, AlertCircle, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface BitcoinPriceData {
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  market_cap?: number;
  volume_24h?: number;
  last_updated: string;
  previous_price?: number;
}

const BitcoinPrice = () => {
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  const { toast } = useToast();
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Fetch Bitcoin price data from API
  const fetchBitcoinPrice = useCallback(async () => {
    try {
      setIsUpdating(true);
      
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      setPriceData(prevData => {
        // Store previous price for animation effect
        const previousPrice = prevData?.current_price;
        
        const newData = {
          current_price: data.market_data.current_price.usd,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
          price_change_percentage_7d: data.market_data.price_change_percentage_7d,
          market_cap: data.market_data.market_cap.usd,
          volume_24h: data.market_data.total_volume.usd,
          last_updated: data.market_data.last_updated,
          previous_price: previousPrice
        };

        // Show toast only if price changed significantly and not first load
        if (previousPrice && Math.abs((newData.current_price - previousPrice) / previousPrice) > 0.005) {
          const priceUp = newData.current_price > previousPrice;
          toast({
            title: priceUp ? "Bitcoin Price Up" : "Bitcoin Price Down",
            description: `Price ${priceUp ? 'increased' : 'decreased'} to ${newData.current_price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD'
            })}`,
            variant: priceUp ? "default" : "destructive",
            duration: 1000,
          });
        }
        
        return newData;
      });
      
      setLoading(false);
      setError(null);
      setTimeSinceUpdate(0);
      
    } catch (err) {
      console.error('Error fetching Bitcoin price:', err);
      const errorMessage = err instanceof Error ? err.message : 'Could not load Bitcoin price';
      setError(`Could not load Bitcoin price. ${errorMessage}`);
      setLoading(false);
      
      toast({
        variant: "destructive",
        title: "Error updating price",
        description: "Connection failed. Will retry automatically.",
        duration: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  }, [toast]);
  
  // Setup real-time updates and countdown timer
  useEffect(() => {
    fetchBitcoinPrice();

    // Real-time update timer - 15s interval for fresh data
    updateIntervalRef.current = setInterval(fetchBitcoinPrice, 6000);
    
    // Update "seconds since last update" counter every second
    timerIntervalRef.current = setInterval(() => {
      setTimeSinceUpdate(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [fetchBitcoinPrice]);

  if (loading) {
    return (
      <Card className="glass-card w-full border-primary/10 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-8 w-40" />
              </div>
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card w-full border-destructive/50 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center py-6">
            <AlertCircle size={32} className="text-destructive mb-4" />
            <p className="text-destructive font-medium mb-2">Unable to load Bitcoin price</p>
            <p className="text-muted-foreground text-sm mb-4">
              {error} <br/><span className="text-xs">Retrying automatically...</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPriceUp = priceData?.price_change_percentage_24h && priceData.price_change_percentage_24h > 0;
  const isPriceChanged = priceData?.previous_price !== undefined;
  const isPriceHigher = isPriceChanged && priceData?.current_price > (priceData?.previous_price || 0);
  
  const formattedPrice = priceData?.current_price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  
  const lastUpdated = priceData?.last_updated 
    ? new Date(priceData.last_updated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})
    : '';

  return (
    <Card className={`
      glass-card w-full border-primary/10 shadow-md overflow-hidden transition-all
      ${isUpdating ? 'border-primary/30 shadow-lg' : ''}
      ${isPriceChanged && isPriceHigher ? 'animate-pulse-success' : ''}
      ${isPriceChanged && !isPriceHigher ? 'animate-pulse-danger' : ''}
    `}>
      <CardHeader className="px-6 py-4 bg-primary/5 border-b border-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-bitcoin p-2 rounded-full">
              <Bitcoin size={20} className="text-background" />
            </div>
            <CardTitle className="text-lg">Real-time Bitcoin Price</CardTitle>
          </div>
          <Badge variant="outline" className={`
            flex items-center gap-1
            ${timeSinceUpdate < 5 ? 'bg-green-500/10 text-green-500' : ''}
            ${timeSinceUpdate >= 5 && timeSinceUpdate < 30 ? 'bg-amber-500/10 text-amber-500' : ''}
            ${timeSinceUpdate >= 30 ? 'bg-red-500/10 text-red-500' : ''}
          `}>
            <Clock size={12} />
            {timeSinceUpdate < 60 
              ? `Updated ${timeSinceUpdate}s ago`
              : `Updated ${Math.floor(timeSinceUpdate/60)}m ${timeSinceUpdate%60}s ago`
            }
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-3 mb-1">
              <p className={`text-4xl font-bold transition-colors ${isUpdating ? 'text-primary' : ''}`}>
                {formattedPrice}
              </p>
              <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
                isPriceUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {isPriceUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1 font-medium">
                  {Math.abs(priceData?.price_change_percentage_24h || 0).toFixed(2)}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">24-hour change</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isUpdating ? 'bg-primary animate-ping' : 'bg-muted'}`}></div>
            <span className="text-xs text-muted-foreground">
              {isUpdating ? 'Updating...' : 'Live data'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">7D Change</p>
              <TrendingUp size={14} className="text-muted-foreground" />
            </div>
            <div className={`flex items-center ${
              (priceData?.price_change_percentage_7d || 0) > 0 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {(priceData?.price_change_percentage_7d || 0) > 0 
                ? <ArrowUp size={14} className="mr-1" /> 
                : <ArrowDown size={14} className="mr-1" />
              }
              <span className="font-medium">
                {Math.abs(priceData?.price_change_percentage_7d || 0).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">Market Cap</p>
              <DollarSign size={14} className="text-muted-foreground" />
            </div>
            <div className="font-medium">
              {priceData?.market_cap 
                ? (priceData.market_cap / 1000000000).toFixed(2) + "B"
                : "N/A"}
            </div>
          </div>
          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">24h Volume</p>
              <Bitcoin size={14} className="text-muted-foreground" />
            </div>
            <div className="font-medium">
              {priceData?.volume_24h
                ? (priceData.volume_24h / 1000000000).toFixed(2) + "B"
                : "N/A"}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-3 bg-muted/20 border-t border-primary/5 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">CoinGecko API</span>
        <span className="text-xs text-muted-foreground">Last updated: {lastUpdated}</span>
      </CardFooter>
    </Card>
  );
};

export default BitcoinPrice;