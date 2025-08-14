import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";
const CTASection = () => {
  return <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        
        
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