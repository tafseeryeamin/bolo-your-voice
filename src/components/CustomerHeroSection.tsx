import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Zap, LogOut, Settings } from "lucide-react";
import heroImage from "@/assets/hero-voice-ai.jpg";
import AnimatedBackground from "@/components/AnimatedBackground";
import VoiceInterface from "@/components/VoiceInterface";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
interface CustomerHeroSectionProps {
  user: any;
}
const CustomerHeroSection = ({
  user
}: CustomerHeroSectionProps) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    checkAdminRole();
  }, [user]);
  const checkAdminRole = async () => {
    if (!user) return;
    const {
      data,
      error
    } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });
    if (!error && data) {
      setIsAdmin(true);
    }
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/signin");
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
      backgroundImage: `url(${heroImage})`
    }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/20" />
      
      {/* Header with user info and sign out */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-voice-accent/20">
              <Mic className="w-6 h-6 text-voice-accent" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">BOLO</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
            {isAdmin && <Button onClick={() => navigate("/admin")} variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Button>}
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Voice Interface */}
        <div className="flex justify-center mb-8">
          <VoiceInterface className="max-w-md w-full" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
          Your AI Voice Assistant
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Test your personalized voice AI assistant. Experience intelligent conversations 
          that represent your brand and connect with your audience.
        </p>
        
        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto">
              <Mic className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice Testing</h3>
            <p className="text-muted-foreground text-sm">Test your AI voice assistant with real conversations</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Response</h3>
            <p className="text-muted-foreground text-sm">Get immediate feedback from your voice AI</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto">
              <ArrowRight className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ready to Deploy</h3>
            <p className="text-muted-foreground text-sm">Your voice AI is configured and ready to use</p>
          </div>
        </div>
      </div>
    </section>;
};
export default CustomerHeroSection;