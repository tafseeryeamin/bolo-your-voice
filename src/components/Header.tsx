import { Button } from "@/components/ui/button";
import { Mic, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      checkAdminRole(user);
    }
  };

  const checkAdminRole = async (currentUser: any) => {
    if (!currentUser) return;
    
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: currentUser.id,
      _role: 'admin'
    });
    
    if (!error && data) {
      setIsAdmin(true);
    }
  };
  return <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="p-2 rounded-lg bg-voice-accent/20">
            <Mic className="w-6 h-6 text-voice-accent" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">BOLO VOICE</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" onClick={() => navigate("/sign-in/pricing")}>
            Pricing
          </Button>
          {user && (
            <Button variant="ghost" onClick={() => navigate("/create-agent")}>
              <Settings className="w-4 h-4 mr-2" />
              My Agents
            </Button>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/sign-in")}>
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