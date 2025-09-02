import { Check, Phone, Globe, Zap, BarChart3, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-white">
          VoiceAI Pro
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors">Support</a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Sign In
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

const Pricing = () => {
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

  const pricingTiers = [{
    name: "Starter",
    description: "Complete AI assistant for small businesses",
    price: "$200",
    unit: "per month",
    setupFee: "$600",
    minutes: "100 minutes included",
    features: ["Booking system integration", "CRM management", "Email automation", "Website navigation", "Custom dashboard", "Bot control panel", "ElevenLabs premium voice", "GPT-4 powered AI"]
  }, {
    name: "Premium",
    description: "Advanced solution for growing businesses",
    price: "$450",
    unit: "per month",
    setupFee: "$600", 
    minutes: "250 minutes included",
    popular: true,
    features: ["Everything in Starter", "Expanded conversation time", "Priority support", "Advanced analytics", "Custom voice training", "Multi-language support", "API integrations", "White-label options"]
  }, {
    name: "Enterprise",
    description: "Full-scale solution for large organizations",
    price: "$1,800",
    unit: "per month",
    setupFee: "$600",
    minutes: "1000 minutes included",
    features: ["Everything in Premium", "Maximum conversation capacity", "Dedicated infrastructure", "24/7 phone support", "Custom integrations", "SLA guarantees", "Multiple bot instances", "Advanced reporting"]
  }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-teal-600/20 via-transparent to-blue-600/20">
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
        </section>

        {/* Pricing Cards */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-white/80">
                One-time setup fee of $600 + monthly subscription
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <Card key={tier.name} className={`relative bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 ${tier.popular ? 'ring-2 ring-teal-500 scale-105' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
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
                      <div className="mt-2 text-sm text-white/60">
                        Setup fee: {tier.setupFee}
                      </div>
                      <div className="mt-1 text-sm text-teal-400">
                        {tier.minutes}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                    
                    <div className="pt-6">
                      <Button 
                        className={`w-full ${tier.popular 
                          ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        }`}
                      >
                        {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-transparent to-teal-600/5">
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
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-teal-600/10 to-blue-600/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses already using our AI assistant to automate customer interactions and drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
                Start Your Free Demo
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                Schedule Consultation
              </Button>
            </div>
            <div className="mt-8 text-sm text-white/60">
              <p>✓ 30-day money-back guarantee  ✓ No setup fees for first 100 customers</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">VoiceAI Pro</div>
              <p className="text-white/60 text-sm">
                Revolutionizing business communication with intelligent AI assistants.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-white/60">
                <div><a href="#" className="hover:text-white transition-colors">Features</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Pricing</a></div>
                <div><a href="#" className="hover:text-white transition-colors">API</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Integrations</a></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-white/60">
                <div><a href="#" className="hover:text-white transition-colors">Documentation</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Help Center</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Contact Us</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Status</a></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-white/60">
                <div><a href="#" className="hover:text-white transition-colors">About</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Blog</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Careers</a></div>
                <div><a href="#" className="hover:text-white transition-colors">Privacy</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/60">
            <p>&copy; 2025 VoiceAI Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;