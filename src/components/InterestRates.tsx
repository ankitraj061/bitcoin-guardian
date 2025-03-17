
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type ProviderData = {
  id: string;
  name: string;
  apy: number;
  terms: string;
  bgClass: string;
  iconBgClass: string;
  iconTextClass: string;
  iconText: string;
  description: string;
};

const InterestRates = () => {
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [loading, setLoading] = useState(true);

  const generateRandomRates = () => {
    const baseProviders: ProviderData[] = [
      {
        id: "blockfi",
        name: "BlockFi",
        apy: 4.5 + (Math.random() * 0.5 - 0.25),
        terms: "Flexible terms",
        bgClass: "bg-blue-500/20",
        iconBgClass: "bg-blue-500/30",
        iconTextClass: "text-blue-500",
        iconText: "BF",
        description: "BlockFi offers flexible interest accounts with no minimum deposit"
      },
      {
        id: "celsius",
        name: "Celsius",
        apy: 5.8 + (Math.random() * 0.6 - 0.3),
        terms: "3-month lock",
        bgClass: "bg-green-500/20",
        iconBgClass: "bg-green-500/30",
        iconTextClass: "text-green-500",
        iconText: "CE",
        description: "Celsius requires a 3-month lock period but offers higher returns"
      },
      {
        id: "nexo",
        name: "Nexo",
        apy: 6.2 + (Math.random() * 0.7 - 0.35),
        terms: "6-month lock",
        bgClass: "bg-purple-500/20",
        iconBgClass: "bg-purple-500/30",
        iconTextClass: "text-purple-500",
        iconText: "NX",
        description: "Nexo provides the highest rates with a 6-month minimum commitment"
      },
      {
        id: "bitguardian",
        name: "BitGuardian Smart Yield",
        apy: 7.5 + (Math.random() * 0.8 - 0.4),
        terms: "AI-optimized allocation",
        bgClass: "bg-gradient-to-r from-primary/20 to-yellow-400/20",
        iconBgClass: "bg-primary/30",
        iconTextClass: "text-primary",
        iconText: "BG",
        description: "Our AI-optimized allocation continuously rebalances for maximum yield"
      },
      {
        id: "coinbase",
        name: "Coinbase",
        apy: 4.0 + (Math.random() * 0.5 - 0.25),
        terms: "Flexible terms",
        bgClass: "bg-cyan-500/20",
        iconBgClass: "bg-cyan-500/30",
        iconTextClass: "text-cyan-500",
        iconText: "CB",
        description: "Coinbase offers secure and insured interest accounts with no lock-up period"
      },
    ];

    // Sort by APY in descending order
    return baseProviders.sort((a, b) => b.apy - a.apy);
  };

  useEffect(() => {
    // Initial data load
    setProviders(generateRandomRates());
    setLoading(false);

    // Update every 15 seconds
    const intervalId = setInterval(() => {
      setProviders(generateRandomRates());
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          Updated in real-time (every 15 seconds)
        </div>
        <div className="text-xs px-2 py-1 bg-primary/20 rounded-full text-primary font-medium">
          Auto-sorted by highest APY
        </div>
      </div>

      {providers.map((provider) => (
        <div 
          key={provider.id}
          className={`flex justify-between items-center p-4 ${provider.bgClass} rounded-lg border border-muted transition-all duration-300 hover:shadow-md`}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center mr-3">
              <div className={`w-6 h-6 rounded-full ${provider.iconBgClass} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${provider.iconTextClass}`}>{provider.iconText}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{provider.name}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="ml-1">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">{provider.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground">{provider.terms}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{provider.apy.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">APY</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InterestRates;
