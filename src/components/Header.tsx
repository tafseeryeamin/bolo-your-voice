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

    // Listen for auth state changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkAdminRole(session.user);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkAuth = async () => {
    const {
      data: {
        user
      }
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      checkAdminRole(user);
    }
  };
  const checkAdminRole = async (currentUser: any) => {
    if (!currentUser) return;
    const {
      data,
      error
    } = await supabase.rpc('has_role', {
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
          <div className="relative group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-voice-accent/20 to-neon-cyan/20 flex items-center justify-center border border-voice-accent/30 shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-300">
              <img 
                src="/src/assets/bolo-logo.jpg" 
                alt="Bolo Voice Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-voice-accent/40 to-neon-cyan/40 blur-lg animate-pulse opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-voice-accent/20 to-neon-cyan/20 blur-md animate-ping opacity-30" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">BOLO VOICE</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          
          {user && <>
              <Button variant="ghost" onClick={() => navigate("/agents")}>
                My Agents
              </Button>
              {isAdmin && <>
                  <Button variant="ghost" onClick={() => navigate("/admin")}>
                    Admin
                  </Button>
                  <Button variant="ghost" onClick={() => navigate("/demo-testing")}>
                    Demo & Testing
                  </Button>
                  
                </>}
            </>}
        </nav>
        
        <div className="flex items-center space-x-4">
          {user ? <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button variant="ghost" onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}>
                Sign Out
              </Button>
            </div> : <>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/sign-in")}>
                Sign In
              </Button>
              <Button variant="voice" data-cal-link="tafser-yeamin-8jqc8u/bolo" data-cal-namespace="bolo" data-cal-config='{"layout":"month_view"}'>
                Get Started
              </Button>
            </>}
        </div>
      </div>
    </header>
    </>;
};
export default Header;