import { Card } from "@/components/ui/card";
import { Building2, Users, Headphones, MessageSquare, BarChart, Shield } from "lucide-react";
import websiteDemoWithLogo from "@/assets/website-demo-with-logo.jpg";
import boloLogo from "@/assets/bolo-logo.jpg";
import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import VoiceAIFeatureCard from "./VoiceAIFeatureCard";
const FeaturesSection = () => {
  const { t } = useLanguage();
  const dashboardImages = [
    { 
      src: "/lovable-uploads/152165cd-54f0-41df-bd31-9d56f6c75a38.png", 
      alt: "Analytics Dashboard",
      title: "Analytics"
    },
    { 
      src: "/lovable-uploads/a88d3dea-6669-4e2c-8ea1-378967e5b160.png", 
      alt: "Conversations Dashboard",
      title: "Conversations"
    },
    { 
      src: "/lovable-uploads/6364c4ff-8f61-4b8f-9f95-83168bcb6a04.png", 
      alt: "Conversation Details",
      title: "Details"
    },
    { 
      src: "/lovable-uploads/b47af239-03bc-4ca2-9cf3-fb190e261633.png", 
      alt: "Advanced Analytics",
      title: "Advanced Analytics"
    }
  ];

  const [selectedImage, setSelectedImage] = useState(0);

  const features = [{
    icon: Building2,
    title: t('features.companyRep.title'),
    description: t('features.companyRep.description')
  }, {
    icon: Users,
    title: t('features.personalBranding.title'),
    description: t('features.personalBranding.description')
  }, {
    icon: Headphones,
    title: t('features.availability.title'),
    description: t('features.availability.description')
  }, {
    icon: MessageSquare,
    title: t('features.conversations.title'),
    description: t('features.conversations.description')
  }, {
    icon: BarChart,
    title: t('features.analytics.title'),
    description: t('features.analytics.description')
  }, {
    icon: Shield,
    title: t('features.security.title'),
    description: t('features.security.description')
  }];
  return <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-voice-accent/30 transition-all duration-300 hover:shadow-lg group">
              <div className="w-16 h-16 rounded-full bg-voice-accent/20 flex items-center justify-center mb-6 group-hover:bg-voice-accent/30 transition-colors">
                <feature.icon className="w-8 h-8 text-voice-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>)}
        </div>

        {/* Voice AI Feature Card */}
        <VoiceAIFeatureCard />

        {/* Voice Interface Demo */}
        <div className="mt-24 text-center">
          <motion.h3 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }}>
            {t('features.customizable')}
          </motion.h3>
          
          <motion.div className="relative max-w-xl mx-auto" initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} viewport={{
          once: true
        }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img src="/lovable-uploads/c50a9cb1-a416-4e5c-8987-c2c1249f8ace.png" alt="Voice interface demo showing conversation starter" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Dashboard Overview Section */}
          <motion.div className="mt-24" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} viewport={{
          once: true
        }}>
            <h4 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
              {t('features.dashboardTitle')}
            </h4>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('features.dashboardSubtitle')}
            </p>
            
            {/* Dashboard Image Thumbnails */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {dashboardImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                    selectedImage === index 
                      ? 'border-voice-accent shadow-lg scale-105' 
                      : 'border-border/50 hover:border-voice-accent/50'
                  }`}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-20 h-16 object-cover" 
                  />
                  
                </button>
              ))}
            </div>
            
            {/* Large Preview Image */}
            <div className="flex justify-center">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-2xl max-w-4xl">
                <img 
                  src={dashboardImages[selectedImage].src} 
                  alt={dashboardImages[selectedImage].alt} 
                  className="w-full h-auto" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default FeaturesSection;