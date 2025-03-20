import React, { useState } from 'react';
import { Check, X, HelpCircle, ShieldCheck, Lock, Bitcoin, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BitcoinChart from '@/components/BitcoinChart';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedTier, setSelectedTier] = useState<string>('pro');
  
  // Calculate savings
  const monthlyCost = {
    basic: 0,
    pro: 29,
    enterprise: 99
  };
  const yearlyCost = {
    basic: 0,
    pro: 24.92, // ~14% discount on yearly
    enterprise: 83.25 // ~16% discount on yearly
  };

  // Calculate BTC locking requirements
  const btcLockRequirements = {
    basic: 0,
    pro: 0.01,
    enterprise: 0.05
  };

  const taxSavingEstimates = {
    basic: "0%",
    pro: "Up to 10%",
    enterprise: "Up to 20%"
  };

  // Feature comparison table
  const featureComparison = [
    {
      category: 'Core Features',
      features: [
        {
          name: 'Real-time Price Alerts',
          description: 'Receive notifications when Bitcoin reaches your target prices',
          basic: true,
          pro: true,
          enterprise: true
        },
        {
          name: 'Portfolio Tracking',
          description: 'Track your Bitcoin holdings and performance',
          basic: true,
          pro: true,
          enterprise: true
        },
        {
          name: 'Market Reports',
          description: 'Basic market analysis and reports',
          basic: true,
          pro: true,
          enterprise: true
        },
        {
          name: 'Auto-refresh Data',
          description: 'How often data refreshes automatically',
          basic: '5 minutes',
          pro: '1 minute',
          enterprise: '30 seconds'
        }
      ]
    },
    {
      category: 'AI Analysis',
      features: [
        {
          name: 'AI Predictions',
          description: 'Price prediction using machine learning',
          basic: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Trading Signals',
          description: 'Buy/sell recommendations based on technical analysis',
          basic: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Risk Assessment',
          description: 'Risk analysis of your portfolio',
          basic: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Custom AI Strategies',
          description: 'Create and test custom trading strategies',
          basic: false,
          pro: false,
          enterprise: true
        }
      ]
    },
    {
      category: 'Security',
      features: [
        {
          name: 'Wallet Monitoring',
          description: 'Monitor wallet transactions and balances',
          basic: 'Limited',
          pro: 'Full',
          enterprise: 'Advanced'
        },
        {
          name: 'Fraud Detection',
          description: 'AI-powered detection of suspicious transactions',
          basic: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Security Audit',
          description: 'Regular audit of your security settings',
          basic: false,
          pro: false,
          enterprise: true
        }
      ]
    },
    {
      category: 'Tax & Reporting',
      features: [
        {
          name: 'Transaction History',
          description: 'Detailed history of all transactions',
          basic: '3 months',
          pro: '2 years',
          enterprise: 'Unlimited'
        },
        {
          name: 'Tax Reporting',
          description: 'Generate tax reports for crypto transactions',
          basic: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Tax Optimization',
          description: 'AI suggestions for tax-efficient trading',
          basic: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'API Access',
          description: 'Access raw data via API',
          basic: false,
          pro: '100 calls/day',
          enterprise: 'Unlimited'
        }
      ]
    },
    {
      category: 'Support',
      features: [
        {
          name: 'Customer Support',
          description: 'Access to customer support',
          basic: 'Email only',
          pro: 'Email & Chat',
          enterprise: 'Priority Support'
        },
        {
          name: 'Response Time',
          description: 'Average time to first response',
          basic: '48 hours',
          pro: '24 hours',
          enterprise: '4 hours'
        },
        {
          name: 'Dedicated Manager',
          description: 'Personal account manager',
          basic: false,
          pro: false,
          enterprise: true
        }
      ]
    }
  ];

  // FAQ for tax and locking period information
  const faqItems = [
    {
      question: "What is Bitcoin locking?",
      answer: "Bitcoin locking is a feature that allows you to voluntarily lock a portion of your Bitcoin holdings for a specified period of time. This demonstrates your commitment to the platform and provides additional security. In return, you receive premium features and potential tax benefits."
    },
    {
      question: "How does the locking period work?",
      answer: "When you subscribe to Pro or Enterprise plans, you have the option to lock a small amount of Bitcoin (0.01 BTC for Pro, 0.05 BTC for Enterprise) for a period of 3, 6, or 12 months. Longer lock periods provide greater subscription discounts. During this time, your Bitcoin remains your property but cannot be transferred or sold until the lock period expires."
    },
    {
      question: "Is locking Bitcoin mandatory for premium features?",
      answer: "No, Bitcoin locking is entirely optional. You can choose to pay the full subscription price without locking any Bitcoin. However, locking Bitcoin provides you with subscription discounts and potential tax advantages."
    },
    {
      question: "What are the tax benefits of using BitGuardian?",
      answer: "BitGuardian provides several tax advantages: 1) Automated tax reporting that categorizes transactions correctly, 2) Loss harvesting alerts to optimize tax positions, 3) Long-term vs short-term gain analysis, and 4) Tax-efficient trading recommendations. Enterprise users receive advanced tax optimization strategies."
    },
    {
      question: "How can I qualify for tax deductions with BitGuardian?",
      answer: "BitGuardian's subscription may be tax-deductible as an investment expense in many jurisdictions if you use it primarily for managing your cryptocurrency investments. The Enterprise plan offers detailed documentation specifically designed for tax filing purposes. Always consult with a tax professional about your specific situation."
    },
    {
      question: "Is my locked Bitcoin insured?",
      answer: "Yes, all locked Bitcoin is insured against theft or platform security breaches up to the full amount of your locked assets. This insurance is provided through our partnership with a leading digital asset insurance provider."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-background z-0 opacity-90"></div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">Pricing Plans</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Choose the Right Protection for Your Bitcoin
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Advanced AI protection and insights to secure your Bitcoin investments, with flexible plans for every investor.
              </p>
              
              <div className="flex items-center justify-center mb-12">
                <div className="flex items-center p-1 rounded-full border border-muted bg-card/40 backdrop-blur-sm shadow-sm">
                  <button 
                    className={`px-5 py-2 rounded-full text-sm ${billingCycle === 'monthly' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setBillingCycle('monthly')}
                  >
                    Monthly Billing
                  </button>
                  <button 
                    className={`px-5 py-2 rounded-full text-sm ${billingCycle === 'yearly' ? 'bg-primary text-white' : ''}`}
                    onClick={() => setBillingCycle('yearly')}
                  >
                    Yearly Billing 
                    <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                      Save up to 16%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Background Bitcoin Chart */}
          <div className="absolute inset-x-0 top-0 -z-10 opacity-10 h-full w-full overflow-hidden">
            <BitcoinChart timeframe="1y" />
          </div>
        </section>
        
        {/* Pricing Cards Section */}
        <section className="py-10 container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <Card className={`border ${selectedTier === 'basic' ? 'border-primary' : 'border-border'} relative overflow-hidden`}>
              {selectedTier === 'basic' && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"></div>
              )}
              <CardHeader>
                <CardTitle>Basic</CardTitle>
                <CardDescription>Essential Bitcoin security and tracking</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-muted-foreground ml-2">forever</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Real-time Price Updates</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Basic Portfolio Tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Simple Price Alerts</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Market News</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <X className="h-4 w-4 mr-2" />
                    <span>AI Predictions</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <X className="h-4 w-4 mr-2" />
                    <span>Trading Signals</span>
                  </div>
                </div>
                
                <div className="pt-4 pb-2">
                  <div className="flex items-center text-sm">
                    <Bitcoin className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">BTC Lock Required: </span>
                    <span className="ml-1 font-medium">None</span>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Tax Savings: </span>
                    <span className="ml-1 font-medium">{taxSavingEstimates.basic}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={selectedTier === 'basic' ? 'default' : 'outline'}
                  onClick={() => setSelectedTier('basic')}
                >
                  {selectedTier === 'basic' ? 'Current Selection' : 'Select Free Plan'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Pro Tier */}
            <Card className={`border ${selectedTier === 'pro' ? 'border-primary' : 'border-border'} relative overflow-hidden`}>
              {selectedTier === 'pro' && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"></div>
              )}
              <div className="absolute top-0 right-0">
                <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Advanced AI analysis and protection</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly' ? monthlyCost.pro : yearlyCost.pro}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    / {billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                  </span>
                  {billingCycle === 'yearly' && (
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                      Save 14%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Everything in Free</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>AI Price Predictions</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Trading Signals & Alerts</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Fraud Detection</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Tax Reporting</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <X className="h-4 w-4 mr-2" />
                    <span>Custom AI Strategies</span>
                  </div>
                </div>
                
                <div className="pt-4 pb-2">
                  <div className="flex items-center text-sm">
                    <Bitcoin className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Optional BTC Lock: </span>
                    <span className="ml-1 font-medium">0.01 BTC</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Lock 0.01 BTC for 3-12 months to get up to 25% off your subscription.
                            Your Bitcoin remains yours and is fully insured.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Tax Savings: </span>
                    <span className="ml-1 font-medium">{taxSavingEstimates.pro}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={selectedTier === 'pro' ? 'default' : 'outline'}
                  onClick={() => setSelectedTier('pro')}
                >
                  {selectedTier === 'pro' ? 'Current Selection' : 'Select Pro Plan'}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Enterprise Tier */}
            <Card className={`border ${selectedTier === 'enterprise' ? 'border-primary' : 'border-border'} relative overflow-hidden bg-card/60`}>
              {selectedTier === 'enterprise' && (
                <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"></div>
              )}
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>Premium protection and personalization</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    ${billingCycle === 'monthly' ? monthlyCost.enterprise : yearlyCost.enterprise}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    / {billingCycle === 'monthly' ? 'month' : 'month, billed annually'}
                  </span>
                  {billingCycle === 'yearly' && (
                    <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
                      Save 16%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Everything in Pro</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Custom AI Strategies</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Advanced Tax Optimization</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Unlimited API Access</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>Dedicated Account Manager</span>
                  </div>
                </div>
                
                <div className="pt-4 pb-2">
                  <div className="flex items-center text-sm">
                    <Bitcoin className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Optional BTC Lock: </span>
                    <span className="ml-1 font-medium">0.05 BTC</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 ml-1 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Lock 0.05 BTC for 3-12 months to get up to 30% off your subscription.
                            Your Bitcoin remains yours and is fully insured.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-muted-foreground">Tax Savings: </span>
                    <span className="ml-1 font-medium">{taxSavingEstimates.enterprise}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={selectedTier === 'enterprise' ? 'default' : 'outline'}
                  onClick={() => setSelectedTier('enterprise')}
                >
                  {selectedTier === 'enterprise' ? 'Current Selection' : 'Select Enterprise Plan'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              All plans include a 14-day money-back guarantee. No questions asked.
            </p>
          </div>
        </section>
        
        {/* Bitcoin Locking Information */}
        <section className="py-16 bg-card/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Bitcoin Locking Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Lock a small amount of Bitcoin to get premium features and significant subscription discounts. Your Bitcoin remains your property and is fully insured.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border border-border/50 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    Choose a Lock Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Select how long you'd like to lock your Bitcoin: 3, 6, or 12 months. Longer periods provide greater discounts on your subscription.
                  </p>
                  <div className="space-y-3 mt-6">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                      <span>3 Months</span>
                      <Badge variant="outline">10% Discount</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                      <span>6 Months</span>
                      <Badge variant="outline">20% Discount</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                      <span className="font-medium">12 Months</span>
                      <Badge variant="outline" className="bg-primary/20">30% Discount</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border/50 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Bitcoin className="h-5 w-5 text-primary" />
                    </div>
                    Lock Your Bitcoin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Lock a small amount of Bitcoin in our secure multi-signature vault. Your Bitcoin remains your property but cannot be transferred until the lock period ends.
                  </p>
                  <div className="space-y-3 mt-6">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                      <span>Basic Plan</span>
                      <span>No lock required</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5">
                      <span>Pro Plan</span>
                      <span>0.01 BTC</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10">
                      <span className="font-medium">Enterprise Plan</span>
                      <span>0.05 BTC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border/50 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    Secure and Insured
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Your locked Bitcoin is secured by institutional-grade cold storage and fully insured against theft or security breaches up to 100% of its value.
                  </p>
                  <div className="space-y-4 mt-6">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Multi-signature security with hardware-enforced keys</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>100% insurance coverage against theft and security breaches</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Automatic return of Bitcoin at the end of lock period</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Tax Benefits Section */}
        <section className="py-16 container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tax Benefits & Reporting</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              BitGuardian helps you optimize your tax position and simplify reporting for cryptocurrency investments.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4 mt-1">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Automatic Tax Reporting</h3>
                  <p className="text-muted-foreground">
                    Generate accurate tax reports for all cryptocurrency transactions. Our system automatically categorizes transactions and calculates gains/losses using FIFO, LIFO, or average cost methods.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4 mt-1">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Loss Harvesting Alerts</h3>
                  <p className="text-muted-foreground">
                    Receive notifications about opportunities to harvest losses and optimize your tax position. Our AI identifies the perfect timing to realize losses while maintaining your investment strategy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-4 mt-1">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Tax-Efficient Trading</h3>
                  <p className="text-muted-foreground">
                    Get AI recommendations for tax-efficient trading strategies that minimize your tax liability while maximizing returns. Enterprise users receive personalized tax optimization plans.
                  </p>
                </div>
              </div>
            </div>
            
            <Card className="bg-card/60 border border-border/50">
              <CardHeader>
                <CardTitle>Tax Savings Comparison</CardTitle>
                <CardDescription>
                  Estimated annual tax savings based on plan features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Basic Plan</span>
                      <Badge variant="outline" className="bg-transparent">
                        {taxSavingEstimates.basic}
                      </Badge>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full">
                      <div className="h-full bg-muted rounded-full" style={{width: '0%'}}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Basic reporting, no optimization features
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Pro Plan</span>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {taxSavingEstimates.pro}
                      </Badge>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full">
                      <div className="h-full bg-primary/60 rounded-full" style={{width: '50%'}}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tax reporting, loss harvesting, holding period optimization
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Enterprise Plan</span>
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20">
                        {taxSavingEstimates.enterprise}
                      </Badge>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{width: '100%'}}></div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Advanced tax strategies, personalized optimization, custom reporting
                    </p>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-muted/40 rounded-lg">
                  <h4 className="font-medium mb-2">Example Scenario</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    An investor with $50,000 in Bitcoin trading activity could save:
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className="flex justify-between">
                      <span>Basic Plan:</span>
                      <span>$0</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Pro Plan:</span>
                      <span>~$500-1,000</span>
                    </li>
                    <li className="flex justify-between font-medium">
                      <span>Enterprise Plan:</span>
                      <span>~$2,000-3,000</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    *Actual savings vary based on individual circumstances, trading volume, and jurisdiction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Feature Comparison Table */}
        <section className="py-16 bg-card/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Detailed Feature Comparison</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Compare all features across pricing tiers to find the perfect plan for your needs.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left p-4 font-medium text-muted-foreground">Feature</th>
                    <th className="p-4 font-medium">Basic</th>
                    <th className="p-4 font-medium">Pro</th>
                    <th className="p-4 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((category) => (
                    <React.Fragment key={category.category}>
                      <tr className="border-b border-muted bg-muted/20">
                        <td colSpan={4} className="px-4 py-2 font-medium">{category.category}</td>
                      </tr>
                      {category.features.map((feature) => (
                        <tr key={feature.name} className="border-b border-muted/50 hover:bg-muted/20">
                          <td className="p-4">
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-xs text-muted-foreground">{feature.description}</div>
                          </td>
                          <td className="p-4 text-center">
                            {feature.basic === true ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : feature.basic === false ? (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-sm">{feature.basic}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {feature.pro === true ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : feature.pro === false ? (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-sm">{feature.pro}</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {feature.enterprise === true ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : feature.enterprise === false ? (
                              <X className="h-5 w-5 text-muted-foreground mx-auto" />
                            ) : (
                              <span className="text-sm">{feature.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Common questions about Bitcoin locking, tax benefits, and billing.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/10 border-y border-primary/20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to protect your Bitcoin investment?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of investors who trust BitGuardian for advanced Bitcoin security, AI insights, and tax optimization.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" className="px-8">
                  Get Started Now
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Schedule a Demo
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                14-day money-back guarantee. No credit card required for Basic plan.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;