import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useState } from "react";
import BookingModal from "@/components/BookingModal";
const Header = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-voice-accent/20">
            <Mic className="w-6 h-6 text-voice-accent" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
            Bolo
          </span>
        </div>
        
        
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Sign In
          </Button>
          <Button 
            variant="voice"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
    
    <BookingModal 
      isOpen={isBookingModalOpen} 
      onClose={() => setIsBookingModalOpen(false)} 
    />
    </>
  );
};
export default Header;