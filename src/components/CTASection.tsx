import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-voice-accent/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Bolo makes your website talk, sell, and support — all in one
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Transform visitor interactions with intelligent voice solutions that convert, engage, and delight your customers.
        </p>
        <Button 
          size="lg" 
          className="group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-voice-accent/25" 
          data-cal-link="tafser-yeamin-8jqc8u/bolo" 
          data-cal-namespace="bolo" 
          data-cal-config='{"layout":"month_view"}'
        >
          <Mail className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          Book a Demo
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </section>
  );
};
export default CTASection;