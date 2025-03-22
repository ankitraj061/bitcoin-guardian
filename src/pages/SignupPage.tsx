import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bitcoin } from "lucide-react";
import MetaMaskButton from "@/components/auth/MetaMaskButton";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - no actual backend processing
    setTimeout(() => {
      // Store user data in localStorage if needed
      localStorage.setItem('user', JSON.stringify({
        name,
        email,
        walletAddress
      }));
      
      // Redirect to recommendations page
      navigate("/recommendations");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Bitcoin className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Create your account to access Bitcoin Guardian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                placeholder="Your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="your.email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Wallet</Label>
              {walletAddress ? (
                <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/20">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                  <span className="bg-green-500/10 text-green-600 text-xs px-2 py-0.5 rounded-full ml-auto">
                    Connected
                  </span>
                </div>
              ) : (
                <MetaMaskButton onConnect={handleWalletConnect} />
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full mt-4" 
              disabled={isSubmitting || !walletAddress || !name || !email}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-muted-foreground mt-2">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupPage;