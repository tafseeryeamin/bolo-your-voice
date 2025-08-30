import { Card, CardContent } from "@/components/ui/card";
import { Code, TestTube, Rocket, BarChart3 } from "lucide-react";
const HowItWorksSection = () => {
  const steps = [{
    number: "01",
    title: "Build",
    description: "Utilize the voice AI API and our intuitive agent builder to create custom voice AI agents effortlessly.",
    icon: Code,
    delay: "0s"
  }, {
    number: "02",
    title: "Test",
    description: "Perform comprehensive agent testing with built-in test LLM features to ensure seamless handling of edge cases.",
    icon: TestTube,
    delay: "0.2s"
  }, {
    number: "03",
    title: "Deploy",
    description: "Easily deploy your agents to phone calls, web calls, SMS, and more.",
    icon: Rocket,
    delay: "0.4s"
  }, {
    number: "04",
    title: "Monitor",
    description: "Track success rates, latency, and user sentiment through call history dashboard. Quickly identify failed calls.",
    icon: BarChart3,
    delay: "0.6s"
  }];
  return <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10 overflow-hidden">
      
    </section>;
};
export default HowItWorksSection;