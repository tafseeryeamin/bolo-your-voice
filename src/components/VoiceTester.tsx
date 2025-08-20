import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceTesterProps {
  agentId: string;
  agentName: string;
}

const VoiceTester: React.FC<VoiceTesterProps> = ({ agentId, agentName }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const { toast } = useToast();
  const websocketRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startVoiceTest = async () => {
    try {
      // Create a web call using Retell API
      const { data, error } = await supabase.functions.invoke('create-retell-web-call', {
        body: {
          agent_id: agentId
        }
      });

      if (error) throw error;

      const { access_token, call_id } = data;
      setCallId(call_id);

      // Initialize WebSocket connection to Retell
      const ws = new WebSocket(`wss://api.retellai.com/audio-websocket/${call_id}`);

      ws.onopen = () => {
        console.log('Connected to Retell voice service');
        setIsConnected(true);
        toast({
          title: "Connected",
          description: "Voice test session started",
        });
        startMicrophone();
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data);
        
        if (data.type === 'audio') {
          // Play audio response
          playAudio(data.data);
          setIsSpeaking(true);
        } else if (data.type === 'audio_end') {
          setIsSpeaking(false);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from Retell');
        setIsConnected(false);
        setIsMicActive(false);
        setIsSpeaking(false);
        stopMicrophone();
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service",
          variant: "destructive",
        });
      };

      websocketRef.current = ws;

    } catch (error) {
      console.error('Error starting voice test:', error);
      toast({
        title: "Error",
        description: "Failed to start voice test",
        variant: "destructive",
      });
    }
  };

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;
      setIsMicActive(true);

      // Set up audio processing
      const audioContext = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const audioData = encodeAudioData(inputData);
          
          websocketRef.current.send(JSON.stringify({
            type: 'audio',
            data: audioData
          }));
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsMicActive(false);
  };

  const endVoiceTest = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    stopMicrophone();
    setIsConnected(false);
    setCallId(null);
    
    toast({
      title: "Session Ended",
      description: "Voice test session ended",
    });
  };

  const encodeAudioData = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  };

  const playAudio = (audioData: string) => {
    try {
      const binaryString = atob(audioData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const audioContext = new AudioContext();
      const audioBuffer = audioContext.createBuffer(1, bytes.length / 2, 24000);
      const channelData = audioBuffer.getChannelData(0);

      for (let i = 0; i < channelData.length; i++) {
        const sample = (bytes[i * 2] | (bytes[i * 2 + 1] << 8)) / 32768;
        channelData[i] = sample;
      }

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      stopMicrophone();
    };
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <Volume2 className="w-5 h-5 text-voice-accent mr-2" />
        <CardTitle>Test Your Voice Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Agent: {agentName}</Badge>
              {isConnected && (
                <Badge variant="default" className="bg-green-500">
                  Connected
                </Badge>
              )}
              {isSpeaking && (
                <Badge variant="outline" className="animate-pulse">
                  AI Speaking
                </Badge>
              )}
            </div>
            {callId && (
              <span className="text-xs text-muted-foreground">
                Call ID: {callId}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          {!isConnected ? (
            <Button 
              onClick={startVoiceTest}
              className="flex items-center space-x-2 bg-voice-accent hover:bg-voice-muted"
              size="lg"
            >
              <Mic className="w-5 h-5" />
              <span>Start Voice Test</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isMicActive ? (
                  <Mic className="w-5 h-5 text-green-500" />
                ) : (
                  <MicOff className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm">
                  {isMicActive ? "Microphone Active" : "Microphone Off"}
                </span>
              </div>
              
              <Button 
                onClick={endVoiceTest}
                variant="destructive"
                size="lg"
              >
                End Test
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>💡 <span className="font-medium">Voice Test Instructions:</span></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Click "Start Voice Test" to begin the conversation</li>
            <li>Speak naturally when your microphone is active</li>
            <li>The AI will respond with voice audio</li>
            <li>Test different conversation scenarios</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceTester;