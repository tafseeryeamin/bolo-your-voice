import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DeploymentSection from "@/components/DeploymentSection";
import CTASection from "@/components/CTASection";
import VoiceCallButton from "@/components/VoiceCallButton";
import FloatingLogo from "@/components/FloatingLogo";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {/* Main Content */}
      <AnimatePresence>
        {!showSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Header />
            <main className="pt-20">
              <HeroSection />
              <FeaturesSection />
              <HowItWorksSection />
              <DeploymentSection />
              <CTASection />
            </main>
            <VoiceCallButton />
            <FloatingLogo />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;