import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Zap } from "lucide-react";
import heroImage from "@/assets/hero-voice-ai.jpg";
import AnimatedBackground from "@/components/AnimatedBackground";
const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{
      backgroundImage: `url(${heroImage})`
    }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/20" />
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Voice Icon */}
        <div className="flex justify-center mb-8">
          <div className="p-4 rounded-full bg-voice-accent/20 voice-glow">
            <Mic className="w-12 h-12 text-voice-accent" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
          Integrate AI Voice Assistant
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Let people know about you or your company through intelligent voice interactions. 
          Transform how your audience connects with your brand.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Button>
          
          
        </div>
        
        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto">
              <Mic className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Natural Conversations</h3>
            <p className="text-muted-foreground text-sm">Engage users with human-like voice interactions</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Integration</h3>
            <p className="text-muted-foreground text-sm">Simple API to add voice AI to any platform</p>
          </div>
          
          <div className="p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto">
              <ArrowRight className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Brand Awareness</h3>
            <p className="text-muted-foreground text-sm">Let voice AI tell your company story</p>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;