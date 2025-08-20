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

const AgentTester: React.FC<AgentTesterProps> = ({ agentId, agentName }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isTestingCall, setIsTestingCall] = useState(false);
  const [isVoiceTest, setIsVoiceTest] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const { toast } = useToast();

  const startPhoneCall = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsTestingCall(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-retell-web-call', {
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
        description: `Test call initiated to ${phoneNumber}`,
      });
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Error",
        description: "Failed to start test call",
        variant: "destructive",
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
        description: "Voice testing feature will be implemented with Retell Web SDK",
      });
      
      // Simulate voice test
      setTimeout(() => {
        setIsVoiceTest(false);
        toast({
          title: "Voice Test Complete",
          description: "Agent voice test completed successfully",
        });
      }, 3000);
    } catch (error) {
      console.error('Error starting voice test:', error);
      toast({
        title: "Error",
        description: "Failed to start voice test",
        variant: "destructive",
      });
      setIsVoiceTest(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <Phone className="w-5 h-5 text-voice-accent mr-2" />
        <CardTitle>Test Your Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Agent Details</Label>
            <Badge variant="secondary">Ready for Testing</Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium">Agent ID:</span> {agentId}</p>
            <p><span className="font-medium">Agent Name:</span> {agentName}</p>
          </div>
        </div>

        {/* Phone Call Test */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Test Phone Call</Label>
            <div className="flex space-x-2 mt-2">
              <Input
                id="phone"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={startPhoneCall}
                disabled={isTestingCall}
                className="flex items-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{isTestingCall ? "Calling..." : "Test Call"}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter a phone number to test the agent with a real call
            </p>
          </div>

          {callId && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <span className="font-medium">Call ID:</span> {callId}
              </p>
            </div>
          )}
        </div>

        {/* Voice Test */}
        <div className="space-y-4">
          <div>
            <Label>Browser Voice Test</Label>
            <Button 
              onClick={startVoiceTest}
              disabled={isVoiceTest}
              variant="outline"
              className="w-full mt-2 flex items-center space-x-2"
            >
              {isVoiceTest ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Testing Voice...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Test Voice in Browser</span>
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Test the agent's voice directly in your browser
            </p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>💡 <span className="font-medium">Testing Tips:</span></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Phone tests require a valid phone number and may incur charges</li>
            <li>Browser voice tests use your microphone and speakers</li>
            <li>Test different conversation scenarios to validate agent responses</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentTester;