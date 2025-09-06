import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DeploymentSection from "@/components/DeploymentSection";
import CTASection from "@/components/CTASection";
import VoiceCallButton from "@/components/VoiceCallButton";
import FloatingLogo from "@/components/FloatingLogo";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DeploymentSection />
        <CTASection />
        <FloatingLogo />
      </main>
    </div>;
};
export default Index;