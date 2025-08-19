import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import VoiceInterface from "@/components/VoiceInterface";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/sign-in");
    } else {
      setUser(user);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Voice Interface Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
              Test Your Voice AI
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Experience your personalized voice assistant powered by BOLO AI. 
              Start a conversation and see how it responds to your queries.
            </p>
            <VoiceInterface className="max-w-md mx-auto" />
          </div>
        </section>
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Dashboard;