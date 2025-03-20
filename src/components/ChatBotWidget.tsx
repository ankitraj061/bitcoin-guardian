import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  X, 
  Maximize2, 
  Minimize2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate iframe loading
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const resetChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    // Reset the iframe by recreating it
    const iframe = document.getElementById("chatbot-iframe") as HTMLIFrameElement;
    if (iframe) {
      const src = iframe.src;
      iframe.src = "";
      setTimeout(() => {
        iframe.src = src;
        setTimeout(() => setIsLoading(false), 1000);
      }, 100);
    }
  };

  const containerStyle = isExpanded 
    ? { width: "100%", height: "80vh", maxWidth: "800px" } 
    : { width: "350px", height: "600px" };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Card className="overflow-hidden flex flex-col shadow-lg border-primary/10" style={containerStyle}>
              <div className="bg-gradient-to-r from-primary to-primary/80 p-3 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white">
                  <MessageCircle size={18} />
                  <h3 className="font-medium">BitGuardian Assistant</h3>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/10 h-7 w-7" 
                    onClick={resetChat}
                    title="Reset conversation"
                  >
                    <RefreshCw size={15} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/10 h-7 w-7" 
                    onClick={toggleExpand}
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/10 h-7 w-7" 
                    onClick={() => setIsOpen(false)}
                    title="Close"
                  >
                    <X size={15} />
                  </Button>
                </div>
              </div>
              <div className="flex-grow w-full h-full relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-background flex flex-col items-center justify-center z-10">
                    <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm text-muted-foreground">Loading your assistant...</p>
                  </div>
                )}
                <iframe
                  id="chatbot-iframe"
                  src="https://www.chatbase.co/chatbot-iframe/AVk2OYfV9s0202ZYznkS_"
                  width="100%"
                  height="100%"
                  style={{ border: "none", height: "100%" }}
                  title="BitGuardian Chatbot"
                  onLoad={() => setIsLoading(false)}
                ></iframe>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
          >
            <MessageCircle size={24} />
          </Button>
        </motion.div>
      )}
    </>
  );
};

export default ChatbotWidget;