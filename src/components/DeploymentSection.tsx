import { Check, Phone, Globe, Zap, BarChart3, Shield, Clock, Users, FileText, AlertCircle } from "lucide-react";
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

  const websitePageTiers = [
    {
      range: "Under 20 pages",
      setupCost: 0,
      monthlyCost: 0,
      description: "Standard pricing applies"
    },
    {
      range: "20-30 pages",
      setupCost: 167,
      monthlyCost: 83,
      description: "Additional complexity handling"
    },
    {
      range: "30-50 pages",
      setupCost: 333,
      monthlyCost: 167,
      description: "Enhanced navigation system"
    },
    {
      range: "50+ pages",
      setupCost: null,
      monthlyCost: null,
      description: "Contact sales for custom pricing"
    }
  ];

  const pricingTiers = [{
    name: "Starter",
    description: "Complete AI assistant for small businesses",
    basePrice: 250,
    baseSetup: 1000,
    minutes: "100 minutes included",
    features: ["Booking system integration", "CRM management", "Email automation", "Website navigation", "Custom dashboard", "Bot control panel", "ElevenLabs premium voice", "GPT-4 powered AI"]
  }, {
    name: "Premium",
    description: "Advanced solution for growing businesses",
    basePrice: 600,
    baseSetup: 1000,
    minutes: "250 minutes included",
    popular: true,
    features: ["Booking system integration", "CRM management", "Email automation", "Website navigation", "Custom dashboard", "Bot control panel", "ElevenLabs voice", "GPT-4 powered AI"]
  }, {
    name: "Enterprise",
    description: "Full-scale solution for large organizations",
    basePrice: 2100,
    baseSetup: 1000,
    minutes: "1000 minutes included",
    features: ["Everything in Premium", "Maximum conversation capacity", "Dedicated infrastructure", "24/7 phone support", "Multiple bot instances", "Advanced reporting", "Maximum Conversations", "Advance Analytics"]
  }];

  const calculatePrice = (basePrice, additionalMonthly) => {
    if (additionalMonthly === null) return "Contact Sales";
    return `$${basePrice + additionalMonthly}`;
  };

  const calculateSetup = (baseSetup, additionalSetup) => {
    if (additionalSetup === null) return "Contact Sales";
    return `$${baseSetup + additionalSetup}`;
  };

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

      {/* Website Pages Pricing Info */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Website Page-Based Pricing
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Additional costs based on your website complexity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {websitePageTiers.map((tier, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-lg font-bold text-white">
                    {tier.range}
                  </CardTitle>
                  <CardDescription className="text-white/70 text-sm">
                    {tier.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="text-white">
                    <div className="text-sm text-white/70">Setup Cost:</div>
                    <div className="text-lg font-semibold text-orange-400">
                      {tier.setupCost === null ? "Custom Quote" : tier.setupCost === 0 ? "Included" : `+$${tier.setupCost}`}
                    </div>
                  </div>
                  <div className="text-white">
                    <div className="text-sm text-white/70">Monthly Cost:</div>
                    <div className="text-lg font-semibold text-orange-400">
                      {tier.monthlyCost === null ? "Custom Quote" : tier.monthlyCost === 0 ? "Included" : `+$${tier.monthlyCost}/mo`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-orange-600/10 border border-orange-500/20 rounded-lg p-4 max-w-3xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white/80">
                <strong className="text-orange-400">Important:</strong> These additional costs are added to your base plan pricing. 
                The final cost = Base Plan + Website Page Tier costs (both setup and monthly).
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Calculator Cards */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Choose Your Base Plan
            </h2>
            <p className="text-xl text-white/80">
              Prices shown below are base costs (add website page costs if applicable)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div key={tier.name} className="space-y-4">
                <Card className={`relative bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-300 ${tier.popular ? 'ring-2 ring-teal-500 scale-105' : ''}`}>
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
                        ${tier.basePrice}
                      </span>
                      <span className="text-white/70 ml-2">
                        per month
                      </span>
                      <div className="mt-2 text-sm text-white/60">
                        Base setup fee: ${tier.baseSetup}
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
                  </CardContent>
                </Card>

                {/* Pricing Examples */}
                <Card className="bg-gradient-to-br from-teal-600/10 to-orange-600/10 backdrop-blur-xl border-white/10">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-white text-center">
                      Total Pricing Examples
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {websitePageTiers.map((pageTier, pageIndex) => (
                      <div key={pageIndex} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                        <span className="text-white/70">{pageTier.range}:</span>
                        <div className="text-right">
                          <div className="text-white font-medium">
                            {calculatePrice(tier.basePrice, pageTier.monthlyCost)}/mo
                          </div>
                          <div className="text-xs text-white/60">
                            Setup: {calculateSetup(tier.baseSetup, pageTier.setupCost)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            ))}
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