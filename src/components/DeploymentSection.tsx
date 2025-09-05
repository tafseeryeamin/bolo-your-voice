import { Check, Phone, Globe, Zap, BarChart3, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DeploymentSection = () => {
  const features = [{
    icon: Phone,
    title: "Booking System Integration",
    description: "Seamlessly handle appointments and reservations through voice commands"
  }, {
    icon: Users,
    title: "CRM Management",
    description: "Intelligent customer relationship management with voice-driven updates"
  }, {
    icon: Globe,
    title: "Email Automation",
    description: "Automated email responses and follow-ups based on conversations"
  }, {
    icon: Zap,
    title: "Website Navigation",
    description: "Guide customers to specific pages through natural voice interactions"
  }, {
    icon: BarChart3,
    title: "Custom Dashboard",
    description: "Full control panel with real-time analytics and conversation insights"
  }, {
    icon: Shield,
    title: "Bot Control Panel",
    description: "Complete customization of AI behavior, responses, and workflows"
  }, {
    icon: Clock,
    title: "ElevenLabs Voice",
    description: "Premium natural-sounding AI voices with emotional intelligence"
  }, {
    icon: Globe,
    title: "GPT-4 Powered",
    description: "Latest OpenAI technology for intelligent, context-aware conversations"
  }];


  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
      {/* Hero Section */}
      <div className="py-20 px-4 bg-gradient-to-br from-teal-600/20 via-transparent to-blue-600/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Complete AI Business
            <span className="block text-teal-400">Assistant Platform</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Booking, CRM, Email automation, and intelligent website navigation powered by 
            GPT-4 and ElevenLabs premium voice technology.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400" />
              <span>No long-term contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400" />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-400" />
              <span>Enterprise security</span>
            </div>
          </div>
        </div>
      </div>


      {/* Features Section */}
      <div className="py-20 px-4 bg-gradient-to-br from-transparent to-teal-600/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              All-in-One Business Features
            </h2>
            <p className="text-xl text-white/80">
              Everything you need to automate customer interactions and boost productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-teal-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default DeploymentSection;