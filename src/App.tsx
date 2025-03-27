
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BitcoinInfo from "./pages/BitcoinInfo";
import FraudDetection from "./pages/FraudDetection";
import SmartContracts from "./pages/SmartContracts";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";
import ChatbotWidget from "./components/ChatBotWidget";
import Pricing from "./pages/Pricing";
import SignupPage from "./pages/SignupPage";


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/bitcoin-info" element={<BitcoinInfo />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
            <Route path="/smart-contracts" element={<SmartContracts />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/dashboard" element={<Dashboard />} /> {/* Fixed the component name */}
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatDialog />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
