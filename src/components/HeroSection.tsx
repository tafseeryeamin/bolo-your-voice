import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Zap, Calendar, ShoppingCart, Navigation } from "lucide-react";
import heroImage from "@/assets/hero-voice-ai.jpg";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnimatedTextSlider from "@/components/AnimatedTextSlider";
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
        
        <h1 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent font-bold">
          Turn Visitors into Customers with AI Voice Solutions
        </h1>
        
        <div className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed min-h-[80px] flex items-center justify-center">
          <AnimatedTextSlider 
            texts={[
              "Spending a lot on ads but missing leads?",
              "Is your website boring or hard to navigate?", 
              "Want to keep up with the future of business?"
            ]}
            className="text-center"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6" data-cal-link="tafser-yeamin-8jqc8u/bolo" data-cal-namespace="bolo" data-cal-config='{"layout":"month_view"}'>
            Book a Demo
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Service Areas Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="group p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-voice-accent/30 transition-colors duration-300">
              <Calendar className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Booking, FAQ & Inquiries</h3>
            <p className="text-muted-foreground text-sm">Let customers instantly book, ask questions, and get answers with voice.</p>
          </div>
          
          <div className="group p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-voice-accent/30 transition-colors duration-300">
              <ShoppingCart className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">E-commerce Product Info</h3>
            <p className="text-muted-foreground text-sm">Help shoppers find products, learn details, and get recommendations hands-free.</p>
          </div>
          
          <div className="group p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-voice-accent/30 transition-colors duration-300">
              <Navigation className="w-6 h-6 text-voice-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Redirect & Track Orders</h3>
            <p className="text-muted-foreground text-sm">Guide users to the right pages and track orders via voice in real-time.</p>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;