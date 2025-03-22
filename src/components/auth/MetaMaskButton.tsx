import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface MetaMaskButtonProps {
  onConnect: (address: string) => void;
}

const MetaMaskButton = ({ onConnect }: MetaMaskButtonProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install it to continue.");
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        onConnect(accounts[0]);
      } else {
        setError("No accounts found. Please create an account in MetaMask.");
      }
    } catch (err) {
      console.error("Error connecting to MetaMask", err);
      if (err.code === 4001) {
        // User rejected the request
        setError("Please allow MetaMask to connect.");
      } else {
        setError("Error connecting to MetaMask. Please try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleConnect}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect MetaMask"
        )}
      </Button>
      
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      
      {!window.ethereum && (
        <p className="text-xs text-muted-foreground text-center">
          Don't have MetaMask?{" "}
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            Download here
          </a>
        </p>
      )}
    </div>
  );
};

export default MetaMaskButton;