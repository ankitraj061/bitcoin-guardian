
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BitcoinChart from "@/components/BitcoinChart";
import RiskAssessment from "@/components/RiskAssessment";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InterestRates from "@/components/InterestRates";

const BitcoinInfo = () => {
  const [timeframe, setTimeframe] = useState("1d");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-10 mt-10">
          <h1 className="text-4xl font-bold mb-4">Bitcoin Analysis</h1>
          <p className="text-muted-foreground">
            Real-time analysis and insights to help you make informed Bitcoin investment decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="glass-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Price Chart</h2>
                  <div className="flex space-x-2">
                    <Tabs value={timeframe} onValueChange={setTimeframe}>
                      <TabsList>
                        <TabsTrigger value="1d">1D</TabsTrigger>
                        <TabsTrigger value="1w">1W</TabsTrigger>
                        <TabsTrigger value="1m">1M</TabsTrigger>
                        <TabsTrigger value="1y">1Y</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                <BitcoinChart timeframe={timeframe} />
              </CardContent>
            </Card>
            
            <Card className="glass-card mt-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Interest Rates</h3>
                <InterestRates />
              </CardContent>
            </Card>
          </div>

          <div>
            <RiskAssessment />
            <Card className="glass-card mt-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Market Sentiment</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Fear & Greed Index</span>
                      <span className="text-sm font-medium text-amber-500">65 - Greed</span>
                    </div>
                    <div className="w-full bg-muted/30 h-2 rounded-full">
                      <div className="bg-amber-500 w-[65%] h-full rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Bullish Sentiment</span>
                      <span className="text-sm font-medium text-green-500">72%</span>
                    </div>
                    <div className="w-full bg-muted/30 h-2 rounded-full">
                      <div className="bg-green-500 w-[72%] h-full rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Bearish Sentiment</span>
                      <span className="text-sm font-medium text-red-500">28%</span>
                    </div>
                    <div className="w-full bg-muted/30 h-2 rounded-full">
                      <div className="bg-red-500 w-[28%] h-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BitcoinInfo;
