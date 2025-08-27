(function() {
  // Voice Widget Configuration
  const script = document.getElementById('bolo-voice-widget');
  const config = {
    publicKey: script.getAttribute('data-public-key'),
    agentId: script.getAttribute('data-agent-id'),
    title: script.getAttribute('data-title') || 'Voice Assistant',
    primaryColor: script.getAttribute('data-primary-color') || '#1E40AF',
    secondaryColor: script.getAttribute('data-secondary-color') || '#3B82F6',
    position: script.getAttribute('data-position') || 'bottom-right',
    buttonText: script.getAttribute('data-button-text') || 'Talk to AI',
    welcomeMessage: script.getAttribute('data-welcome-message') || 'Hi! How can I help you today?',
    offlineMessage: script.getAttribute('data-offline-message') || 'We\'re currently offline. Please leave a message!'
  };

  // Load Retell SDK
  function loadVoiceSDK() {
    return new Promise((resolve, reject) => {
      if (window.RetellWebClient) {
        resolve(window.RetellWebClient);
        return;
      }
      
      const sdk = document.createElement('script');
      sdk.src = 'https://cdn.jsdelivr.net/npm/retell-client-js-sdk@2.0.7/dist/retell-client-js-sdk.umd.js';
      sdk.onload = () => resolve(window.RetellWebClient);
      sdk.onerror = reject;
      document.head.appendChild(sdk);
    });
  }

  // Create Widget UI
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'voice-widget-container';
    widget.innerHTML = `
      <div id="voice-widget-button" style="
        position: fixed;
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${config.position.includes('top') ? 'top: 20px;' : 'bottom: 20px;'}
        z-index: 10000;
        background: ${config.primaryColor};
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        cursor: pointer;
        font-family: system-ui, -apple-system, sans-serif;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
        ${config.buttonText}
      </div>
      
      <div id="voice-widget-modal" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10001;
        display: none;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: white;
          border-radius: 16px;
          padding: 24px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <h3 style="margin: 0 0 16px 0; color: ${config.primaryColor};">${config.title}</h3>
          <p style="margin: 0 0 20px 0; color: #666;">${config.welcomeMessage}</p>
          
          <div id="voice-status" style="
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;
            margin: 16px 0;
            color: #666;
          ">
            Click start to begin conversation
          </div>
          
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="start-call" style="
              background: ${config.primaryColor};
              color: white;
              border: none;
              border-radius: 8px;
              padding: 12px 24px;
              cursor: pointer;
              font-weight: 600;
            ">Start Call</button>
            
            <button id="end-call" style="
              background: #dc3545;
              color: white;
              border: none;
              border-radius: 8px;
              padding: 12px 24px;
              cursor: pointer;
              font-weight: 600;
              display: none;
            ">End Call</button>
            
            <button id="close-widget" style="
              background: #6c757d;
              color: white;
              border: none;
              border-radius: 8px;
              padding: 12px 24px;
              cursor: pointer;
              font-weight: 600;
            ">Close</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
    setupEventListeners();
  }

  // Event Listeners
  function setupEventListeners() {
    const button = document.getElementById('voice-widget-button');
    const modal = document.getElementById('voice-widget-modal');
    const closeBtn = document.getElementById('close-widget');
    const startBtn = document.getElementById('start-call');
    const endBtn = document.getElementById('end-call');
    const status = document.getElementById('voice-status');

    let webClient = null;

    button.addEventListener('click', () => {
      modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
      if (webClient) {
        webClient.stopCall();
      }
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (webClient) {
          webClient.stopCall();
        }
        modal.style.display = 'none';
      }
    });

    startBtn.addEventListener('click', async () => {
      try {
        const RetellWebClient = await loadVoiceSDK();
        webClient = new RetellWebClient();

        webClient.on('call_started', () => {
          status.textContent = 'Call connected. Start speaking!';
          startBtn.style.display = 'none';
          endBtn.style.display = 'inline-block';
        });

        webClient.on('call_ended', () => {
          status.textContent = 'Call ended. Click start to begin new conversation.';
          startBtn.style.display = 'inline-block';
          endBtn.style.display = 'none';
        });

        webClient.on('error', (error) => {
          status.textContent = 'Error: ' + error.message;
          startBtn.style.display = 'inline-block';
          endBtn.style.display = 'none';
        });

        status.textContent = 'Connecting...';
        
        // Create web call
        const response = await fetch('https://gcqrnvllzfdkspjfwmng.supabase.co/functions/v1/create-retell-web-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent_id: config.agentId
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to start call');
        }

        await webClient.startCall({
          accessToken: data.access_token,
          sampleRate: data.sample_rate,
          enableUpdate: true
        });

      } catch (error) {
        console.error('Voice call error:', error);
        status.textContent = 'Error starting call: ' + error.message;
      }
    });

    endBtn.addEventListener('click', () => {
      if (webClient) {
        webClient.stopCall();
      }
    });
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }
})();