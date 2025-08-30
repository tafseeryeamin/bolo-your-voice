import { motion } from "framer-motion";
import { User, MessageCircle, Calendar, HelpCircle, Headphones, ShoppingCart, Mail, Bell } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const HowItWorksSection = () => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const flowSteps = [
    {
      id: 1,
      title: "Visitor Arrives",
      description: "Website visitor lands on your page looking for solutions",
      icon: User,
      tooltip: "Your potential customers discover your website through search, ads, or referrals",
      position: { x: 0, y: 0 }
    },
    {
      id: 2,
      title: "Click to Talk",
      description: "Visitor clicks the AI chat button",
      icon: MessageCircle,
      tooltip: "One-click access to your AI Sales Assistant - no forms, no waiting",
      position: { x: 200, y: 0 }
    },
    {
      id: 3,
      title: "AI Offers Options",
      description: "AI presents 3 helpful pathways",
      icon: HelpCircle,
      tooltip: "Smart routing based on visitor intent and behavior patterns",
      position: { x: 400, y: 0 },
      options: [
        { icon: Calendar, label: "Book Appointment", color: "text-blue-500" },
        { icon: HelpCircle, label: "Get Answers", color: "text-green-500" },
        { icon: ShoppingCart, label: "Buy Now", color: "text-purple-500" }
      ]
    },
    {
      id: 4,
      title: "Collect Contact",
      description: "AI captures email for follow-up",
      icon: Mail,
      tooltip: "Seamless contact collection with high conversion rates",
      position: { x: 600, y: 0 }
    },
    {
      id: 5,
      title: "Smart Follow-up",
      description: "Automated reminders & nurturing",
      icon: Bell,
      tooltip: "Intelligent follow-up sequences to convert leads into customers",
      position: { x: 800, y: 0 }
    }
  ];

  const arrows = [
    { from: 0, to: 1, delay: 0.5 },
    { from: 1, to: 2, delay: 1.0 },
    { from: 2, to: 3, delay: 1.5 },
    { from: 3, to: 4, delay: 2.0 }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10 overflow-hidden">
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

        {/* Flow Diagram */}
        <TooltipProvider>
          <div className="relative max-w-6xl mx-auto">
            {/* Flow Steps */}
            <div className="flex justify-between items-start relative">
              {flowSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col items-center relative z-10"
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          relative bg-card rounded-2xl p-6 shadow-lg border border-border/50
                          cursor-pointer transition-all duration-300 w-48 h-56
                          ${hoveredStep === step.id ? 'shadow-xl border-primary/50 bg-primary/5' : ''}
                        `}
                      >
                        {/* Step Number */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          {step.id}
                        </div>

                        {/* Icon */}
                        <div className="mb-4 flex justify-center">
                          <div className={`p-3 rounded-xl ${hoveredStep === step.id ? 'bg-primary/10' : 'bg-secondary/50'} transition-colors`}>
                            <step.icon className={`w-8 h-8 ${hoveredStep === step.id ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                          <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                        </div>

                        {/* Options for step 3 */}
                        {step.options && hoveredStep === step.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-popover border rounded-lg p-3 shadow-lg z-20 w-56"
                          >
                            {step.options.map((option, idx) => (
                              <div key={idx} className="flex items-center gap-2 py-1">
                                <option.icon className={`w-4 h-4 ${option.color}`} />
                                <span className="text-sm">{option.label}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{step.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </div>

            {/* Animated Arrows */}
            <div className="absolute top-20 left-0 w-full h-2 flex items-center justify-between px-24">
              {arrows.map((arrow, index) => (
                <motion.div
                  key={index}
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: arrow.delay }}
                  className="flex-1 relative mx-4"
                  style={{ originX: 0 }}
                >
                  <div className="h-0.5 bg-gradient-to-r from-primary/50 to-primary relative">
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: arrow.delay + 0.3 }}
                      className="absolute -right-1 top-1/2 transform -translate-y-1/2"
                    >
                      <div className="w-0 h-0 border-l-[6px] border-l-primary border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent" />
                    </motion.div>
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
          >
            Start Your Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
export default HowItWorksSection;