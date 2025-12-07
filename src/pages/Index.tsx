import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DeploymentSection from "@/components/DeploymentSection";
import CTASection from "@/components/CTASection";
import SplashScreen from "@/components/SplashScreen";
import IndustriesScrollSection from "@/components/IndustriesScrollSection";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      <Helmet>
        <title>Bolo Voice - AI Salesman for Your Website | Lead Generation & Appointment Booking</title>
        <meta name="description" content="Transform your website with Bolo Voice AI salesman. Automatically handle leads, book appointments 24/7, and boost conversions with intelligent voice AI technology." />
        <meta name="keywords" content="AI salesman, voice AI, lead generation, appointment booking, website automation, conversational AI, customer service AI, sales automation" />
        <link rel="canonical" href="https://www.bolovoice.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Bolo Voice - AI Salesman for Your Website" />
        <meta property="og:description" content="Transform your website visitors into customers with intelligent AI voice technology. 24/7 lead handling and appointment booking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.bolovoice.com" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bolo Voice - AI Salesman for Your Website" />
        <meta name="twitter:description" content="Transform your website visitors into customers with intelligent AI voice technology." />
      </Helmet>
      
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
                <IndustriesScrollSection />
                <FeaturesSection />
                <HowItWorksSection />
                <DeploymentSection />
                <CTASection />
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Index;