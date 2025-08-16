import { Card, CardContent } from "@/components/ui/card";
import { Code, TestTube, Rocket, BarChart3 } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Build",
      description: "Utilize the voice AI API and our intuitive agent builder to create custom voice AI agents effortlessly.",
      icon: Code,
      delay: "0s"
    },
    {
      number: "02", 
      title: "Test",
      description: "Perform comprehensive agent testing with built-in test LLM features to ensure seamless handling of edge cases.",
      icon: TestTube,
      delay: "0.2s"
    },
    {
      number: "03",
      title: "Deploy", 
      description: "Easily deploy your agents to phone calls, web calls, SMS, and more.",
      icon: Rocket,
      delay: "0.4s"
    },
    {
      number: "04",
      title: "Monitor",
      description: "Track success rates, latency, and user sentiment through call history dashboard. Quickly identify failed calls.",
      icon: BarChart3,
      delay: "0.6s"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10 overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-sm text-white/70 mb-4 tracking-wide uppercase">Value</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            How It Works
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card 
                key={index} 
                className="relative group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 bg-card/30 backdrop-blur-sm border-white/10 hover:border-primary/30 animate-fade-in hover:scale-105 hover:-translate-y-2"
                style={{ animationDelay: step.delay }}
              >
                <CardContent className="p-8 relative overflow-hidden">
                  {/* Floating background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon with animation */}
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300 group-hover:animate-pulse">
                      <IconComponent className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-6xl font-bold text-white/10 leading-none group-hover:text-white/20 transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  
                  <p className="text-sm text-white/80 mb-8 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {step.description}
                  </p>
                  
                  {/* Animated progress bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-primary/60 w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;