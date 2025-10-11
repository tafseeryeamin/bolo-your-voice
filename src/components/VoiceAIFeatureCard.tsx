import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const VoiceAIFeatureCard = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      toast({
        title: t('voiceFeatureCard.connected'),
        description: t('voiceFeatureCard.active'),
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onMessage: (message) => {
      console.log('Received message:', message);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      toast({
        title: 'Error',
        description: typeof error === 'string' ? error : 'Failed to connect to voice AI',
        variant: 'destructive',
      });
    },
  });

  const startConversation = async () => {
    try {
      setIsLoading(true);
      console.log('Starting conversation...');

      // Request microphone permissions
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

      // Get signed URL from edge function
      const { data, error } = await supabase.functions.invoke('create-eleven-web-call', {
        body: { agent_id: 'agent_7701k7945tnbe40v97yr1n9t7dq4' },
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

      console.log('Starting session with signed URL');

      // Start the conversation using the signed URL
      const conversationId = await conversation.startSession({
        signedUrl: data.signed_url,
      });

      console.log('Conversation started with ID:', conversationId);

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    console.log('Ending conversation...');
    await conversation.endSession();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      viewport={{ once: true }}
      className="mt-24"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-2 border-border/50 hover:border-voice-accent/30 transition-all duration-500 shadow-2xl hover:shadow-voice-accent/20">
        {/* Background Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-voice-accent/5 via-transparent to-voice-accent/10 pointer-events-none" />
        
        {/* Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-voice-accent/0 via-voice-accent/20 to-voice-accent/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative p-12 text-center">
          {/* Title */}
          <h3 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-foreground via-voice-accent to-foreground bg-clip-text text-transparent">
            {t('voiceFeatureCard.title')}
          </h3>

          {/* Microphone Icon */}
          <div className="relative inline-block mb-8">
            {/* Pulsing rings when active */}
            {conversation.status === 'connected' && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-voice-accent/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-voice-accent/20"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                />
              </>
            )}

            {/* Main mic container */}
            <motion.div
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                conversation.status === 'connected'
                  ? 'bg-voice-accent/30 shadow-lg shadow-voice-accent/50'
                  : 'bg-voice-accent/20 shadow-xl'
              }`}
              animate={
                conversation.isSpeaking
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                repeat: conversation.isSpeaking ? Infinity : 0,
              }}
            >
              {/* Neon border effect */}
              <div className="absolute inset-0 rounded-full border-2 border-voice-accent/50 animate-pulse" />
              
              <Mic className={`w-16 h-16 ${
                conversation.isSpeaking 
                  ? 'text-voice-accent animate-pulse' 
                  : 'text-voice-accent/80'
              }`} />
            </motion.div>
          </div>

          {/* Status Text */}
          <p className="text-lg text-muted-foreground mb-8">
            {conversation.status === 'connected' 
              ? conversation.isSpeaking 
                ? t('voiceFeatureCard.aiSpeaking')
                : t('voiceFeatureCard.active')
              : t('voiceFeatureCard.inactive')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {conversation.status !== 'connected' ? (
              <Button
                onClick={startConversation}
                disabled={isLoading}
                size="lg"
                className="bg-voice-accent hover:bg-voice-accent/90 text-white shadow-lg shadow-voice-accent/30 hover:shadow-voice-accent/50 transition-all duration-300 border border-voice-accent/50 font-semibold text-lg px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('voiceFeatureCard.connecting')}
                  </>
                ) : (
                  t('voiceFeatureCard.testButton')
                )}
              </Button>
            ) : (
              <Button
                onClick={endConversation}
                size="lg"
                variant="outline"
                className="border-2 border-voice-accent/50 hover:bg-voice-accent/10 text-foreground font-semibold text-lg px-8"
              >
                {t('voiceFeatureCard.endCall')}
              </Button>
            )}
          </div>

          {/* Subtitle */}
          <motion.p
            className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t('voiceFeatureCard.subtitle')}
          </motion.p>
        </div>
      </Card>
    </motion.div>
  );
};

export default VoiceAIFeatureCard;
