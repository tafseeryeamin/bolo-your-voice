import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, TestTube, Shield } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RetellWebClient } from "retell-client-js-sdk";

// Voice options organized by gender and age
const voiceOptions = {
  male: {
    young: [{
      id: "TX3LPaxmHKxFdv7VOQHJ",
      name: "Liam",
      traits: "Young, energetic, friendly"
    }, {
      id: "onwK4e9ZLuTAKqWW03F9",
      name: "Daniel",
      traits: "Young, professional, clear"
    }, {
      id: "N2lVS1w4EtoT3dr4eOWO",
      name: "Callum",
      traits: "Young, warm, conversational"
    }],
    middle: [{
      id: "CwhRBWXzGAHq8TQ4Fs17",
      name: "Roger",
      traits: "Mature, authoritative, confident"
    }, {
      id: "IKne3meq5aSn9XLyUdCD",
      name: "Charlie",
      traits: "Professional, reliable, trustworthy"
    }, {
      id: "JBFqnCBsd6RMkjVDRZzb",
      name: "George",
      traits: "Experienced, wise, calming"
    }],
    senior: [{
      id: "pqHfZKP75CvOlQylNhV4",
      name: "Bill",
      traits: "Distinguished, experienced, authoritative"
    }, {
      id: "nPczCjzI2devNBz1zQrb",
      name: "Brian",
      traits: "Mature, professional, knowledgeable"
    }, {
      id: "cjVigY5qzO86Huf0OWal",
      name: "Eric",
      traits: "Senior, experienced, wise"
    }]
  },
  female: {
    young: [{
      id: "9BWtsMINqrJLrRacOk9x",
      name: "Aria",
      traits: "Young, vibrant, enthusiastic"
    }, {
      id: "pFZP5JQG7iQjIQuC4Bku",
      name: "Lily",
      traits: "Young, sweet, friendly"
    }, {
      id: "Xb7hH8MSUJpSbSDYk0k2",
      name: "Alice",
      traits: "Young, professional, clear"
    }],
    middle: [{
      id: "EXAVITQu4vr4xnSDxMaL",
      name: "Sarah",
      traits: "Professional, confident, warm"
    }, {
      id: "FGY2WhTYpPnrIDTdsKH5",
      name: "Laura",
      traits: "Mature, trustworthy, engaging"
    }, {
      id: "cgSgspJ2msm6clMCkdW9",
      name: "Jessica",
      traits: "Professional, articulate, friendly"
    }],
    senior: [{
      id: "XB0fDUnXU5powFXDhCwa",
      name: "Charlotte",
      traits: "Distinguished, experienced, wise"
    }, {
      id: "XrExE9yKIg1WjnnlVkGX",
      name: "Matilda",
      traits: "Mature, authoritative, knowledgeable"
    }, {
      id: "SAz9YHcvj6GT2YYXdXww",
      name: "River",
      traits: "Experienced, calming, professional"
    }]
  }
};
const DemoTesting = () => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState("");
  const [agentId, setAgentId] = useState("");
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("female");
  const [selectedAge, setSelectedAge] = useState<"young" | "middle" | "senior">("middle");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retellWebClient, setRetellWebClient] = useState<RetellWebClient | null>(null);
  useEffect(() => {
    checkUserAccess();
  }, []);
  const checkUserAccess = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/signin");
        return;
      }
      setIsAdmin(true); // Allow all authenticated users
    } catch (error) {
      console.error('Error checking user access:', error);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };
  const handleTest = async () => {
    console.log("Starting handleTest function");
    if (!apiKey.trim() || !agentId.trim()) {
      console.log("Missing API key or agent ID");
      toast({
        title: "Missing Information",
        description: "Please provide both API key and Agent ID.",
        variant: "destructive"
      });
      return;
    }
    setIsConnecting(true);
    console.log("Set connecting state to true");
    try {
      console.log("Creating Retell web call with:", {
        agentId: agentId.trim()
      });
      const {
        data,
        error
      } = await supabase.functions.invoke('create-retell-web-call', {
        body: {
          api_key: apiKey.trim(),
          agent_id: agentId.trim(),
          voice_preferences: {
            gender: selectedGender,
            age: selectedAge,
            voice_id: selectedVoice,
            voice_name: selectedVoice ? voiceOptions[selectedGender][selectedAge].find(v => v.id === selectedVoice)?.name : undefined
          }
        }
      });
      console.log("Supabase function response:", {
        data,
        error
      });
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Supabase function error: ${error.message || 'Unknown error'}`);
      }
      if (data?.error) {
        console.error("API returned error:", data.error);
        throw new Error(data.error);
      }
      console.log("Retell web call response:", data);
      if (!data?.access_token) {
        console.error("No access token in response:", data);
        throw new Error("No access token received from Retell API");
      }

      // Initialize Retell Web Client
      console.log("Initializing Retell Web Client");
      const webClient = new RetellWebClient();

      // Set up event listeners
      webClient.on("conversationStarted", () => {
        console.log("Conversation started");
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Voice call started successfully!"
        });
      });
      webClient.on("conversationEnded", ({
        code,
        reason
      }) => {
        console.log("Conversation ended", code, reason);
        setIsConnected(false);
        setIsConnecting(false);
        toast({
          title: "Call Ended",
          description: "Voice call has ended."
        });
      });
      webClient.on("error", error => {
        console.error("Retell error:", error);
        setIsConnected(false);
        setIsConnecting(false);
        toast({
          title: "Call Error",
          description: error.message || "An error occurred during the call.",
          variant: "destructive"
        });
      });
      webClient.on("update", update => {
        console.log("Call update:", update);
      });

      // Start the call
      console.log("Starting call with access token:", data.access_token ? "present" : "missing");
      console.log("Sample rate:", data.sample_rate);
      await webClient.startCall({
        accessToken: data.access_token,
        sampleRate: data.sample_rate || 24000
      });
      console.log("Call started successfully");
      setRetellWebClient(webClient);
    } catch (error) {
      console.error("Error testing Retell call:", error);
      console.error("Error stack:", error.stack);
      setIsConnecting(false);
      toast({
        title: "Test Failed",
        description: `Failed to start call: ${error.message}`,
        variant: "destructive"
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
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 mr-4">
              <TestTube className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Demo & Testing</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test your voice AI agents with real-time conversations. Enter your credentials and start talking to your agent instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
                  <Mic className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="api-key" className="text-sm font-medium flex items-center">
                    🔑 Retell API Key (API Only)
                  </Label>
                  <Input id="api-key" type="password" placeholder="key_xxxxxxxxxxxxxxxx" value={apiKey} onChange={e => setApiKey(e.target.value)} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" disabled={isConnecting || isConnected} />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="agent-id" className="text-sm font-medium flex items-center">
                    🤖 Agent ID
                  </Label>
                  <Input id="agent-id" placeholder="agent_xxxxxxxxxxxxxxxx" value={agentId} onChange={e => setAgentId(e.target.value)} className="transition-all duration-200 focus:ring-2 focus:ring-primary/20" disabled={isConnecting || isConnected} />
                </div>

                

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center">
                    🎤 Voice Selection
                  </Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isConnecting || isConnected}>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceOptions[selectedGender][selectedAge].map(voice => <SelectItem key={voice.id} value={voice.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{voice.name}</span>
                            <span className="text-xs text-muted-foreground">{voice.traits}</span>
                          </div>
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                  {selectedVoice && <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                      Selected: {voiceOptions[selectedGender][selectedAge].find(v => v.id === selectedVoice)?.name} - {voiceOptions[selectedGender][selectedAge].find(v => v.id === selectedVoice)?.traits}
                    </div>}
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border-l-4 border-primary/30">
                <h4 className="font-medium text-sm mb-2 text-foreground">📋 Quick Guide</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Enter your Retell API key and Agent ID</li>
                  <li>• Click the microphone to start the call</li>
                  <li>• Allow microphone access when prompted</li>
                  <li>• Speak naturally with your AI agent</li>
                  <li>• Click to end the call when finished</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Voice Interface Panel */}
          <Card className="border-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 mr-3">
                  <Mic className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                Voice Interface
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-8 py-8">
                {/* Enhanced Microphone Design */}
                <div className="relative">
                  {/* Outer Glow Ring */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${isConnected ? 'bg-green-500/10 scale-150 animate-pulse' : isConnecting ? 'bg-yellow-500/10 scale-125 animate-pulse' : 'bg-primary/5 scale-100'}`}></div>
                  
                  {/* Middle Ring */}
                  <div className={`absolute inset-4 rounded-full border-2 transition-all duration-300 ${isConnected ? 'border-green-400/40 animate-ping' : isConnecting ? 'border-yellow-400/40 animate-ping' : 'border-primary/20'}`}></div>
                  
                  {/* Main Microphone Button */}
                  <div className={`relative w-40 h-40 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${isConnected ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30 scale-110' : isConnecting ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30 animate-pulse' : 'bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:shadow-primary/30 hover:from-primary/90 hover:to-primary'}`} onClick={!isConnected && !isConnecting ? handleTest : undefined}>
                    {/* Inner Glow */}
                    <div className="absolute inset-2 rounded-full bg-white/10"></div>
                    
                    {/* Microphone Icon */}
                    {isConnected ? <Mic className="w-16 h-16 text-white animate-pulse relative z-10" /> : isConnecting ? <Mic className="w-16 h-16 text-white relative z-10" /> : <Mic className="w-16 h-16 text-white relative z-10" />}
                    
                    {/* Connection Indicator */}
                    {isConnected && <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white animate-pulse flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>}
                  </div>
                  
                  {/* Audio Level Visualization */}
                  {isConnected && <>
                      <div className="absolute inset-0 border-2 border-green-400/30 rounded-full animate-ping animation-delay-300"></div>
                      <div className="absolute -inset-4 border-2 border-green-400/20 rounded-full animate-ping animation-delay-500"></div>
                      <div className="absolute -inset-8 border-2 border-green-400/10 rounded-full animate-ping animation-delay-700"></div>
                    </>}
                </div>

                {/* Status Display */}
                <div className="text-center space-y-4">
                  <div className={`text-xl font-semibold transition-colors duration-300 ${isConnected ? 'text-green-600 dark:text-green-400' : isConnecting ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                    {isConnected ? '🎙️ Live Conversation' : isConnecting ? '⏳ Connecting...' : '🎯 Ready to Connect'}
                  </div>
                  
                  <p className={`text-sm transition-colors duration-300 ${isConnected ? 'text-green-600/80 dark:text-green-400/80' : isConnecting ? 'text-yellow-600/80 dark:text-yellow-400/80' : 'text-muted-foreground'}`}>
                    {isConnected ? 'Speak naturally - your agent is listening' : isConnecting ? 'Establishing connection to your agent...' : 'Click the microphone to start your conversation'}
                  </p>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-col items-center space-y-4 w-full">
                  {!isConnected && !isConnecting && <Button onClick={handleTest} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" disabled={!apiKey.trim() || !agentId.trim()} size="lg">
                      <Mic className="w-5 h-5 mr-3" />
                      Start Conversation
                    </Button>}

                  {isConnecting && <div className="flex flex-col items-center space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">Connecting to agent...</span>
                      </div>
                      <Button onClick={handleStopCall} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-6 py-2 transition-all duration-200" size="sm">
                        <MicOff className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>}

                  {isConnected && <Button onClick={handleStopCall} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 text-lg font-medium rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105" size="lg">
                      <MicOff className="w-5 h-5 mr-3" />
                      End Conversation
                    </Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 animate-fade-in">
          <div className="text-center p-6 rounded-lg bg-card border border-border/50 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold mb-2">Real-time Testing</h3>
            <p className="text-sm text-muted-foreground">Test your agents with instant voice conversations and immediate feedback.</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card border border-border/50 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mic className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">High Quality Audio</h3>
            <p className="text-sm text-muted-foreground">Crystal clear audio processing with noise reduction and echo cancellation.</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card border border-border/50 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">Your API keys and conversations are secure with enterprise-grade encryption.</p>
          </div>
        </div>
      </div>
    </div>;
};
export default DemoTesting;