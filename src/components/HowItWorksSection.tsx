import { motion, useScroll, useTransform } from "framer-motion";
import { User, MessageCircle, Calendar, HelpCircle, Headphones, ShoppingCart, Mail, Bell, ArrowDown, Zap, Target, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
const HowItWorksSection = () => {
  const { t } = useLanguage();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"]
  });
  const flowSteps = [{
    id: 1,
    title: t('howItWorks.step1.title'),
    description: t('howItWorks.step1.description'),
    icon: Users,
    tooltip: "Your potential customers discover your website through search, ads, or referrals",
    color: "from-blue-400 to-blue-600",
    position: {
      x: 0,
      y: 0
    }
  }, {
    id: 2,
    title: t('howItWorks.step2.title'),
    description: t('howItWorks.step2.description'),
    icon: MessageCircle,
    tooltip: "One-click access to your AI Sales Assistant - no forms, no waiting",
    color: "from-green-400 to-green-600",
    position: {
      x: 0,
      y: 200
    }
  }, {
    id: 3,
    title: t('howItWorks.step3.title'),
    description: t('howItWorks.step3.description'),
    icon: Target,
    tooltip: "Smart routing based on visitor intent and behavior patterns",
    color: "from-purple-400 to-purple-600",
    position: {
      x: 0,
      y: 400
    },
    options: [{
      icon: Calendar,
      label: "Book Appointment",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    }, {
      icon: HelpCircle,
      label: "Get Answers",
      color: "text-green-500",
      bgColor: "bg-green-50"
    }, {
      icon: ShoppingCart,
      label: "Buy Now",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }]
  }, {
    id: 4,
    title: t('howItWorks.step4.title'),
    description: t('howItWorks.step4.description'),
    icon: Mail,
    tooltip: "Seamless contact collection with high conversion rates",
    color: "from-orange-400 to-orange-600",
    position: {
      x: 0,
      y: 600
    }
  }, {
    id: 5,
    title: t('howItWorks.step5.title'),
    description: t('howItWorks.step5.description'),
    icon: Bell,
    tooltip: "Intelligent follow-up sequences to convert leads into customers",
    color: "from-pink-400 to-pink-600",
    position: {
      x: 0,
      y: 800
    }
  }];

  // Transform scroll progress to step activation
  const step1Progress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const step2Progress = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const step3Progress = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const step4Progress = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const step5Progress = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const progressSteps = [step1Progress, step2Progress, step3Progress, step4Progress, step5Progress];
  return (
    <section ref={sectionRef} className="py-24 px-4 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-voice-accent/10 text-voice-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            {t('howItWorks.badge')}
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-voice-accent to-neon-cyan bg-clip-text text-transparent">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('howItWorks.subtitle')}
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {flowSteps.slice(0, 3).map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-voice-accent to-neon-cyan text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                {step.id}
              </div>
              
              {/* Card */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 h-full group hover:border-voice-accent/30">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-voice-accent/10 to-neon-cyan/10 group-hover:from-voice-accent/20 group-hover:to-neon-cyan/20 transition-all duration-300">
                    <step.icon className="w-8 h-8 text-voice-accent" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-4 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>
                  
                  {/* Options for step 3 */}
                  {step.options && (
                    <div className="space-y-3">
                      {step.options.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl">
                          <option.icon className={`w-5 h-5 ${option.color}`} />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Arrow */}
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 text-primary/60"
                  >
                    <ArrowDown className="w-full h-full rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Follow-up Steps */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {flowSteps.slice(3).map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-voice-accent to-neon-cyan text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg z-10">
                {step.id}
              </div>
              
              {/* Card */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 h-full group hover:border-voice-accent/30">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-voice-accent/10 to-neon-cyan/10 group-hover:from-voice-accent/20 group-hover:to-neon-cyan/20 transition-all duration-300">
                    <step.icon className="w-8 h-8 text-voice-accent" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-4 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              {/* Arrow */}
              {index === 0 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 transform -translate-y-1/2">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 text-voice-accent/60"
                  >
                    <ArrowDown className="w-full h-full rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center bg-gradient-to-r from-voice-accent/5 to-neon-cyan/5 rounded-3xl p-12 border border-border/30"
        >
          <h3 className="text-3xl font-bold mb-6 text-foreground">{t('howItWorks.result.title')}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-voice-accent mb-2">30%+</div>
              <p className="text-muted-foreground">{t('howItWorks.result.conversion')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-neon-cyan mb-2">24/7</div>
              <p className="text-muted-foreground">{t('howItWorks.result.availability')}</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-voice-accent/80 mb-2">0</div>
              <p className="text-muted-foreground">{t('howItWorks.result.missed')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default HowItWorksSection;