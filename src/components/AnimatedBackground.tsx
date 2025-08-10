import { useEffect, useState } from 'react';

interface FloatingDot {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: string;
  size: string;
}

const AnimatedBackground = () => {
  const [dots, setDots] = useState<FloatingDot[]>([]);

  const colors = [
    'bg-voice-accent',
    'bg-white',
    'bg-purple-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-orange-400',
    'bg-pink-400',
    'bg-blue-400',
  ];

  const sizes = ['w-2 h-6', 'w-3 h-8', 'w-2 h-4', 'w-4 h-10'];
  const durations = ['animate-float-up', 'animate-float-up-delayed', 'animate-float-up-slow'];

  useEffect(() => {
    const generateDots = () => {
      const newDots: FloatingDot[] = [];
      
      // Create multiple columns of dots
      for (let column = 0; column < 20; column++) {
        for (let i = 0; i < 3; i++) {
          newDots.push({
            id: column * 3 + i,
            x: (column * 5) + Math.random() * 3, // Spread across screen width
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 8,
            duration: durations[Math.floor(Math.random() * durations.length)],
            size: sizes[Math.floor(Math.random() * sizes.length)]
          });
        }
      }
      
      setDots(newDots);
    };

    generateDots();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={`absolute rounded-full ${dot.color} ${dot.size} ${dot.duration} opacity-60`}
          style={{
            left: `${dot.x}%`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;