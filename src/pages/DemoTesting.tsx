import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, TestTube, Shield } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RetellWebClient } from "retell-client-js-sdk";

const DemoTesting = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [agentId, setAgentId] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retellWebClient, setRetellWebClient] = useState<RetellWebClient | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/signin");
        return;
      }

      const { data: hasAdminRole } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (!hasAdminRole) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim() || !agentId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both API key and Agent ID.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      console.log("Creating Retell web call...");
      
      const { data, error } = await supabase.functions.invoke('create-retell-web-call', {
        body: {
          api_key: apiKey.trim(),
          agent_id: agentId.trim()
        }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Retell web call response:", data);

      // Initialize Retell Web Client
      const webClient = new RetellWebClient();
      
      // Set up event listeners
      webClient.on("conversationStarted", () => {
        console.log("Conversation started");
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Voice call started successfully!",
        });
      });

      webClient.on("conversationEnded", ({ code, reason }) => {
        console.log("Conversation ended", code, reason);
        setIsConnected(false);
        setIsConnecting(false);
        toast({
          title: "Call Ended",
          description: "Voice call has ended.",
        });
      });

      webClient.on("error", (error) => {
        console.error("Retell error:", error);
        setIsConnected(false);
        setIsConnecting(false);
        toast({
          title: "Call Error", 
          description: error.message || "An error occurred during the call.",
          variant: "destructive",
        });
      });

      webClient.on("update", (update) => {
        console.log("Call update:", update);
      });

      // Start the call
      await webClient.startCall({
        accessToken: data.access_token,
        sampleRate: data.sample_rate,
      });

      setRetellWebClient(webClient);

    } catch (error) {
      console.error("Error testing Retell call:", error);
      setIsConnecting(false);
      toast({
        title: "Test Failed",
        description: `Failed to start call: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleStopCall = async () => {
    if (retellWebClient) {
      try {
        await retellWebClient.stopCall();
        setRetellWebClient(null);
      } catch (error) {
        console.error("Error stopping call:", error);
      }
    }
    setIsConnected(false);
    setIsConnecting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <TestTube className="w-8 h-8 mr-3 text-primary" />
            Demo and Testing
          </h1>
          <p className="text-muted-foreground">Test voice calls with custom API credentials.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="w-5 h-5 mr-2 text-voice-accent" />
              Voice Call Testing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="agent-id">Agent ID</Label>
                <Input
                  id="agent-id"
                  placeholder="Enter the agent ID to test"
                  value={agentId}
                  onChange={(e) => setAgentId(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6">
              {/* Large Microphone Icon */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic className="w-12 h-12 text-primary" />
                </div>
                {isConnected && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>

              {!isConnected && !isConnecting && (
                <Button
                  onClick={handleTest}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                  disabled={!apiKey.trim() || !agentId.trim()}
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Test Call
                </Button>
              )}

              {isConnecting && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Connecting...</p>
                </div>
              )}

              {isConnected && (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-green-600 font-medium">Call Active</span>
                  </div>
                  
                  <Button
                    onClick={handleStopCall}
                    variant="destructive"
                    className="px-8 py-3"
                  >
                    <MicOff className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                </div>
              )}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Instructions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Enter your API key and Agent ID</li>
                <li>2. Click "Start Test Call" to initiate the voice call</li>
                <li>3. Allow microphone access when prompted</li>
                <li>4. Speak with the AI agent to test functionality</li>
                <li>5. Click "End Call" when finished testing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoTesting;