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
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Deploy Anywhere</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary bg-teal-100" />
              <h3 className="text-xl font-semibold mb-2 text-teal-300">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default DeploymentSection;