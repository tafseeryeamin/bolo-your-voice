import { useEffect, useState } from "react";

const FloatingElements = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Main floating wave - inspired by the uploaded image */}
      <div 
        className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 opacity-30"
        style={{
          transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.02}deg)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-voice-accent/30 to-primary/10 rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite]" />
      </div>

      {/* Secondary floating element */}
      <div 
        className="absolute w-96 h-96 top-1/4 right-10 opacity-20"
        style={{
          transform: `translateY(${scrollY * -0.15}px) translateX(${Math.sin(scrollY * 0.01) * 20}px)`,
        }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-voice-accent/40 to-primary/20 rounded-full blur-2xl animate-[float_15s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Tertiary floating element */}
      <div 
        className="absolute w-64 h-64 bottom-1/4 left-10 opacity-25"
        style={{
          transform: `translateY(${scrollY * 0.08}px) translateX(${Math.cos(scrollY * 0.008) * 15}px)`,
        }}
      >
        <div className="w-full h-full bg-gradient-to-bl from-primary/30 to-voice-accent/20 rounded-full blur-xl animate-[float_12s_ease-in-out_infinite]" />
      </div>

      {/* Small floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 opacity-40"
          style={{
            top: `${20 + (i * 15)}%`,
            left: `${10 + (i * 12)}%`,
            transform: `translateY(${scrollY * (0.02 + i * 0.01)}px) translateX(${Math.sin(scrollY * 0.005 + i) * 10}px)`,
          }}
        >
          <div className="w-full h-full bg-voice-accent/60 rounded-full blur-sm animate-[pulse_3s_ease-in-out_infinite]" style={{
            animationDelay: `${i * 0.5}s`
          }} />
        </div>
      ))}

      {/* Flowing wave elements similar to the uploaded image */}
      <div 
        className="absolute bottom-0 left-0 w-full h-32 opacity-25"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      >
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,60 C300,20 600,100 900,60 C1050,30 1150,80 1200,60 L1200,120 L0,120 Z" 
            className="fill-gradient-to-r from-primary/20 to-voice-accent/20 animate-[float_8s_ease-in-out_infinite]"
          />
        </svg>
      </div>
    </div>
  );
};

export default FloatingElements;