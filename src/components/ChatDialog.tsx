
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, X } from "lucide-react";
import ChatBox from "@/components/ChatBox";

const ChatDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center bg-primary hover:bg-primary/90 z-50"
          size="icon"
          aria-label="Open chat assistant"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            BitChat Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="h-[400px]">
          <ChatBox />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;
