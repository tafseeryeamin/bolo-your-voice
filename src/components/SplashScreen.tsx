import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete before calling onComplete
      setTimeout(onComplete, 800);
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-background/95 backdrop-blur-sm"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-voice-accent/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative flex flex-col items-center space-y-8">
            {/* Logo container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 1,
                ease: "easeOut",
                delay: 0.2 
              }}
              className="relative"
            >
              {/* Logo glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-voice-accent/30 blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Logo icon */}
              <div className="relative p-8 rounded-full glassmorphism border-4 border-voice-accent/20 shadow-2xl">
                <Mic className="w-16 h-16 md:w-20 md:h-20 text-voice-accent" />
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                delay: 0.8 
              }}
              className="text-center space-y-2"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-voice-accent to-foreground bg-clip-text text-transparent">
                BOLO VOICE
              </h1>
              <p className="text-lg text-muted-foreground font-medium tracking-wide">
                AI Voice Solutions
              </p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.6,
                ease: "easeOut",
                delay: 1.2 
              }}
              className="flex flex-col items-center space-y-4"
            >
              {/* Progress bar */}
              <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-voice-accent to-voice-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ 
                    duration: 2,
                    ease: "easeOut",
                    delay: 1.5 
                  }}
                />
              </div>
              
              {/* Loading text */}
              <motion.p
                className="text-sm text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Loading Experience...
              </motion.p>
            </motion.div>
          </div>

          {/* Subtle corner decorations */}
          <motion.div
            className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-voice-accent/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          />
          <motion.div
            className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-voice-accent/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;