import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceInterfaceProps {
  className?: string;
}

const VoiceInterface = ({ className }: VoiceInterfaceProps) => {
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio analysis
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyzerRef.current);
      
      analyzerRef.current.fftSize = 256;
      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      const analyzeAudio = () => {
        if (analyzerRef.current && isListening) {
          analyzerRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
          setAudioLevel(average / 255); // Normalize to 0-1
          animationRef.current = requestAnimationFrame(analyzeAudio);
        }
      };

      setIsListening(true);
      mediaRecorderRef.current.start();
      analyzeAudio();

    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setAudioLevel(0);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const handleTestBolo = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const getMicScale = () => {
    if (!isListening) return 1;
    return 1 + (audioLevel * 0.5); // Scale from 1 to 1.5 based on audio level
  };

  const getMicGlow = () => {
    if (!isListening) return '0 0 20px hsl(var(--voice-accent) / 0.3)';
    const intensity = 0.3 + (audioLevel * 0.7); // Glow from 0.3 to 1.0 opacity
    return `0 0 ${20 + (audioLevel * 30)}px hsl(var(--voice-accent) / ${intensity})`;
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
            isListening && "animate-pulse-glow"
          )}
          style={{
            transform: `scale(${getMicScale()})`,
            boxShadow: getMicGlow(),
          }}
        >
          {isListening ? (
            <Mic className="w-12 h-12 text-voice-accent" />
          ) : (
            <MicOff className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        {/* Audio Level Rings */}
        {isListening && (
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
        size="lg"
        className={cn(
          "px-8 py-3 text-lg font-semibold transition-all duration-300",
          "bg-gradient-to-r from-voice-accent/80 to-voice-accent",
          "hover:from-voice-accent to-voice-accent/90",
          "text-primary-foreground border-0",
          "hover:scale-105 hover:shadow-lg",
          isListening && "animate-pulse-glow"
        )}
      >
        {isListening ? "Stop Listening" : "Test Bolo"}
      </Button>

      {/* Status Text */}
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        {isListening 
          ? "Listening... Speak now to test Bolo AI" 
          : "Click 'Test Bolo' to start voice interaction"
        }
      </p>

      {/* Audio Level Indicator */}
      {isListening && (
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