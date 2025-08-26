import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Zap, Calendar, ShoppingCart, Navigation } from "lucide-react";
import heroImage from "@/assets/hero-voice-ai.jpg";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnimatedTextSlider from "@/components/AnimatedTextSlider";
import { motion } from "framer-motion";
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-orb animate-glow-orbit" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 gradient-orb animate-glow-orbit" style={{ animationDelay: '10s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 gradient-orb animate-glow-orbit" style={{ animationDelay: '5s' }} />
      </div>
      
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{
        backgroundImage: `url(${heroImage})`
      }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-neon-blue/10" />
      
      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Voice Icon */}
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="p-4 rounded-full glassmorphism neon-border animate-neon-pulse">
            <Mic className="w-12 h-12 text-voice-accent" />
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground via-voice-accent to-neon-cyan bg-clip-text text-transparent font-bold"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Turn Visitors into Customers with AI Voice Solutions
        </motion.h1>
        
        <motion.div 
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed min-h-[80px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <AnimatedTextSlider 
            texts={[
              "Missing leads despite ad spend?",
              "Website feels boring or hard to navigate?", 
              "Want to stay ahead with AI?"
            ]}
            className="text-center"
          />
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-6 glassmorphism neon-border hover-glow transition-all duration-300 hover:scale-105" 
            data-cal-link="tafser-yeamin-8jqc8u/bolo" 
            data-cal-namespace="bolo" 
            data-cal-config='{"layout":"month_view"}'
          >
            Book a Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
        
        {/* Service Areas Preview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, staggerChildren: 0.2 }}
        >
          {[
            {
              icon: Calendar,
              title: "Booking, FAQ & Inquiries",
              description: "Let customers instantly book, ask questions, and get answers with voice."
            },
            {
              icon: ShoppingCart,
              title: "E-commerce Product Info",
              description: "Help shoppers find products, learn details, and get recommendations hands-free."
            },
            {
              icon: Navigation,
              title: "Redirect & Track Orders",
              description: "Guide users to the right pages and track orders via voice in real-time."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-lg glassmorphism hover:neon-border hover-glow transition-all duration-500 cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                rotateX: 5
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.2 }}
            >
              <div className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-voice-accent/30 transition-colors duration-300 group-hover:voice-glow">
                <feature.icon className="w-6 h-6 text-voice-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
export default HeroSection;