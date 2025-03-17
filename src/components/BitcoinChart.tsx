
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TimeFrame = '1D' | '1W' | '1M' | '1Y';

interface PriceData {
  timestamp: number;
  price: number;
}

const BitcoinChart = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1W');
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      
      try {
        let days = 1;
        switch (timeFrame) {
          case '1D':
            days = 1;
            break;
          case '1W':
            days = 7;
            break;
          case '1M':
            days = 30;
            break;
          case '1Y':
            days = 365;
            break;
        }
        
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }
        
        const data = await response.json();
        
        // Format data for the chart
        const formattedData = data.prices.map((item: [number, number]) => ({
          timestamp: item[0],
          price: item[1]
        }));
        
        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching price data:', err);
        setError('Could not load price data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPriceData();
  }, [timeFrame]);

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    
    switch (timeFrame) {
      case '1D':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '1W':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '1M':
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      case '1Y':
        return date.toLocaleDateString([], { month: 'short' });
      default:
        return '';
    }
  };

  const formatYAxis = (price: number) => {
    return `$${price.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  const formatTooltip = (value: number) => {
    return [`$${value.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`, 'Price'];
  };

  const timeFrameButtons: TimeFrame[] = ['1D', '1W', '1M', '1Y'];

  if (error) {
    return (
      <Card className="glass-card w-full">
        <CardContent className="p-6">
          <div className="text-destructive flex items-center justify-center h-64">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Bitcoin Price Chart</h3>
          
          <div className="flex space-x-2">
            {timeFrameButtons.map((tf) => (
              <Button
                key={tf}
                variant={timeFrame === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFrame(tf)}
                className={timeFrame === tf ? "bg-primary" : ""}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-[400px] w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatXAxis} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--muted))"
                />
                <YAxis 
                  tickFormatter={formatYAxis} 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--muted))"
                  width={80}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BitcoinChart;
