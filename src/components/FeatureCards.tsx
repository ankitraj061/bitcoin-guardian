
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Coins, Lock, Settings, TrendingUp } from "lucide-react";

const FeatureCards = () => {
  const features = [
    {
      title: "Smart Contracts",
      description: "Automate your Bitcoin transactions with secure smart contracts designed for asset protection.",
      icon: <Lock className="h-10 w-10 text-primary" />,
      link: "/smart-contracts"
    },
    {
      title: "Auto Reallocation",
      description: "Let our AI dynamically reallocate your Bitcoin assets based on market conditions and risk factors.",
      icon: <Settings className="h-10 w-10 text-primary" />,
      link: "/smart-contracts"
    },
    {
      title: "Interest Rate Tracking",
      description: "Stay updated with real-time interest rates and optimize your Bitcoin investments accordingly.",
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      link: "/recommendations"
    },
    {
      title: "AI-Powered Recommendations",
      description: "Receive personalized investment recommendations based on your portfolio and market analysis.",
      icon: <BarChart className="h-10 w-10 text-primary" />,
      link: "/recommendations"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <Card key={index} className="glass-card card-hover">
          <CardHeader className="pb-2">
            <div className="mb-4">{feature.icon}</div>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              {feature.description}
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Link to={feature.link} className="w-full">
              <Button variant="ghost" className="w-full justify-between group">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FeatureCards;
