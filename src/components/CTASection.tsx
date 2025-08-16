import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-voice-accent/5">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
          Ready to Transform Your Business?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already using AI voice technology to enhance customer experience and drive growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-voice-accent hover:from-primary/90 hover:to-voice-accent/90">
            Get Started Today
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button variant="outline" size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};
export default CTASection;