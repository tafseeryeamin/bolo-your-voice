import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
const CTASection = () => {
  return <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
          Ready to Transform Your Voice Presence?
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already using Bolo AI to create meaningful voice connections with their audience.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            <Mail className="w-5 h-5 mr-2" />
            Contact Sales
          </Button>
        </div>
      </div>
    </section>;
};
export default CTASection;