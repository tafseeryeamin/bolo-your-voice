import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 via-voice-accent/10 to-neon-purple/10" />
      
      {/* Floating Orbs */}
      <div className="absolute top-10 left-10 w-32 h-32 gradient-orb animate-glow-orbit" />
      <div className="absolute bottom-10 right-10 w-24 h-24 gradient-orb animate-glow-orbit" style={{ animationDelay: '5s' }} />
      
      <motion.div 
        className="relative max-w-4xl mx-auto px-6 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground via-voice-accent to-neon-cyan bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Bolo makes your website talk, sell, and support — all in one
        </motion.h2>
        <motion.p 
          className="text-lg text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          Transform visitor interactions with intelligent voice solutions that convert, engage, and delight your customers.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            className="group glassmorphism neon-border hover-glow transition-all duration-300 hover:scale-105" 
            data-cal-link="tafser-yeamin-8jqc8u/bolo" 
            data-cal-namespace="bolo" 
            data-cal-config='{"layout":"month_view"}'
          >
            <Mail className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Book a Demo
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
export default CTASection;