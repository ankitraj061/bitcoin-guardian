
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Bitcoin } from 'lucide-react';

interface BitcoinPriceData {
  current_price: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

const BitcoinPrice = () => {
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch Bitcoin price');
        }
        
        const data = await response.json();
        
        setPriceData({
          current_price: data.market_data.current_price.usd,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
          last_updated: data.market_data.last_updated
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Bitcoin price:', err);
        setError('Could not load Bitcoin price. Please try again later.');
        setLoading(false);
      }
    };

    fetchBitcoinPrice();

    // Refresh price every 60 seconds
    const intervalId = setInterval(fetchBitcoinPrice, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Card className="glass-card w-full animate-pulse">
        <CardContent className="p-6 flex items-center">
          <div className="w-full h-24 bg-muted/30 rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card w-full">
        <CardContent className="p-6">
          <div className="text-destructive flex items-center justify-center">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPriceUp = priceData?.price_change_percentage_24h && priceData.price_change_percentage_24h > 0;
  const formattedPrice = priceData?.current_price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  
  const lastUpdated = priceData?.last_updated 
    ? new Date(priceData.last_updated).toLocaleTimeString()
    : '';

  return (
    <Card className="glass-card w-full card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Bitcoin size={40} className="text-bitcoin mr-4 animate-pulse-slow" />
            <div>
              <h3 className="text-lg font-medium text-muted-foreground">Bitcoin Price</h3>
              <p className="text-3xl font-bold">{formattedPrice}</p>
            </div>
          </div>
          
          <div className={`flex items-center px-4 py-2 rounded-full ${
            isPriceUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
            {isPriceUp ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            <span className="ml-1 font-medium">
              {Math.abs(priceData?.price_change_percentage_24h || 0).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground text-right">
          Last updated: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
};

export default BitcoinPrice;
