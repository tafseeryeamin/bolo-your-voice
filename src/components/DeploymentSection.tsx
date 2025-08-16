import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Network, Users, Shield } from "lucide-react";

const DeploymentSection = () => {
  const features = [
    {
      title: "Display Branded Call ID",
      description: "Enable Retell AI's Branded Call feature to unlock new levels of customer trust and satisfaction for outbound call operations.",
      icon: Smartphone,
      delay: "0s",
      mockup: "phone"
    },
    {
      title: "Using SIP Trunking Connect to Any Telephony",
      description: "Use your existing phone numbers or your familiar VOIP providers. You can connect to any telephony using Retell SIP Trunking.",
      icon: Network,
      delay: "0.2s",
      mockup: "providers"
    },
    {
      title: "Batch Calling",
      description: "Effortlessly run batch call campaigns without concurrency limits, with detailed conversation tracking available after each campaign.",
      icon: Users,
      delay: "0.4s",
      mockup: "dashboard"
    },
    {
      title: "Verified Phone Numbers",
      description: "Build and maintain trust with customers with verified phone numbers that prevent your calls being labeled as spam.",
      icon: Shield,
      delay: "0.6s",
      mockup: "verified"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/95 to-secondary/5 relative overflow-hidden">
      {/* Background glass effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto max-w-7xl relative">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-sm text-white/90 font-medium">Deploy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Effortlessly Deploy AI Calls
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="relative group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/30 animate-fade-in hover:scale-[1.02] hover:-translate-y-1"
                style={{ animationDelay: feature.delay }}
              >
                {/* Glass reflection effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="p-8 relative">
                  {/* Icon with animated background */}
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-110">
                      <IconComponent className="w-8 h-8 text-white group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-white/80 mb-8 leading-relaxed group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Mockup preview with glass effect */}
                  <div className="relative h-40 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden group-hover:border-white/20 transition-colors duration-500">
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Content preview */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {feature.mockup === "phone" && (
                        <div className="w-20 h-32 bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-16 h-28 bg-white/10 rounded-md flex flex-col items-center justify-center space-y-2">
                            <div className="w-8 h-8 bg-primary/30 rounded-full" />
                            <div className="w-10 h-1 bg-white/30 rounded" />
                            <div className="w-8 h-1 bg-white/30 rounded" />
                          </div>
                        </div>
                      )}
                      
                      {feature.mockup === "providers" && (
                        <div className="grid grid-cols-3 gap-2">
                          {[1,2,3,4,5,6].map((i) => (
                            <div key={i} className="w-12 h-8 bg-white/20 rounded border border-white/30 backdrop-blur-sm" />
                          ))}
                        </div>
                      )}
                      
                      {feature.mockup === "dashboard" && (
                        <div className="w-32 h-24 bg-white/10 rounded-lg border border-white/30 backdrop-blur-sm p-2">
                          <div className="space-y-1">
                            {[1,2,3,4].map((i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-primary/40 rounded-full" />
                                <div className="flex-1 h-1 bg-white/30 rounded" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {feature.mockup === "verified" && (
                        <div className="w-20 h-32 bg-white/20 rounded-lg border border-white/30 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-16 h-28 bg-white/10 rounded-md flex flex-col items-center justify-center space-y-2">
                            <Shield className="w-6 h-6 text-primary/60" />
                            <div className="w-10 h-1 bg-white/30 rounded" />
                            <div className="w-8 h-1 bg-white/30 rounded" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Bottom shine line */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeploymentSection;