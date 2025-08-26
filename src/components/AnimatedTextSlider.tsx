import { useState, useEffect } from 'react';

interface AnimatedTextSliderProps {
  texts: string[];
  className?: string;
}

const AnimatedTextSlider = ({ texts, className = "" }: AnimatedTextSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <span 
      className={`inline-block transition-all duration-300 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
      } ${className}`}
    >
      {texts[currentIndex]}
    </span>
  );
};

export default AnimatedTextSlider;