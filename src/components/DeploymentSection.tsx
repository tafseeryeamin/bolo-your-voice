import { Globe, Zap, Users, Code, Monitor, BarChart3 } from "lucide-react";
const DeploymentSection = () => {
  const features = [{
    title: "Web-Based Voice Calls",
    description: "Launch voice conversations directly from your web browser with crystal-clear audio quality and zero downloads required.",
    icon: Globe,
    delay: "0s",
    size: "large",
    mockup: "web-interface"
  }, {
    title: "Real-Time Analytics",
    description: "Monitor conversation metrics and performance insights live.",
    icon: BarChart3,
    delay: "0.1s",
    size: "small",
    mockup: "analytics"
  }, {
    title: "Instant Deployment",
    description: "Deploy your voice AI agents instantly with one-click web integration.",
    icon: Zap,
    delay: "0.2s",
    size: "small",
    mockup: "deployment"
  }, {
    title: "Multi-User Sessions",
    description: "Enable collaborative voice conversations with multiple participants in real-time web sessions.",
    icon: Users,
    delay: "0.3s",
    size: "medium",
    mockup: "multi-user"
  }, {
    title: "Developer Dashboard",
    description: "Comprehensive web dashboard for managing voice AI configurations and monitoring performance.",
    icon: Monitor,
    delay: "0.4s",
    size: "medium",
    mockup: "dashboard"
  }, {
    title: "API Integration",
    description: "Seamless web API integration for custom implementations.",
    icon: Code,
    delay: "0.5s",
    size: "small",
    mockup: "api"
  }];
  return <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
      
    </section>;
};
export default DeploymentSection;