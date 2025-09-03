import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useConversation } from "@11labs/react";

interface ElevenLabsVoiceTesterProps {
  apiKey: string;
  agentId: string;
}

const ElevenLabsVoiceTester = ({ apiKey, agentId }: ElevenLabsVoiceTesterProps) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs conversation");
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "ElevenLabs voice conversation started",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs conversation");
      setIsConnected(false);
      setConversationId(null);
      toast({
        title: "Disconnected",
        description: "ElevenLabs voice conversation ended",
      });
    },
    onMessage: (message) => {
      console.log("Received message:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs conversation error:", error);
      toast({
        title: "Error",
        description: typeof error === 'string' ? error : "An error occurred with the voice conversation",
        variant: "destructive",
      });
    },
  });

  const startConversation = async () => {
    if (!apiKey || !agentId) {
      toast({
        title: "Error", 
        description: "API key and Agent ID are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Generate signed URL for the conversation
      const url = new URL("https://api.elevenlabs.io/v1/convai/conversation/get_signed_url");
      url.searchParams.append("agent_id", agentId);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get signed URL: ${response.statusText}`);
      }

      const data = await response.json();
      const signedUrl = data.signed_url;

      if (!signedUrl) {
        throw new Error("No signed URL received from ElevenLabs");
      }

      // Start the conversation using the signed URL
      const convId = await conversation.startSession({ signedUrl });
      setConversationId(convId);
      
      toast({
        title: "Success",
        description: "Voice conversation started successfully",
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setIsConnected(false);
      setConversationId(null);
    } catch (error) {
      console.error("Error ending conversation:", error);
      toast({
        title: "Error",
        description: "Failed to end conversation properly",
        variant: "destructive",
      });
    }
  };

  const { status, isSpeaking } = conversation;

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Voice Conversation Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-white/60">Status: </span>
            <span className={`font-medium ${status === 'connected' ? 'text-green-400' : 'text-white/80'}`}>
              {status || 'disconnected'}
            </span>
          </div>
          <div>
            <span className="text-white/60">Speaking: </span>
            <span className={`font-medium ${isSpeaking ? 'text-yellow-400' : 'text-white/80'}`}>
              {isSpeaking ? 'Yes' : 'No'}
            </span>
          </div>
          {conversationId && (
            <div className="col-span-2">
              <span className="text-white/60">Conversation ID: </span>
              <span className="text-white/80 font-mono text-xs">{conversationId}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isConnected ? (
            <Button
              onClick={startConversation}
              disabled={isLoading || !apiKey || !agentId}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full w-4 h-4 border-2 border-white border-t-transparent mr-2" />
                  Starting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Start Conversation
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={endConversation}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Conversation
            </Button>
          )}
        </div>

        {isSpeaking && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-yellow-400">
              <div className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>AI is speaking...</span>
            </div>
          </div>
        )}

        <div className="text-xs text-white/60 space-y-1">
          <p>• Make sure your microphone is enabled</p>
          <p>• Speak clearly when the conversation starts</p>
          <p>• The AI will respond with voice automatically</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsVoiceTester;