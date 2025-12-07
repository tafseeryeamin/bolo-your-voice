import { motion } from "framer-motion";

const industries = [
  "Healthcare & Medical",
  "Real Estate",
  "Legal Services",
  "Financial Services",
  "Insurance",
  "Automotive",
  "Hospitality & Hotels",
  "E-commerce",
  "Education",
  "SaaS & Technology",
  "Consulting",
  "Home Services",
  "Fitness & Wellness",
  "Dental Clinics",
  "Restaurants",
  "Travel Agencies",
  "Recruitment",
  "Beauty & Spa",
];

const markets = [
  "Lead Generation",
  "Appointment Booking",
  "Customer Support",
  "Sales Automation",
  "24/7 Availability",
  "Multilingual Support",
  "CRM Integration",
  "Email Follow-ups",
  "Website Navigation",
  "Product Recommendations",
  "FAQ Handling",
  "Reservation Systems",
];

const IndustriesScrollSection = () => {
  return (
    <section className="py-20 overflow-hidden bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-voice-accent bg-clip-text text-transparent">
            Industries We Serve
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Bolo Voice transforms customer interactions across diverse industries and markets
          </p>
        </motion.div>
      </div>

      {/* Industries Row - Scrolling Left */}
      <div className="relative mb-8">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div
          className="flex gap-4"
          animate={{ x: [0, -50 * industries.length] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {[...industries, ...industries, ...industries].map((industry, index) => (
            <div
              key={`${industry}-${index}`}
              className="flex-shrink-0 px-6 py-3 rounded-full glassmorphism border border-voice-accent/30 hover:border-voice-accent hover:bg-voice-accent/10 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-foreground/80 group-hover:text-voice-accent whitespace-nowrap font-medium transition-colors">
                {industry}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Markets Row - Scrolling Right */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div
          className="flex gap-4"
          animate={{ x: [-50 * markets.length, 0] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {[...markets, ...markets, ...markets].map((market, index) => (
            <div
              key={`${market}-${index}`}
              className="flex-shrink-0 px-6 py-3 rounded-full bg-voice-accent/10 border border-voice-accent/50 hover:bg-voice-accent/20 hover:border-voice-accent transition-all duration-300 cursor-pointer group"
            >
              <span className="text-voice-accent whitespace-nowrap font-medium group-hover:text-foreground transition-colors">
                {market}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default IndustriesScrollSection;