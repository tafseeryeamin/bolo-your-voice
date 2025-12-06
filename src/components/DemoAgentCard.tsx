import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useConversation } from "@11labs/react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface DemoAgent {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  agent_id: string | null;
}

interface DemoAgentCardProps {
  agent: DemoAgent;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

const DemoAgentCard = ({ agent, isActive, onActivate, onDeactivate }: DemoAgentCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs conversation");
      setIsConnected(true);
      setIsLoading(false);
      toast({
        title: "Connected",
        description: `Voice conversation with ${agent.title} started`,
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs conversation");
      setIsConnected(false);
      onDeactivate();
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
      });
    },
    onError: (error) => {
      console.error("ElevenLabs conversation error:", error);
      setIsLoading(false);
      setIsConnected(false);
      toast({
        title: "Error",
        description: typeof error === 'string' ? error : "An error occurred with the voice conversation",
        variant: "destructive",
      });
    },
  });

  const { isSpeaking } = conversation;

  const startConversation = useCallback(async () => {
    if (!agent.agent_id) {
      toast({
        title: "Error",
        description: "This agent is not properly configured",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    onActivate();

    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('create-eleven-web-call', {
        body: { agent_id: agent.agent_id }
      });

      if (error) throw error;

      if (!data?.signed_url) {
        throw new Error("Failed to get signed URL");
      }

      // Start the conversation
      await conversation.startSession({ signedUrl: data.signed_url });
    } catch (error) {
      console.error("Error starting conversation:", error);
      setIsLoading(false);
      onDeactivate();
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to start conversation",
        variant: "destructive",
      });
    }
  }, [agent.agent_id, agent.title, conversation, onActivate, onDeactivate, toast]);

  const endConversation = useCallback(async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  }, [conversation]);

  const handleToggleCall = () => {
    if (isConnected) {
      endConversation();
    } else if (!isLoading) {
      startConversation();
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500 border-2",
      "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl",
      isConnected 
        ? "border-voice-accent shadow-[0_0_30px_hsl(var(--voice-accent)/0.3)]" 
        : "border-border/50 hover:border-voice-accent/50",
      isSpeaking && "animate-pulse"
    )}>
      {/* Agent Image/Logo */}
      <div className="relative aspect-video bg-gradient-to-br from-voice-accent/20 to-neon-purple/20 flex items-center justify-center overflow-hidden">
        {agent.image_url ? (
          <img
            src={agent.image_url}
            alt={agent.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="p-6 rounded-full bg-voice-accent/30">
            <Mic className="w-12 h-12 text-voice-accent" />
          </div>
        )}
        
        {/* Speaking Indicator Overlay */}
        {isSpeaking && (
          <div className="absolute inset-0 bg-voice-accent/10 flex items-center justify-center">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-voice-accent rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 20}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Agent Info */}
        <div>
          <h3 className="text-xl font-bold mb-2">{agent.title}</h3>
          {agent.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {agent.description}
            </p>
          )}
        </div>

        {/* Voice Interface */}
        <div className="space-y-4">
          {/* Mic Animation */}
          <div className="flex justify-center">
            <div 
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                "bg-gradient-to-br from-voice-accent/20 to-voice-accent/40",
                "border-2 border-voice-accent/50",
                isConnected && "animate-pulse shadow-[0_0_20px_hsl(var(--voice-accent)/0.5)]",
                isLoading && "animate-spin"
              )}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-voice-accent border-t-transparent rounded-full" />
              ) : isConnected ? (
                <Mic className="w-8 h-8 text-voice-accent" />
              ) : (
                <MicOff className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Call Button */}
          <Button
            onClick={handleToggleCall}
            disabled={isLoading}
            className={cn(
              "w-full py-6 text-lg font-semibold transition-all duration-300",
              isConnected 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-voice-accent hover:bg-voice-accent/90 text-primary-foreground"
            )}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full w-5 h-5 border-2 border-white border-t-transparent mr-2" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <PhoneOff className="w-5 h-5 mr-2" />
                End Call
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Talk to {agent.title}
              </>
            )}
          </Button>

          {/* Status */}
          <p className="text-xs text-center text-muted-foreground">
            {isConnected 
              ? isSpeaking 
                ? "AI is speaking..." 
                : "Listening... speak now"
              : "Click to start voice conversation"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoAgentCard;