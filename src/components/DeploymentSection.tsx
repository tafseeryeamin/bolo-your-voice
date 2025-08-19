import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Network, Users, Shield } from "lucide-react";
const DeploymentSection = () => {
  const features = [{
    title: "Display Branded Call ID",
    description: "Enable Retell AI's Branded Call feature to unlock new levels of customer trust and satisfaction for outbound call operations.",
    icon: Smartphone,
    delay: "0s",
    mockup: "phone"
  }, {
    title: "Using SIP Trunking Connect to Any Telephony",
    description: "Use your existing phone numbers or your familiar VOIP providers. You can connect to any telephony using Retell SIP Trunking.",
    icon: Network,
    delay: "0.2s",
    mockup: "providers"
  }, {
    title: "Batch Calling",
    description: "Effortlessly run batch call campaigns without concurrency limits, with detailed conversation tracking available after each campaign.",
    icon: Users,
    delay: "0.4s",
    mockup: "dashboard"
  }, {
    title: "Verified Phone Numbers",
    description: "Build and maintain trust with customers with verified phone numbers that prevent your calls being labeled as spam.",
    icon: Shield,
    delay: "0.6s",
    mockup: "verified"
  }];
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Enterprise Deployment
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Scale your voice AI with enterprise-grade features and security
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: feature.delay }}
            >
              <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:scale-105">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Mockup placeholder */}
                <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                    <span className="text-white/60 text-sm font-medium">
                      {feature.mockup} mockup
                    </span>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default DeploymentSection;