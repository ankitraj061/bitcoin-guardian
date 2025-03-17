
import BitcoinAnalysis from "@/components/BitcoinAnalysis";
import BitcoinPrice from "@/components/BitcoinPrice";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import FraudAlertPreview from "@/components/FraudAlertPreview";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <HeroSection />
        
        {/* Bitcoin Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Real-Time Bitcoin Insights</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get live Bitcoin price updates and AI-powered analysis to make informed investment decisions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <BitcoinPrice />
              <BitcoinAnalysis />
            </div>
          </div>
        </section>
        
        {/* Fraud Detection Preview */}
        <section className="py-16 bg-muted/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <FraudAlertPreview />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Powerful Bitcoin Protection Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                BitGuardian offers a comprehensive suite of tools to help you secure and optimize your Bitcoin investments.
              </p>
            </div>
            
            <FeatureCards />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 sparkle-bg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Bitcoin?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of investors who use BitGuardian to protect their Bitcoin assets with advanced AI technology.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="btn-primary">
                  Get Started for Free
                </Button>
                <Button variant="outline">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

// Import necessary components
import { Button } from "@/components/ui/button";
