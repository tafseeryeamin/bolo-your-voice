import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { RetellWebClient } from "retell-client-js-sdk";
import { supabase } from "@/integrations/supabase/client";

interface VoiceInterfaceProps {
  className?: string;
}

const VoiceInterface = ({ className }: VoiceInterfaceProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const retellWebClientRef = useRef<RetellWebClient | null>(null);
  const { toast } = useToast();

  const AGENT_ID = "agent_d313b6aafa5f9cd6fc6b4eac4d";

  // Initialize Retell client
  useEffect(() => {
    retellWebClientRef.current = new RetellWebClient();
    
    const client = retellWebClientRef.current;

    // Set up event listeners
    client.on("call_started", () => {
      console.log("Call started");
      setIsCallActive(true);
      setIsConnecting(false);
      toast({
        title: "Call Started",
        description: "Voice call is now active",
      });
    });

    client.on("call_ended", () => {
      console.log("Call ended");
      setIsCallActive(false);
      setIsConnecting(false);
      setAudioLevel(0);
      toast({
        title: "Call Ended",
        description: "Voice call has been terminated",
      });
    });

    client.on("agent_start_talking", () => {
      console.log("Agent started talking");
      setAudioLevel(0.8);
    });

    client.on("agent_stop_talking", () => {
      console.log("Agent stopped talking");
      setAudioLevel(0);
    });

    client.on("update", (update) => {
      console.log("Call update:", update);
      // Handle transcript updates if needed
    });

    client.on("metadata", (metadata) => {
      console.log("Call metadata:", metadata);
    });

    client.on("error", (error) => {
      console.error("Retell error:", error);
      setIsCallActive(false);
      setIsConnecting(false);
      setAudioLevel(0);
      toast({
        title: "Call Error",
        description: error.message || "An error occurred during the call",
        variant: "destructive",
      });
    });

    return () => {
      if (client) {
        client.stopCall();
      }
    };
  }, [toast]);

  const startCall = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      // Call our Supabase edge function to create web call
      const { data, error } = await supabase.functions.invoke('create-retell-call', {
        body: { agent_id: AGENT_ID }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.access_token) {
        throw new Error('Failed to get access token from server');
      }

      console.log('Starting call with access token...');
      
      // Start the call with Retell
      await retellWebClientRef.current?.startCall({
        accessToken: data.access_token,
        sampleRate: 24000,
        captureDeviceId: "default",
        playbackDeviceId: "default",
      });

    } catch (error) {
      console.error('Error starting call:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to start voice call',
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCall = useCallback(() => {
    if (retellWebClientRef.current) {
      retellWebClientRef.current.stopCall();
    }
  }, []);

  const handleTestBolo = useCallback(() => {
    if (isCallActive) {
      stopCall();
    } else if (!isConnecting) {
      startCall();
    }
  }, [isCallActive, isConnecting, startCall, stopCall]);

  const getMicScale = () => {
    if (isConnecting) return 1.1;
    if (isCallActive) return 1 + (audioLevel * 0.5);
    return 1;
  };

  const getMicGlow = () => {
    if (isConnecting) return "0 0 20px hsl(var(--voice-accent) / 0.5)";
    if (isCallActive && audioLevel > 0) {
      return `0 0 ${20 + audioLevel * 30}px hsl(var(--voice-accent) / ${0.3 + audioLevel * 0.7})`;
    }
    return "0 0 20px hsl(var(--voice-accent) / 0.3)";
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-8", className)}>
      {/* Microphone Icon */}
      <div className="relative">
        <div 
          className={cn(
            "w-32 h-32 rounded-full bg-gradient-to-br from-voice-accent/20 to-voice-accent/40",
            "flex items-center justify-center transition-all duration-200 ease-out",
            "border-2 border-voice-accent/50",
            (isCallActive || isConnecting) && "animate-pulse-glow"
          )}
          style={{
            transform: `scale(${getMicScale()})`,
            boxShadow: getMicGlow(),
          }}
         >
           {isConnecting ? (
             <div className="w-6 h-6 border-2 border-voice-accent border-t-transparent rounded-full animate-spin" />
           ) : isCallActive ? (
             <Mic className="w-12 h-12 text-voice-accent" />
           ) : (
             <MicOff className="w-12 h-12 text-muted-foreground" />
           )}
        </div>

        {/* Audio Level Rings */}
        {isCallActive && (
          <>
            <div 
              className="absolute inset-0 rounded-full border-2 border-voice-accent/30 animate-ping"
              style={{
                animationDuration: `${2 - audioLevel}s`,
                transform: `scale(${1.2 + audioLevel * 0.3})`,
              }}
            />
            <div 
              className="absolute inset-0 rounded-full border border-voice-accent/20 animate-ping"
              style={{
                animationDuration: `${2.5 - audioLevel}s`,
                animationDelay: '0.5s',
                transform: `scale(${1.4 + audioLevel * 0.4})`,
              }}
            />
          </>
        )}
      </div>

      {/* Test Bolo Button */}
      <Button
        onClick={handleTestBolo}
        disabled={isConnecting}
        size="lg"
        className={cn(
          "px-8 py-3 text-lg font-semibold transition-all duration-300",
          "bg-gradient-to-r from-voice-accent/80 to-voice-accent",
          "hover:from-voice-accent to-voice-accent/90",
          "text-primary-foreground border-0",
          "hover:scale-105 hover:shadow-lg",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          (isCallActive || isConnecting) && "animate-pulse-glow"
        )}
      >
        {isConnecting ? "Connecting..." : isCallActive ? "End Call" : "Test Bolo"}
      </Button>

      {/* Status Text */}
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {isConnecting 
          ? "Connecting to voice assistant..." 
          : isCallActive 
          ? "Voice call active - Speak to interact with Bolo AI" 
          : "Click 'Test Bolo' to start voice interaction"
        }
      </p>

      {/* Audio Level Indicator */}
      {isCallActive && (
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-voice-accent/60 to-voice-accent transition-all duration-100"
            style={{ width: `${audioLevel * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;