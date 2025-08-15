import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate = useNavigate();
  return <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-voice-accent/20">
            <Mic className="w-6 h-6 text-voice-accent" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">BOLO</span>
        </div>
        
        
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/signin")}>
            Sign In
          </Button>
          <Button variant="voice" data-cal-link="tafser-yeamin-8jqc8u/bolo" data-cal-namespace="bolo" data-cal-config='{"layout":"month_view"}'>
            Get Started
          </Button>
        </div>
      </div>
    </header>
    </>;
};
export default Header;