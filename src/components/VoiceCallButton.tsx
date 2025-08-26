import { useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceCallButton = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const retellWebClient = new RetellWebClient();

  const startCall = async () => {
    try {
      // Call your server endpoint to get access token
      const response = await fetch('/api/create-web-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: 'your_agent_id_here'
        })
      });
      
      const { access_token } = await response.json();
      
      // Start the call
      await retellWebClient.startCall({
        accessToken: access_token,
      });
      
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const stopCall = () => {
    retellWebClient.stopCall();
    setIsCallActive(false);
  };

  // Listen to events
  retellWebClient.on("call_started", () => {
    console.log("Call started");
    setIsCallActive(true);
  });

  retellWebClient.on("call_ended", () => {
    console.log("Call ended");
    setIsCallActive(false);
  });

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200 }}
    >
      <motion.button 
        onClick={isCallActive ? stopCall : startCall}
        className={`
          w-16 h-16 rounded-full glassmorphism neon-border
          flex items-center justify-center
          transition-all duration-300 hover-glow
          ${isCallActive ? 'animate-neon-pulse' : 'animate-pulse'}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isCallActive ? (
          <MicOff className="w-6 h-6 text-voice-accent" />
        ) : (
          <Mic className="w-6 h-6 text-voice-accent" />
        )}
      </motion.button>
      
      {/* Floating label */}
      <motion.div
        className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-background/90 backdrop-blur-sm rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0, y: 0 }}
        whileHover={{ opacity: 1, y: -5 }}
      >
        {isCallActive ? 'End Voice Call' : 'Start Voice Call'}
      </motion.div>
    </motion.div>
  );
};

export default VoiceCallButton;