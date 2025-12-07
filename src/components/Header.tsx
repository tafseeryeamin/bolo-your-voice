import { Button } from "@/components/ui/button";
import { Mic, Settings, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
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
          <div className="p-4 rounded-full glassmorphism neon-border animate-neon-pulse">
            <Mic className="w-6 h-6 text-voice-accent" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">BOLO VOICE</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="ghost" onClick={() => navigate("/demos")}>
            Demo
          </Button>
          {user && <>
              <Button variant="ghost" onClick={() => navigate("/agents")}>
                {t('header.myAgents')}
              </Button>
              {isAdmin && <>
                  <Button variant="ghost" onClick={() => navigate("/admin")}>
                    {t('header.admin')}
                  </Button>
                  
                  
                </>}
            </>}
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{language === 'en' ? 'EN' : 'JP'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('ja')}>
                🇯🇵 日本語
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {t('header.welcome')}, {user.email}
              </span>
              <Button variant="ghost" onClick={async () => {
              await supabase.auth.signOut();
              navigate("/");
            }}>
                {t('header.signOut')}
              </Button>
            </div> : <>
              <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/sign-in")}>
                {t('header.signIn')}
              </Button>
              <Button variant="voice" data-cal-link="tafser-yeamin-8jqc8u/bolo" data-cal-namespace="bolo" data-cal-config='{"layout":"month_view"}'>
                {t('header.getStarted')}
              </Button>
            </>}
        </div>
      </div>
    </header>
    </>;
};
export default Header;