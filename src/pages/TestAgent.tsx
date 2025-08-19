import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Settings, Phone, PhoneOff } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TestAgent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentName, setAgentName] = useState<string>("Your Agent");
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<string>("Ready to test");

  useEffect(() => {
    const id = searchParams.get('agent_id');
    const name = searchParams.get('agent_name');
    if (id) {
      setAgentId(id);
      if (name) setAgentName(decodeURIComponent(name));
    }
  }, [searchParams]);

  const startTestCall = async () => {
    if (!agentId) {
      toast({
        title: "Error",
        description: "No agent ID found",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCallActive(true);
      setCallStatus("Initiating call...");

      const { data, error } = await supabase.functions.invoke('create-retell-call', {
        body: { agent_id: agentId }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setCallStatus("Call connected - Speak now!");
        toast({
          title: "Call Started",
          description: "Your test call is now active. Start speaking!",
        });
      } else {
        throw new Error(data.error || "Failed to start call");
      }
    } catch (error) {
      console.error("Error starting test call:", error);
      setIsCallActive(false);
      setCallStatus("Ready to test");
      toast({
        title: "Error",
        description: `Failed to start test call: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallStatus("Call ended");
    toast({
      title: "Call Ended",
      description: "Test call has been terminated.",
    });
    
    // Reset status after a delay
    setTimeout(() => {
      setCallStatus("Ready to test");
    }, 2000);
  };

  const goToConfiguration = () => {
    if (agentId) {
      navigate(`/agent-config?agent_id=${agentId}&agent_name=${encodeURIComponent(agentName)}`);
    } else {
      navigate('/agent-config');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 max-w-4xl pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Test Your Agent</h1>
          <p className="text-xl text-muted-foreground mb-2">{agentName}</p>
          {agentId && (
            <p className="text-sm text-muted-foreground">Agent ID: {agentId}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Voice Testing
              </CardTitle>
              <CardDescription>
                Test your AI voice agent with real-time conversation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mic className={`w-12 h-12 ${isCallActive ? 'text-green-500 animate-pulse' : 'text-primary'}`} />
                </div>
                <p className="text-lg font-medium mb-2">{callStatus}</p>
                {!isCallActive ? (
                  <Button onClick={startTestCall} size="lg" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Start Test Call
                  </Button>
                ) : (
                  <Button onClick={endCall} variant="destructive" size="lg" className="w-full">
                    <PhoneOff className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuration
              </CardTitle>
              <CardDescription>
                Modify your agent's settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Adjust voice settings, prompts, and other configuration options for your agent.
                </p>
                <Button onClick={goToConfiguration} variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-1">Start Call</h3>
                  <p className="text-sm text-muted-foreground">Click the "Start Test Call" button to initiate a conversation</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-1">Speak</h3>
                  <p className="text-sm text-muted-foreground">Talk naturally to your AI agent and test its responses</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-1">Configure</h3>
                  <p className="text-sm text-muted-foreground">Adjust settings based on your testing experience</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestAgent;