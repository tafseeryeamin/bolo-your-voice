import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // Load Cal.com script
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // Initialize Cal.com
        (window as any).Cal = (window as any).Cal || function () {
          let cal = (window as any).Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            cal.loaded = true;
          }
          if (ar[0] === "init") {
            const api = function () {
              cal.q.push(arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              cal.q.push([cal.ns[namespace], ar]);
              cal.q.push([cal, ["initNamespace", namespace]]);
            } else {
              cal.q.push([cal, ar]);
            }
            return;
          }
          cal.q.push([cal, ar]);
        };

        // Initialize the booking
        (window as any).Cal("init", "bolo", { origin: "https://app.cal.com" });
        
        (window as any).Cal.ns.bolo("inline", {
          elementOrSelector: "#my-cal-inline-bolo",
          config: { layout: "month_view" },
          calLink: "tafser-yeamin-8jqc8u/bolo",
        });

        (window as any).Cal.ns.bolo("ui", {
          hideEventTypeDetails: false,
          layout: "month_view"
        });
      };

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Book a Demo</DialogTitle>
        </DialogHeader>
        <div 
          style={{ width: '100%', height: '600px', overflow: 'scroll' }} 
          id="my-cal-inline-bolo"
        />
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;