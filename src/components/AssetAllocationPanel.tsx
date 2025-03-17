
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Bitcoin, DollarSign, Landmark } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssetAllocation {
  name: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

const AssetAllocationPanel = () => {
  const [allocation, setAllocation] = useState<AssetAllocation[]>([
    { 
      name: "Bitcoin", 
      value: 40, 
      color: "#F7931A",
      icon: <Bitcoin size={16} />
    },
    { 
      name: "Cash", 
      value: 30, 
      color: "#66BB6A",
      icon: <DollarSign size={16} />
    },
    { 
      name: "Traditional Assets", 
      value: 30, 
      color: "#42A5F5",
      icon: <Landmark size={16} />
    }
  ]);

  const updateAllocation = (index: number, newValue: number) => {
    // Ensure total allocation remains 100%
    const newAllocation = [...allocation];
    const oldValue = newAllocation[index].value;
    const difference = newValue - oldValue;
    
    if (difference === 0) return;
    
    // Distribute the difference proportionally among other allocations
    const othersTotal = 100 - oldValue;
    const othersIndices = allocation.map((_, i) => i).filter(i => i !== index);
    
    newAllocation[index].value = newValue;
    
    othersIndices.forEach(i => {
      const proportion = newAllocation[i].value / othersTotal;
      newAllocation[i].value = Math.max(0, newAllocation[i].value - difference * proportion);
    });
    
    // Round values and ensure they sum to 100
    let sum = 0;
    newAllocation.forEach(item => {
      item.value = Math.round(item.value);
      sum += item.value;
    });
    
    // Adjust the last item if needed to ensure sum is 100
    if (sum !== 100) {
      const lastNonZero = newAllocation.map((item, i) => ({ value: item.value, index: i }))
        .filter(item => item.index !== index && item.value > 0)
        .pop();
      
      if (lastNonZero) {
        newAllocation[lastNonZero.index].value += (100 - sum);
      } else {
        newAllocation[index].value += (100 - sum);
      }
    }
    
    setAllocation(newAllocation);
  };

  const optimizeAllocation = () => {
    // Simulate AI optimization - in reality this would use market data and risk profile
    const optimized = [
      { 
        name: "Bitcoin", 
        value: 25, 
        color: "#F7931A",
        icon: <Bitcoin size={16} />
      },
      { 
        name: "Cash", 
        value: 45, 
        color: "#66BB6A",
        icon: <DollarSign size={16} />
      },
      { 
        name: "Traditional Assets", 
        value: 30, 
        color: "#42A5F5",
        icon: <Landmark size={16} />
      }
    ];
    
    setAllocation(optimized);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="glass-card w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Asset Allocation</h3>
          <Button onClick={optimizeAllocation} variant="outline" size="sm">
            Optimize with AI
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Adjust your asset allocation using the sliders. Our AI can recommend an optimal allocation based on current market conditions and your risk tolerance.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {allocation.map((asset, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="mr-2 text-primary">{asset.icon}</div>
                    <span>{asset.name}</span>
                  </div>
                  <span className="font-medium">{asset.value}%</span>
                </div>
                <Slider
                  value={[asset.value]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => updateAllocation(index, value[0])}
                />
              </div>
            ))}
            
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
              Apply Allocation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetAllocationPanel;
