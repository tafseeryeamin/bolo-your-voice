import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
const CTASection = () => {
  return <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-voice-accent/10 border border-voice-accent/20 backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join forward-thinking companies and professionals who are already using Bolo to create meaningful voice connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="voice" size="lg" className="text-lg px-8 py-6">
              Start Integration
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Quick setup • 24/7 support
          </p>
        </div>
      </div>
    </section>;
};
export default CTASection;