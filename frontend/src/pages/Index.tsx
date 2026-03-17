import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Mic, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/assets/Logo.png";

const Index = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!message.trim()) return;
    navigate("/results", { state: { initialMessage: message.trim() } });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-2">
      <img src={Logo} alt="HousingAid Logo" className="h-56" />

      <h1 className="font-display text-2xl font-bold text-center text-foreground leading-snug">
        Let us help you find the aid you need.
      </h1>

      <p className="text-muted-foreground text-center text-sm max-w-xs">
        Describe your housing situation and we'll guide you to the right programs.
      </p>

      <div className="w-full max-w-sm">
        <div className="relative rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Please describe your situation..."
            className="w-full resize-none border-0 bg-transparent px-4 pt-4 pb-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[120px]"
            rows={4}
          />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-card border-t border-border/50">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Upload image">
                <ImagePlus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Voice input">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleSubmit}
              disabled={!message.trim()}
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
