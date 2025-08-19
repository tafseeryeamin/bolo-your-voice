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
  return <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Web Voice Platform
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Deploy intelligent voice conversations anywhere on the web with enterprise-grade reliability
          </p>
        </div>
        
        {/* Bento Box Grid */}
        <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[800px]">
          {/* Large feature - spans 6x4 */}
          <div className="col-span-6 row-span-4 group relative animate-fade-in" style={{
          animationDelay: features[0].delay
        }}>
            <div className="relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:scale-[1.02]">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 rounded-xl bg-primary/20 backdrop-blur-sm">
                  {(() => {
                  const IconComponent = features[0].icon;
                  return <IconComponent className="w-8 h-8 text-white" />;
                })()}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {features[0].title}
                  </h3>
                  <p className="text-white/70 leading-relaxed text-lg">
                    {features[0].description}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 h-40">
                <div className="h-full bg-gradient-to-br from-primary/30 to-primary/60 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {features[0].mockup}
                  </span>
                </div>
              </div>
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>

          {/* Small features - 3x2 each */}
          {[1, 2].map(index => <div key={index} className="col-span-3 row-span-2 group relative animate-fade-in" style={{
          animationDelay: features[index].delay
        }}>
              <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:scale-105">
                <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm w-fit mb-4">
                  {(() => {
                const IconComponent = features[index].icon;
                return <IconComponent className="w-6 h-6 text-white" />;
              })()}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {features[index].title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {features[index].description}
                </p>
                
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>)}

          {/* Medium features - 6x2 each */}
          {[3, 4].map(index => <div key={index} className="col-span-6 row-span-2 group relative animate-fade-in" style={{
          animationDelay: features[index].delay
        }}>
              <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:scale-105">
                <div className="flex items-center gap-4 h-full">
                  <div className="p-4 rounded-xl bg-primary/20 backdrop-blur-sm">
                    {(() => {
                      const IconComponent = features[index].icon;
                      return <IconComponent className="w-8 h-8 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {features[index].title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {features[index].description}
                    </p>
                  </div>
                  <div className="w-32 h-20 rounded-lg bg-primary/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <span className="text-white/60 text-sm">
                      {features[index].mockup}
                    </span>
                  </div>
                </div>
                
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>)}

          {/* Small feature - 3x2 */}
          <div className="col-span-3 row-span-2 group relative animate-fade-in" style={{
          animationDelay: features[5].delay
        }}>
            <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 hover:scale-105">
              <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm w-fit mb-4">
                {(() => {
                  const IconComponent = features[5].icon;
                  return <IconComponent className="w-6 h-6 text-white" />;
                })()}
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {features[5].title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {features[5].description}
              </p>
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default DeploymentSection;