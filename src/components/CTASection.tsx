import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/10 to-voice-accent/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Stop Losing Leads and Start Converting?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join forward-thinking companies using Bolo's AI voice solutions to capture more leads, engage customers, and stay ahead of the competition.
        </p>
        <Button size="lg" data-cal-link="tafser-yeamin-8jqc8u/bolo" data-cal-namespace="bolo" data-cal-config='{"layout":"month_view"}'>
          <Mail className="w-5 h-5 mr-2" />
          Get Started Today
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
};
export default CTASection;