import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, ArrowLeft, Phone, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
import { useConversation } from "@11labs/react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  agent_id: string | null;
}

const PortfolioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setIsConnecting(false);
      toast({
        title: "Connected",
        description: "You can now speak with the AI agent",
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsConnecting(false);
    },
    onMessage: (message) => {
      console.log('Received message:', message);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setIsConnecting(false);
      toast({
        title: 'Error',
        description: typeof error === 'string' ? error : 'Failed to connect to voice AI',
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (id) {
      fetchPortfolioItem();
    }
  }, [id]);

  const fetchPortfolioItem = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_posts')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      
      if (!data) {
        toast({
          title: "Not Found",
          description: "Portfolio item not found",
          variant: "destructive",
        });
        navigate('/portfolio');
        return;
      }

      setItem(data);
    } catch (error) {
      console.error('Error fetching portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio item",
        variant: "destructive",
      });
      navigate('/portfolio');
    } finally {
      setLoading(false);
    }
  };

  const startConversation = async () => {
    if (!item?.agent_id) {
      toast({
        title: "Error",
        description: "No agent ID configured for this portfolio item",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      console.log('Starting conversation...');

      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

      const { data, error } = await supabase.functions.invoke('start-voice-conversation', {
        body: { agent_id: item.agent_id },
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }
      
      if (!data?.signed_url) {
        console.error('No signed URL in response:', data);
        throw new Error('No signed URL received from server');
      }

      console.log('Starting session with signed URL:', data.signed_url);

      const conversationId = await conversation.startSession({
        signedUrl: data.signed_url,
      });

      console.log('Conversation started with ID:', conversationId);
    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsConnecting(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const endConversation = async () => {
    console.log('Ending conversation...');
    await conversation.endSession();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return null;
  }

  const isConnected = conversation.status === 'connected';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/portfolio')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portfolio
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border-2 border-border/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
            
            <div className="relative p-12 text-center">
              {/* Logo */}
              {item.image_url && (
                <motion.div
                  className="mb-8 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div className="w-24 h-24 rounded-full bg-background/50 backdrop-blur-sm p-4 shadow-lg">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>
              )}

              {/* Microphone Visualization */}
              <div className="relative mb-8 flex justify-center">
                <motion.div
                  animate={{
                    scale: isConnected ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isConnected ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  {/* Pulsing rings */}
                  {isConnected && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-primary/30"
                      />
                      <motion.div
                        animate={{ scale: [1, 2.5, 2.5], opacity: [0.3, 0, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                        className="absolute inset-0 rounded-full bg-primary/20"
                      />
                    </>
                  )}
                  
                  {/* Microphone icon */}
                  <div className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                    isConnected 
                      ? 'bg-primary text-primary-foreground shadow-[0_0_40px_rgba(99,102,241,0.5)]' 
                      : 'bg-primary/10 text-primary border-2 border-primary/20'
                  } transition-all duration-300`}>
                    <Mic className="w-12 h-12" />
                  </div>
                </motion.div>
              </div>

              {/* Title and Description */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                {isConnected ? "Connected" : `Hi there,`}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                {isConnected ? `Speak with ${item.title}` : "How can we help?"}
              </p>

              {item.description && !isConnected && (
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  {item.description}
                </p>
              )}

              {/* Action Button */}
              {!isConnected ? (
                <Button
                  onClick={startConversation}
                  disabled={isConnecting}
                  size="lg"
                  className="w-full text-lg py-6 bg-card hover:bg-card/80 text-foreground border-2 border-border/50 hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      Start a conversation
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={endConversation}
                  variant="destructive"
                  size="lg"
                  className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  End Call
                </Button>
              )}

              {/* Status */}
              {isConnected && conversation.isSpeaking && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-primary mt-4 font-medium"
                >
                  AI is speaking...
                </motion.p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="p-6 flex justify-center gap-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center text-muted-foreground">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Home</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center text-muted-foreground">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Messages</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;
