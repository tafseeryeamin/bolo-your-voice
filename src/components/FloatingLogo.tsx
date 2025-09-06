import { motion } from "framer-motion";
import boloLogo from "@/assets/bolo-logo.jpg";

const FloatingLogo = () => {
  return (
    <motion.div 
      className="fixed bottom-6 left-6 z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="relative group cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-voice-accent/20 to-neon-cyan/20 flex items-center justify-center border border-voice-accent/30 shadow-lg backdrop-blur-sm hover:scale-110 transition-all duration-300">
          <img 
            src={boloLogo} 
            alt="Bolo Voice Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-voice-accent/40 to-neon-cyan/40 blur-lg animate-pulse opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-voice-accent/20 to-neon-cyan/20 blur-md animate-ping opacity-30" />
      </div>
    </motion.div>
  );
};

export default FloatingLogo;