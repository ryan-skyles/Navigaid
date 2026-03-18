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
    <div className="flex flex-col items-center px-6 pt-4 pb-6 gap-6 bg-gradient-to-b from-white to-blue-50 font-sans -mt-6">
      {/* LOGO */}
      <img src={Logo} alt="HousingAid Logo" className="h-44 md:h-52 opacity-90" />


      <br />
      <br />
      
      {/* TEXT */}
      <div className="text-center max-w-2xl space-y-3">
        <h1 className="text-4xl md:text-4xl font-semibold tracking-[-0.03em] text-gray-700 leading-tight -mt-16">
          Welcome to GovAid Assistance</h1>

        <p className="text-gray-600 text-[15px] leading-relaxed">
          GovAid Assistance helps individuals and families find housing aid programs more easily. Share a bit about your situation, and we’ll guide you to resources that fit your needs.
        </p>
      </div>

      {/* IMAGES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl">
        <img
          src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=800&q=80"
          alt="Happy family"
          className="w-full h-52 object-cover rounded-3xl shadow-sm hover:scale-[1.02] transition"
        />

        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
          alt="Bright modern apartment"
          className="w-full h-52 object-cover rounded-3xl shadow-sm hover:scale-[1.02] transition"
        />

        <img
          src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80"
          alt="People receiving help"
          className="w-full h-52 object-cover rounded-3xl shadow-sm hover:scale-[1.02] transition"
        />
      </div>

      {/* CHAT BOX */}
      <div className="w-full max-w-md">
        <div className="relative rounded-3xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Please describe your situation..."
            className="w-full resize-none border-0 bg-transparent px-5 pt-5 pb-16 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none min-h-[130px]"
            rows={4}
          />

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:bg-blue-50">
                <ImagePlus className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-500 hover:bg-blue-50">
                <Mic className="w-4 h-4" />
              </Button>
            </div>

            <Button
              size="icon"
              className="h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow"
              onClick={handleSubmit}
              disabled={!message.trim()}
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
