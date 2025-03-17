
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BitcoinChart from "@/components/BitcoinChart";
import { Bitcoin, Globe, BarChart3, Clock } from "lucide-react";
import BitcoinPrice from "@/components/BitcoinPrice";
import BitcoinAnalysis from "@/components/BitcoinAnalysis";

const BitcoinInfo = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const stats = [
    { name: "Market Cap", value: "$1.23T", icon: <Globe size={20} /> },
    { name: "24h Volume", value: "$48.2B", icon: <BarChart3 size={20} /> },
    { name: "All-time High", value: "$69,000", icon: <Bitcoin size={20} /> },
    { name: "ATH Date", value: "Nov 10, 2021", icon: <Clock size={20} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Bitcoin Information</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive data and analysis for Bitcoin (BTC)
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <BitcoinPrice />
            <BitcoinAnalysis />
          </div>
          
          <div className="mb-8">
            <BitcoinChart />
          </div>
          
          <div className="mb-8">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="space-y-2 mb-6">
                  <h3 className="text-xl font-bold">Bitcoin Market Stats</h3>
                  <p className="text-muted-foreground">Key metrics and performance indicators</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="bg-muted/10 rounded-lg p-4 flex flex-col">
                      <div className="flex items-center mb-2">
                        <div className="mr-2 text-primary">{stat.icon}</div>
                        <span className="text-sm text-muted-foreground">{stat.name}</span>
                      </div>
                      <span className="text-xl font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-12">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">About Bitcoin</h3>
                  
                  <div className="text-muted-foreground space-y-4">
                    <p>
                      Bitcoin is the first decentralized cryptocurrency, introduced in 2009 by an anonymous entity known as Satoshi Nakamoto. 
                      Operating on a peer-to-peer network without central authority, Bitcoin uses blockchain technology to record all transactions 
                      in a public distributed ledger.
                    </p>
                    <p>
                      Unlike traditional currencies, Bitcoin has a finite supply capped at 21 million coins, making it deflationary by design. 
                      New bitcoins are created through a process called mining, where powerful computers solve complex mathematical problems 
                      to validate transactions and secure the network.
                    </p>
                    <p>
                      Over the years, Bitcoin has gained significant adoption as both a store of value and a medium of exchange. 
                      It's often referred to as "digital gold" due to its scarcity and potential hedge against inflation.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Key Features</h3>
                  
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs text-primary font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Decentralized</h4>
                        <p className="text-sm text-muted-foreground">No central authority or government control</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs text-primary font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Limited Supply</h4>
                        <p className="text-sm text-muted-foreground">Maximum supply capped at 21 million coins</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs text-primary font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Transparent</h4>
                        <p className="text-sm text-muted-foreground">All transactions recorded on a public blockchain</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <span className="text-xs text-primary font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Secure</h4>
                        <p className="text-sm text-muted-foreground">Protected by advanced cryptography</p>
                      </div>
                    </li>
                  </ul>
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
