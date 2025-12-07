import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Calendar, ShoppingCart, Navigation, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-voice-ai.jpg";
import AnimatedBackground from "@/components/AnimatedBackground";
import AnimatedTextSlider from "@/components/AnimatedTextSlider";
import ScrollingLogos from "@/components/ScrollingLogos";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useRef } from "react";

const HeroSection = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Mouse tracking for parallax effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(useTransform(mouseX, [-500, 500], [-30, 30]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-500, 500], [-30, 30]), springConfig);
  const parallaxXSlow = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), springConfig);
  const parallaxYSlow = useSpring(useTransform(mouseY, [-500, 500], [-15, 15]), springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Interactive Gradient Orbs with Parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 gradient-orb"
          style={{ x: parallaxX, y: parallaxY }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-72 h-72 gradient-orb"
          style={{ x: parallaxXSlow, y: parallaxYSlow }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/3 w-48 h-48 gradient-orb"
          style={{ x: useTransform(mouseX, [-500, 500], [20, -20]), y: useTransform(mouseY, [-500, 500], [20, -20]) }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>
      
      {/* Mouse follower glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--voice-accent) / 0.15) 0%, transparent 70%)",
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Background Image */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{
          backgroundImage: `url(${heroImage})`,
          x: parallaxXSlow,
          y: parallaxYSlow,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-neon-blue/10" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-voice-accent/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Voice Icon with enhanced interactivity */}
        <motion.div 
          className="flex justify-center mb-8 mt-16"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div 
            className="relative p-4 rounded-full glassmorphism neon-border cursor-pointer"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px hsl(var(--voice-accent) / 0.3)",
                "0 0 40px hsl(var(--voice-accent) / 0.5)",
                "0 0 20px hsl(var(--voice-accent) / 0.3)",
              ],
            }}
            transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
          >
            <Mic className="w-12 h-12 text-voice-accent" />
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-voice-accent" />
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground via-voice-accent to-neon-cyan bg-clip-text text-transparent font-bold"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          {t('hero.title')}
        </motion.h1>
        
        <motion.div 
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed min-h-[80px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <AnimatedTextSlider 
            texts={[
              t('hero.subtitle1'),
              t('hero.subtitle2'), 
              t('hero.subtitle3')
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
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6 glassmorphism neon-border hover-glow transition-all duration-300 relative overflow-hidden group" 
              data-cal-link="tafser-yeamin-8jqc8u/bolo" 
              data-cal-namespace="bolo" 
              data-cal-config='{"layout":"month_view"}'
            >
              <span className="relative z-10 flex items-center">
                {t('hero.bookDemo')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-voice-accent/20 to-neon-cyan/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Service Areas Preview with enhanced hover effects */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, staggerChildren: 0.2 }}
        >
          {[
            {
              icon: Calendar,
              title: t('feature1.title'),
              description: t('feature1.description')
            },
            {
              icon: ShoppingCart,
              title: t('feature2.title'),
              description: t('feature2.description')
            },
            {
              icon: Navigation,
              title: t('feature3.title'),
              description: t('feature3.description')
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-6 rounded-lg glassmorphism overflow-hidden cursor-pointer"
              whileHover={{ 
                scale: 1.05,
                y: -8,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.2 }}
            >
              {/* Hover gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-voice-accent/10 to-neon-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              {/* Animated border on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-voice-accent/0 group-hover:border-voice-accent/50 transition-all duration-500"
                style={{
                  boxShadow: "0 0 0px hsl(var(--voice-accent) / 0)",
                }}
                whileHover={{
                  boxShadow: "0 0 30px hsl(var(--voice-accent) / 0.3)",
                }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-voice-accent/20 flex items-center justify-center mb-4 mx-auto group-hover:bg-voice-accent/40 transition-all duration-300"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-6 h-6 text-voice-accent" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-voice-accent transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Scrolling Logos Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <ScrollingLogos />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;