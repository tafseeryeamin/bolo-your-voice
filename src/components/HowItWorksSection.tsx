import { motion, useScroll, useTransform } from "framer-motion";
import { User, MessageCircle, Calendar, HelpCircle, Headphones, ShoppingCart, Mail, Bell, ArrowDown, Zap, Target, Users } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useRef } from "react";

const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.2"]
  });

  const flowSteps = [
    {
      id: 1,
      title: "Visitor Arrives",
      description: "Website visitor lands on your page looking for solutions",
      icon: Users,
      tooltip: "Your potential customers discover your website through search, ads, or referrals",
      color: "from-blue-400 to-blue-600",
      position: { x: 0, y: 0 }
    },
    {
      id: 2,
      title: "Click to Talk",
      description: "Visitor clicks the AI chat button",
      icon: MessageCircle,
      tooltip: "One-click access to your AI Sales Assistant - no forms, no waiting",
      color: "from-green-400 to-green-600",
      position: { x: 0, y: 200 }
    },
    {
      id: 3,
      title: "AI Offers Options",
      description: "AI presents 3 helpful pathways",
      icon: Target,
      tooltip: "Smart routing based on visitor intent and behavior patterns",
      color: "from-purple-400 to-purple-600",
      position: { x: 0, y: 400 },
      options: [
        { icon: Calendar, label: "Book Appointment", color: "text-blue-500", bgColor: "bg-blue-50" },
        { icon: HelpCircle, label: "Get Answers", color: "text-green-500", bgColor: "bg-green-50" },
        { icon: ShoppingCart, label: "Buy Now", color: "text-purple-500", bgColor: "bg-purple-50" }
      ]
    },
    {
      id: 4,
      title: "Collect Contact",
      description: "AI captures email for follow-up",
      icon: Mail,
      tooltip: "Seamless contact collection with high conversion rates",
      color: "from-orange-400 to-orange-600",
      position: { x: 0, y: 600 }
    },
    {
      id: 5,
      title: "Smart Follow-up",
      description: "Automated reminders & nurturing",
      icon: Bell,
      tooltip: "Intelligent follow-up sequences to convert leads into customers",
      color: "from-pink-400 to-pink-600",
      position: { x: 0, y: 800 }
    }
  ];

  // Transform scroll progress to step activation
  const step1Progress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const step2Progress = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const step3Progress = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const step4Progress = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const step5Progress = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

  const progressSteps = [step1Progress, step2Progress, step3Progress, step4Progress, step5Progress];

  return (
    <section ref={sectionRef} className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            No more missing leads.
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Do you know you are just getting 1–17% of your website visitors to buy your service or product? 
            Here is a solution: we will implement an AI Sales Assistant. Check how it works.
          </p>
        </motion.div>

        {/* Interactive Flow Diagram */}
        <TooltipProvider>
          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Flow */}
            <div className="relative">
              {flowSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className="relative mb-32 last:mb-0"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <div className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Step Card */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.02, y: -5 }}
                          onMouseEnter={() => setHoveredStep(step.id)}
                          onMouseLeave={() => setHoveredStep(null)}
                          className={`
                            relative bg-card rounded-3xl p-8 shadow-xl border border-border/50
                            cursor-pointer transition-all duration-500 w-80 h-64
                            bg-gradient-to-br ${step.color} backdrop-blur-sm
                            ${hoveredStep === step.id ? 'shadow-2xl border-white/30 bg-opacity-90' : 'bg-opacity-10'}
                          `}
                        >
                          {/* Step Number */}
                          <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                            {step.id}
                          </div>

                          {/* Icon */}
                          <div className="mb-6 flex justify-center">
                            <motion.div 
                              className={`p-4 rounded-2xl backdrop-blur-sm border border-white/20 ${
                                hoveredStep === step.id ? 'bg-white/20 scale-110' : 'bg-white/10'
                              } transition-all duration-300`}
                              whileHover={{ rotate: [0, -10, 10, 0] }}
                            >
                              <step.icon className="w-10 h-10 text-white drop-shadow-lg" />
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="text-center text-white">
                            <h3 className="font-bold text-2xl mb-3 drop-shadow-md">{step.title}</h3>
                            <p className="text-white/90 leading-relaxed drop-shadow-sm">{step.description}</p>
                          </div>

                          {/* Interactive Options for step 3 */}
                          {step.options && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ 
                                opacity: hoveredStep === step.id ? 1 : 0, 
                                scale: hoveredStep === step.id ? 1 : 0.8 
                              }}
                              className="absolute -right-32 top-1/2 transform -translate-y-1/2 space-y-3"
                            >
                              {step.options.map((option, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ x: -20 }}
                                  animate={{ x: hoveredStep === step.id ? 0 : -20 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className={`flex items-center gap-3 ${option.bgColor} p-3 rounded-xl shadow-lg border border-white/20 backdrop-blur-sm min-w-48`}
                                >
                                  <option.icon className={`w-5 h-5 ${option.color}`} />
                                  <span className="text-sm font-medium">{option.label}</span>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side={index % 2 === 0 ? "right" : "left"}>
                        <p>{step.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Animated Dotted Line */}
                    {index < flowSteps.length - 1 && (
                      <div className="flex-1 relative">
                        <motion.div 
                          className="relative h-1"
                          style={{
                            background: `linear-gradient(90deg, transparent 0%, ${
                              useTransform(progressSteps[index], [0, 1], ['transparent', 'hsl(var(--primary))'])
                            } 50%, transparent 100%)`
                          }}
                        >
                          {/* Dotted line */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            {Array.from({ length: 20 }).map((_, dotIndex) => (
                              <motion.div
                                key={dotIndex}
                                className="w-2 h-2 rounded-full mx-1"
                                style={{
                                  backgroundColor: useTransform(
                                    progressSteps[index],
                                    [0, dotIndex / 20, (dotIndex + 1) / 20, 1],
                                    ['hsl(var(--muted))', 'hsl(var(--muted))', 'hsl(var(--primary))', 'hsl(var(--primary))']
                                  )
                                }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 2,
                                  delay: dotIndex * 0.1,
                                  repeat: Infinity,
                                  repeatType: "reverse"
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>

                        {/* Arrow */}
                        <motion.div
                          className="absolute right-0 top-1/2 transform -translate-y-1/2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowDown className="w-6 h-6 text-primary rotate-90" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </TooltipProvider>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to capture more leads and boost your conversion rates?
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
export default HowItWorksSection;