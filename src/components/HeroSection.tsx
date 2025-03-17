
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bitcoin } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] bg-[radial-gradient(circle_at_top_right,_#F7931A33,_transparent_40%)]"></div>
        <div className="absolute -inset-[10px] bg-[radial-gradient(circle_at_bottom_left,_#F7931A20,_transparent_30%)]"></div>
      </div>
      
      {/* Floating Bitcoin icons */}
      <div className="absolute top-1/4 left-1/4 animate-float opacity-10">
        <Bitcoin size={60} className="text-primary" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 animate-float opacity-10" style={{animationDelay: "2s"}}>
        <Bitcoin size={40} className="text-primary" />
      </div>
      <div className="absolute top-2/3 left-1/3 animate-float opacity-10" style={{animationDelay: "4s"}}>
        <Bitcoin size={30} className="text-primary" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Protect</span> Your Bitcoin with{" "}
              <span className="gradient-text">AI Intelligence</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl">
              BitGuardian uses advanced AI to help you make smarter Bitcoin investment decisions with real-time analysis, fraud detection, and personalized recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button className="btn-primary w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/bitcoin-info">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Bitcoin Analysis
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/30"></div>
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-muted-foreground">
                Joined by <span className="font-medium text-foreground">2,000+</span> Bitcoin investors
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              {/* Main image with glass effect */}
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl animate-glow">
                <div className="aspect-video w-full bg-card flex items-center justify-center relative overflow-hidden">
                  <Bitcoin size={120} className="text-primary opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-2">BitGuardian</h3>
                      <p className="text-muted-foreground">AI-Powered Protection</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating cards */}
              <div className="absolute -left-10 -bottom-10 transform rotate-6 glass-card p-4 rounded-lg shadow-lg max-w-[180px] animate-float">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                    <TrendingUp size={16} className="text-green-500" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">+5.8%</p>
                    <p className="text-xs text-muted-foreground">24h change</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-5 top-10 transform -rotate-3 glass-card p-4 rounded-lg shadow-lg max-w-[160px] animate-float" style={{animationDelay: "1.5s"}}>
                <div className="text-sm text-center">
                  <p className="text-primary font-medium">Low Risk</p>
                  <div className="w-full bg-muted/30 h-2 rounded-full mt-2">
                    <div className="bg-green-500 w-1/3 h-full rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
