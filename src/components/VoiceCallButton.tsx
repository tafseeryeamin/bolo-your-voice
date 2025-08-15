import { useState } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';

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
    <button 
      onClick={isCallActive ? stopCall : startCall}
      className="bg-voice-accent hover:bg-voice-muted text-primary-foreground font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-voice"
    >
      {isCallActive ? 'End Call' : 'Start Voice Call'}
    </button>
  );
};

export default VoiceCallButton;