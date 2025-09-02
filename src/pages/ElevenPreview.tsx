import { useEffect } from "react";

const ElevenPreview = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.id = 'bolo-eleven-widget';
    script.src = '/eleven-widget.js';
    script.defer = true;
    // NOTE: Replace with real agent id via env/config when available
    script.setAttribute('data-agent-id', 'YOUR_ELEVEN_AGENT_ID');
    script.setAttribute('data-debug', 'true');
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">ElevenLabs Widget Preview</h1>
      <p className="text-muted-foreground mt-2">This page loads the white-labeled ElevenLabs widget from <code>/public/eleven-widget.js</code>.</p>
      <div className="mt-6">Click the floating button to start a call.</div>
    </div>
  );
};

export default ElevenPreview;


