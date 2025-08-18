import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Network, Users, Shield } from "lucide-react";
const DeploymentSection = () => {
  const features = [{
    title: "Display Branded Call ID",
    description: "Enable Retell AI's Branded Call feature to unlock new levels of customer trust and satisfaction for outbound call operations.",
    icon: Smartphone,
    delay: "0s",
    mockup: "phone"
  }, {
    title: "Using SIP Trunking Connect to Any Telephony",
    description: "Use your existing phone numbers or your familiar VOIP providers. You can connect to any telephony using Retell SIP Trunking.",
    icon: Network,
    delay: "0.2s",
    mockup: "providers"
  }, {
    title: "Batch Calling",
    description: "Effortlessly run batch call campaigns without concurrency limits, with detailed conversation tracking available after each campaign.",
    icon: Users,
    delay: "0.4s",
    mockup: "dashboard"
  }, {
    title: "Verified Phone Numbers",
    description: "Build and maintain trust with customers with verified phone numbers that prevent your calls being labeled as spam.",
    icon: Shield,
    delay: "0.6s",
    mockup: "verified"
  }];
  return;
};
export default DeploymentSection;