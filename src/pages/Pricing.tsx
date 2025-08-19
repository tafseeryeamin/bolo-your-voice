import { Check, Phone, Globe, Zap, BarChart3, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
const Pricing = () => {
  const features = [{
    icon: Phone,
    title: "Real-Time Voice Conversations",
    description: "Crystal-clear audio with sub-100ms latency for natural conversations"
  }, {
    icon: Globe,
    title: "WebRTC Technology",
    description: "Browser-native voice calls with no downloads or plugins required"
  }, {
    icon: Zap,
    title: "Instant Connection",
    description: "Connect calls in under 2 seconds with global edge network"
  }, {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Monitor call quality, duration, and performance metrics live"
  }, {
    icon: Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption and SOC 2 compliant infrastructure"
  }, {
    icon: Clock,
    title: "24/7 Availability",
    description: "99.9% uptime with automatic failover and redundancy"
  }, {
    icon: Users,
    title: "Multi-Language Support",
    description: "Support for 40+ languages with native accent handling"
  }, {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Distributed worldwide with regional data residency options"
  }];
  const pricingTiers = [{
    name: "Starter",
    description: "Perfect for testing and small projects",
    price: "$0.20",
    unit: "per minute",
    features: ["Up to 1,000 minutes/month", "WebRTC voice calls", "Basic analytics", "Email support", "Standard voice quality"]
  }, {
    name: "Professional",
    description: "Best for growing businesses",
    price: "$0.15",
    unit: "per minute",
    popular: true,
    features: ["Unlimited minutes", "Premium voice quality", "Advanced analytics", "Priority support", "Custom voice training", "API rate limiting: 100 RPS"]
  }, {
    name: "Enterprise",
    description: "For large-scale deployments",
    price: "Custom",
    unit: "pricing",
    features: ["Volume discounts available", "Dedicated infrastructure", "White-label solution", "24/7 phone support", "Custom integrations", "SLA guarantees"]
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Pay-As-You-Go
              <span className="block text-primary">Voice Calling</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Scale your voice AI applications with transparent, usage-based pricing. 
              Only pay for what you use with no hidden fees or minimum commitments.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-white/60">
              
              
              
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-white/80">
                Start free, scale as you grow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => <Card key={tier.name} className={`relative bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 ${tier.popular ? 'ring-2 ring-primary scale-105' : ''}`}>
                  {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold text-white">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {tier.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-white">
                        {tier.price}
                      </span>
                      <span className="text-white/70 ml-2">
                        {tier.unit}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {tier.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>)}
                    
                    <div className="pt-6">
                      
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-background to-primary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Enterprise-Grade Features
              </h2>
              <p className="text-xl text-white/80">
                Everything you need for production-ready voice applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        
      </main>
    </div>;
};
export default Pricing;