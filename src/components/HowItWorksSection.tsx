import { Card, CardContent } from "@/components/ui/card";

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Build",
      description: "Utilize the voice AI API and our intuitive agent builder to create custom voice AI agents effortlessly.",
      mockup: "interface"
    },
    {
      number: "02", 
      title: "Test",
      description: "Perform comprehensive agent testing with built-in test LLM features to ensure seamless handling of edge cases.",
      mockup: "testing"
    },
    {
      number: "03",
      title: "Deploy", 
      description: "Easily deploy your agents to phone calls, web calls, SMS, and more.",
      mockup: "deploy"
    },
    {
      number: "04",
      title: "Monitor",
      description: "Track success rates, latency, and user sentiment through call history dashboard. Quickly identify failed calls.",
      mockup: "analytics"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground mb-4 tracking-wide uppercase">Value</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            How It Works
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-8">
                <div className="mb-6">
                  <span className="text-6xl font-bold text-primary/20 leading-none">
                    {step.number}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Mockup placeholder */}
                <div className="bg-muted/30 rounded-lg p-4 h-32 flex items-center justify-center border border-border/30">
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded flex items-center justify-center">
                    <div className="text-xs text-muted-foreground capitalize">
                      {step.mockup} preview
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;