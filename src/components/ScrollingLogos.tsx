import { motion } from "framer-motion";
import djangoLogo from "@/assets/logos/django.svg";
import javaLogo from "@/assets/logos/java.svg";
import wordpressLogo from "@/assets/logos/wordpress.svg";
import reactLogo from "@/assets/logos/react.svg";
import nodejsLogo from "@/assets/logos/nodejs.svg";
import pythonLogo from "@/assets/logos/python.svg";
import javascriptLogo from "@/assets/logos/javascript.svg";

const ScrollingLogos = () => {
  const logos = [
    { src: djangoLogo, alt: "Django", name: "Django" },
    { src: javaLogo, alt: "Java", name: "Java" },
    { src: wordpressLogo, alt: "WordPress", name: "WordPress" },
    { src: reactLogo, alt: "React", name: "React" },
    { src: nodejsLogo, alt: "Node.js", name: "Node.js" },
    { src: pythonLogo, alt: "Python", name: "Python" },
    { src: javascriptLogo, alt: "JavaScript", name: "JavaScript" },
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden py-8">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
      
      <motion.div
        className="flex gap-12 items-center justify-center"
        animate={{
          x: [-1200, 0]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0"
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </motion.div>
      
      <div className="text-center mt-4">
        <p className="text-muted-foreground text-sm">
          Integrates with your favorite platforms
        </p>
      </div>
    </div>
  );
};

export default ScrollingLogos;