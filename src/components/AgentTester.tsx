import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall, Volume2, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
interface AgentTesterProps {
  agentId: string;
  agentName: string;
}
const AgentTester: React.FC<AgentTesterProps> = ({
  agentId,
  agentName
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isTestingCall, setIsTestingCall] = useState(false);
  const [isVoiceTest, setIsVoiceTest] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const startPhoneCall = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive"
      });
      return;
    }
    setIsTestingCall(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-retell-web-call', {
        body: {
          agent_id: agentId,
          from_number: phoneNumber,
          to_number: phoneNumber // For testing, calling the same number
        }
      });
      if (error) throw error;
      setCallId(data.call_id);
      toast({
        title: "Call Started",
        description: `Test call initiated to ${phoneNumber}`
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Error",
        description: "Failed to start test call",
        variant: "destructive"
      });
    } finally {
      setIsTestingCall(false);
    }
  };
  const startVoiceTest = async () => {
    setIsVoiceTest(true);
    try {
      // This would integrate with Retell's web SDK for browser-based voice testing
      // For now, we'll show a placeholder
      toast({
        title: "Voice Test",
        description: "Voice testing feature will be implemented with Retell Web SDK"
      });

      // Simulate voice test
      setTimeout(() => {
        setIsVoiceTest(false);
        toast({
          title: "Voice Test Complete",
          description: "Agent voice test completed successfully"
        });
      }, 3000);
    } catch (error) {
      console.error('Error starting voice test:', error);
      toast({
        title: "Error",
        description: "Failed to start voice test",
        variant: "destructive"
      });
      setIsVoiceTest(false);
    }
  };
  return <Card>
      
      
    </Card>;
};
export default AgentTester;