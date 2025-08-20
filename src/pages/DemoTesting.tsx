import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, TestTube, Play, Square } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DemoTesting = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/signin");
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDemo = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setIsConnecting(false);
      
      toast({
        title: "Demo Started",
        description: "Voice agent demo is now active! This is a simulated demonstration.",
      });

      // Simulate conversation ending after 30 seconds
      setTimeout(() => {
        if (isConnected) {
          handleStopDemo();
        }
      }, 30000);

    } catch (error) {
      console.error("Error starting demo:", error);
      setIsConnecting(false);
      toast({
        title: "Demo Failed",
        description: "Failed to start demo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopDemo = () => {
    setIsConnected(false);
    setIsConnecting(false);
    
    toast({
      title: "Demo Ended",
      description: "Voice agent demo has ended.",
    });
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <TestTube className="w-8 h-8 mr-3 text-primary" />
            Voice Agent Demo
          </h1>
          <p className="text-muted-foreground">Experience our voice AI technology with this interactive demonstration.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mic className="w-5 h-5 mr-2 text-voice-accent" />
              Interactive Voice Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <div className="flex flex-col items-center space-y-6">
              {/* Large Interactive Microphone */}
              <div className="relative">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isConnected 
                    ? 'bg-green-500/20 border-4 border-green-500 shadow-lg shadow-green-500/30' 
                    : isConnecting 
                      ? 'bg-yellow-500/20 border-4 border-yellow-500 animate-pulse'
                      : 'bg-primary/10 border-4 border-primary/30 hover:bg-primary/20 hover:border-primary/50'
                }`}>
                  {isConnected ? (
                    <Mic className="w-16 h-16 text-green-600 animate-pulse" />
                  ) : isConnecting ? (
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600"></div>
                  ) : (
                    <Play className="w-16 h-16 text-primary" />
                  )}
                </div>
                
                {/* Status Indicator */}
                {isConnected && (
                  <div className="absolute -top-3 -right-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse flex items-center justify-center shadow-lg">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
                
                {/* Audio Level Rings */}
                {isConnected && (
                  <>
                    <div className="absolute inset-0 border-2 border-green-500/40 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 border-2 border-green-500/30 rounded-full animate-ping animation-delay-200"></div>
                  </>
                )}
              </div>

              {/* Status Text */}
              <div className="text-center">
                <p className={`text-lg font-medium ${
                  isConnected ? 'text-green-600' : isConnecting ? 'text-yellow-600' : 'text-muted-foreground'
                }`}>
                  {isConnected ? 'Demo Active - AI is Ready!' : isConnecting ? 'Starting Demo...' : 'Ready to Start Demo'}
                </p>
                {isConnected && (
                  <p className="text-sm text-muted-foreground mt-1">
                    This is a demonstration of voice AI technology
                  </p>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col items-center space-y-4">
                {!isConnected && !isConnecting && (
                  <Button
                    onClick={handleStartDemo}
                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-medium rounded-xl shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Demo
                  </Button>
                )}

                {isConnecting && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500 mx-auto mb-3"></div>
                    <p className="text-yellow-600 font-medium">Initializing Demo...</p>
                  </div>
                )}

                {isConnected && (
                  <Button
                    onClick={handleStopDemo}
                    className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg font-medium rounded-xl shadow-lg"
                  >
                    <Square className="w-6 h-6 mr-3" />
                    Stop Demo
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Demo Information:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• This is a demonstration of our voice AI technology</li>
                <li>• The demo simulates a voice agent interaction</li>
                <li>• Click "Start Demo" to begin the simulation</li>
                <li>• Experience the user interface and flow</li>
                <li>• No microphone access required for this demo</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Ready to create your own voice agent? Configure your agent settings to get started.
            </p>
            <Button 
              onClick={() => navigate('/agent-config')}
              className="w-full"
            >
              Configure Your Agent
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoTesting;