import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Bitcoin, AlertCircle, DollarSign, Clock, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface BitcoinPriceData {
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  market_cap?: number;
  volume_24h?: number;
  last_updated: string;
  previous_price?: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  btcAmount: number;
  price: number;
  date: string;
}

interface WalletState {
  usdBalance: number;
  btcBalance: number;
  transactions: Transaction[];
}

const defaultWallet: WalletState = {
  usdBalance: 10000,
  btcBalance: 0.5,
  transactions: []
};

const BitcoinPrice = () => {
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState(0);
  const { toast } = useToast();
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Transaction state
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [sellDialogOpen, setSellDialogOpen] = useState(false);
  const [usdAmount, setUsdAmount] = useState('');
  const [btcAmount, setBtcAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [transactionTab, setTransactionTab] = useState<'usd' | 'btc'>('usd');
  const [wallet, setWallet] = useLocalStorage<WalletState>('bitcoin-wallet', defaultWallet);
  
  // Fetch Bitcoin price data from API with error handling
  const fetchBitcoinPrice = useCallback(async () => {
    try {
      setIsUpdating(true);
      
      // Use a free API key or public API endpoint with proper error handling
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
        { 
          headers: {
            'Accept': 'application/json'
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000)
        }
      );
      
      if (!response.ok) {
        let errorMessage = `API returned ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // Ignore JSON parsing errors and use default error message
        }
        throw new Error(errorMessage);
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
    updateIntervalRef.current = setInterval(() => {
      fetchBitcoinPrice();
    }, 5000);
    
    // Update "seconds since last update" counter every second
    timerIntervalRef.current = setInterval(() => {
      setTimeSinceUpdate(prev => prev + 1);
    }, 1000);
    
    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [fetchBitcoinPrice]);

  // Calculate BTC or USD amount when the other changes
  const calculateAmounts = useCallback((value: string, type: 'usd' | 'btc') => {
    if (!priceData) return;
    
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setBtcAmount('');
      setUsdAmount('');
      return;
    }
    
    if (type === 'usd') {
      setUsdAmount(value);
      setBtcAmount((numValue / priceData.current_price).toFixed(8));
    } else {
      setBtcAmount(value);
      setUsdAmount((numValue * priceData.current_price).toFixed(2));
    }
  }, [priceData]);

  // Handle Buy operation with TypeScript fixes
  const handleBuy = useCallback(() => {
    if (!priceData || !usdAmount || isNaN(parseFloat(usdAmount))) return;
    
    setIsProcessing(true);
    
    // Simulate processing with progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        const amount = parseFloat(usdAmount);
        const btcAmountValue = parseFloat(btcAmount);
        
        // Check if user has enough USD
        if (amount > wallet.usdBalance) {
          toast({
            variant: "destructive",
            title: "Insufficient funds",
            description: `Your balance ($${wallet.usdBalance.toFixed(2)}) is less than the purchase amount ($${amount.toFixed(2)}).`,
          });
          setIsProcessing(false);
          return;
        }
        
        // Process transaction
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: 'buy',
          amount,
          btcAmount: btcAmountValue,
          price: priceData.current_price,
          date: new Date().toISOString(),
        };
        
        // Update wallet
        setWallet({
          usdBalance: wallet.usdBalance - amount,
          btcBalance: wallet.btcBalance + btcAmountValue,
          transactions: [transaction, ...wallet.transactions]
        });
        
        toast({
          title: "Purchase Successful",
          description: `You bought ${btcAmountValue.toFixed(8)} BTC for $${amount.toFixed(2)}`,
        });
        
        setIsProcessing(false);
        setBuyDialogOpen(false);
        setUsdAmount('');
        setBtcAmount('');
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [usdAmount, btcAmount, priceData, wallet, toast, setWallet]);

  // Handle Sell operation with TypeScript fixes
  const handleSell = useCallback(() => {
    if (!priceData || !btcAmount || isNaN(parseFloat(btcAmount))) return;
    
    setIsProcessing(true);
    
    // Simulate processing with progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        const amount = parseFloat(usdAmount);
        const btcAmountToSell = parseFloat(btcAmount);
        
        // Check if user has enough BTC
        if (btcAmountToSell > wallet.btcBalance) {
          toast({
            variant: "destructive",
            title: "Insufficient Bitcoin",
            description: `Your balance (${wallet.btcBalance.toFixed(8)} BTC) is less than the sell amount (${btcAmountToSell.toFixed(8)} BTC).`,
          });
          setIsProcessing(false);
          return;
        }
        
        // Process transaction
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: 'sell',
          amount,
          btcAmount: btcAmountToSell,
          price: priceData.current_price,
          date: new Date().toISOString(),
        };
        
        // Update wallet
        setWallet({
          usdBalance: wallet.usdBalance + amount,
          btcBalance: wallet.btcBalance - btcAmountToSell,
          transactions: [transaction, ...wallet.transactions]
        });
        
        toast({
          title: "Sale Successful",
          description: `You sold ${btcAmountToSell.toFixed(8)} BTC for $${amount.toFixed(2)}`,
        });
        
        setIsProcessing(false);
        setSellDialogOpen(false);
        setUsdAmount('');
        setBtcAmount('');
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [usdAmount, btcAmount, priceData, wallet, toast, setWallet]);

  // Reset amounts when dialog opens
  useEffect(() => {
    if (buyDialogOpen || sellDialogOpen) {
      setUsdAmount('');
      setBtcAmount('');
      setTransactionTab('usd');
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, [buyDialogOpen, sellDialogOpen]);

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
    <>
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
            
            {/* Wallet Summary */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/5 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <Wallet size={12} className="text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Your Wallet</p>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium">${wallet.usdBalance.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">USD</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{wallet.btcBalance.toFixed(8)}</p>
                    <p className="text-xs text-muted-foreground">BTC</p>
                  </div>
                </div>
              </div>
              
              <div className={`h-2 w-2 rounded-full ${isUpdating ? 'bg-primary animate-ping' : 'bg-muted'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isUpdating ? 'Updating...' : 'Live data'}
              </span>
            </div>
          </div>
          
          {/* Trading Actions */}
          <div className="flex gap-3 mt-6 mb-6">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setBuyDialogOpen(true)}
            >
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Buy Bitcoin
            </Button>
            <Button 
              variant="outline"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-500/10"
              onClick={() => setSellDialogOpen(true)}
              disabled={wallet.btcBalance <= 0}
            >
              <ArrowDownRight className="h-4 w-4 mr-1" />
              Sell Bitcoin
            </Button>
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
      
      {/* Buy Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Buy Bitcoin</DialogTitle>
            <DialogDescription>
              Current price: {formattedPrice} per Bitcoin
            </DialogDescription>
          </DialogHeader>
          
          {isProcessing ? (
            <div className="py-6">
              <p className="text-center mb-4">Processing your purchase...</p>
              <Progress value={processingProgress} className="mb-2" />
              <p className="text-xs text-center text-muted-foreground">
                Please do not close this window
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">Your Balance</p>
                    <p className="text-muted-foreground">Available to spend</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${wallet.usdBalance.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{wallet.btcBalance.toFixed(8)} BTC</p>
                  </div>
                </div>
                
                <Tabs value={transactionTab} onValueChange={(v) => setTransactionTab(v as 'usd' | 'btc')}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="usd">Spend USD</TabsTrigger>
                    <TabsTrigger value="btc">Buy BTC Amount</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="usd" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="usd-amount">USD Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="usd-amount" 
                          placeholder="Enter USD amount" 
                          value={usdAmount}
                          onChange={(e) => calculateAmounts(e.target.value, 'usd')}
                          className="pl-10"
                          type="number"
                          min={0}
                          max={wallet.usdBalance}
                          step="0.01"
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Min: $1.00</span>
                        <span>Max: ${wallet.usdBalance.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="btc-amount">BTC You'll Receive</Label>
                      <div className="relative">
                        <Bitcoin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="btc-amount" 
                          value={btcAmount}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="btc" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="btc-amount">BTC Amount</Label>
                      <div className="relative">
                        <Bitcoin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="btc-amount" 
                          placeholder="Enter BTC amount" 
                          value={btcAmount}
                          onChange={(e) => calculateAmounts(e.target.value, 'btc')}
                          className="pl-10"
                          type="number"
                          min={0}
                          step="0.00000001"
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Min: 0.00000001 BTC</span>
                        <span>Max: {(wallet.usdBalance / (priceData?.current_price || 1)).toFixed(8)} BTC</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="usd-amount">USD Cost</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="usd-amount" 
                          value={usdAmount}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Transaction Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span>Total</span>
                    <span>${usdAmount ? parseFloat(usdAmount).toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleBuy}
                  disabled={!usdAmount || parseFloat(usdAmount) <= 0 || parseFloat(usdAmount) > wallet.usdBalance}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Buy Bitcoin
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Sell Dialog */}
      <Dialog open={sellDialogOpen} onOpenChange={setSellDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sell Bitcoin</DialogTitle>
            <DialogDescription>
              Current price: {formattedPrice} per Bitcoin
            </DialogDescription>
          </DialogHeader>
          
          {isProcessing ? (
            <div className="py-6">
              <p className="text-center mb-4">Processing your sale...</p>
              <Progress value={processingProgress} className="mb-2" />
              <p className="text-xs text-center text-muted-foreground">
                Please do not close this window
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">Your Balance</p>
                    <p className="text-muted-foreground">Available to sell</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{wallet.btcBalance.toFixed(8)} BTC</p>
                    <p className="text-xs text-muted-foreground">${wallet.usdBalance.toFixed(2)} USD</p>
                  </div>
                </div>
                
                <Tabs value={transactionTab} onValueChange={(v) => setTransactionTab(v as 'usd' | 'btc')}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="btc">Sell BTC Amount</TabsTrigger>
                    <TabsTrigger value="usd">Receive USD</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="btc" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="btc-amount">BTC to Sell</Label>
                      <div className="relative">
                        <Bitcoin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="btc-amount" 
                          placeholder="Enter BTC amount" 
                          value={btcAmount}
                          onChange={(e) => calculateAmounts(e.target.value, 'btc')}
                          className="pl-10"
                          type="number"
                          min={0}
                          max={wallet.btcBalance}
                          step="0.00000001"
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Min: 0.00000001 BTC</span>
                        <span>Max: {wallet.btcBalance.toFixed(8)} BTC</span>
                      </div>
                      
                      <div className="bg-blue-500/10 text-blue-500 p-2 rounded-md text-xs">
                        You can sell up to {(wallet.btcBalance * 100).toFixed(2)}% of your BTC holdings
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="usd-amount">USD You'll Receive</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="usd-amount" 
                          value={usdAmount}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="usd" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="usd-amount">USD to Receive</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="usd-amount" 
                          placeholder="Enter USD amount" 
                          value={usdAmount}
                          onChange={(e) => calculateAmounts(e.target.value, 'usd')}
                          className="pl-10"
                          type="number"
                          min={0}
                          step="0.01"
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Min: $1.00</span>
                        <span>Max: ${(wallet.btcBalance * priceData.current_price).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="btc-amount">BTC You'll Sell</Label>
                      <div className="relative">
                        <Bitcoin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="btc-amount" 
                          value={btcAmount}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Transaction Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span>Total USD to Receive</span>
                    <span>${usdAmount ? parseFloat(usdAmount).toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSellDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleSell}
                  disabled={!btcAmount || parseFloat(btcAmount) <= 0 || parseFloat(btcAmount) > wallet.btcBalance}
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                  variant="outline"
                >
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  Sell Bitcoin
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BitcoinPrice;