import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import VoiceCallButton from "@/components/VoiceCallButton";
const Index = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CTASection />
        {/* Add the voice call button */}
        
      </main>
    </div>;
};
export default Index;