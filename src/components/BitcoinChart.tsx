
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BitcoinChartProps {
  timeframe: string;
}

const BitcoinChart = ({ timeframe }: BitcoinChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call to get Bitcoin data based on timeframe
    setTimeout(() => {
      // Generate different data based on the timeframe
      const dataPoints = timeframe === "1d" ? 24 : 
                        timeframe === "1w" ? 7 : 
                        timeframe === "1m" ? 30 : 365;
      
      const startPrice = 54000;
      const volatility = timeframe === "1d" ? 500 : 
                        timeframe === "1w" ? 2000 : 
                        timeframe === "1m" ? 5000 : 20000;
      
      const newData = Array.from({ length: dataPoints }, (_, i) => {
        const ratio = i / dataPoints;
        // Create a somewhat realistic price movement with some randomness
        let price = startPrice;
        
        if (timeframe === "1d") {
          // More volatility for 1d
          price += Math.sin(ratio * Math.PI) * 2000 + (Math.random() - 0.5) * volatility;
        } else if (timeframe === "1w") {
          // Weekly trend
          price += Math.sin(ratio * Math.PI * 2) * 3000 + (Math.random() - 0.5) * volatility;
        } else if (timeframe === "1m") {
          // Monthly trend with multiple peaks
          price += Math.sin(ratio * Math.PI * 3) * 4000 + (Math.random() - 0.5) * volatility;
        } else {
          // Yearly trend with overall growth
          price += ratio * 15000 + Math.sin(ratio * Math.PI * 5) * 5000 + (Math.random() - 0.5) * volatility;
        }
        
        // Format the time label based on the timeframe
        let time;
        if (timeframe === "1d") {
          time = `${i}:00`;
        } else if (timeframe === "1w") {
          time = `Day ${i+1}`;
        } else if (timeframe === "1m") {
          time = `Week ${Math.floor(i/7) + 1}`;
        } else {
          time = `Month ${Math.floor(i/30) + 1}`;
        }
        
        return {
          time,
          price: Math.max(price, 30000), // Ensure price doesn't go below 30000
        };
      });
      
      setData(newData);
      setIsLoading(false);
    }, 800);
  }, [timeframe]);

  return (
    <div className="w-full h-80">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis 
              dataKey="time" 
              stroke="#888888" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              minTickGap={10}
            />
            <YAxis 
              stroke="#888888" 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(17, 24, 39, 0.8)', 
                border: 'none', 
                borderRadius: '0.5rem',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
              itemStyle={{ color: '#f7931a' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f7931a" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#f7931a" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default BitcoinChart;
