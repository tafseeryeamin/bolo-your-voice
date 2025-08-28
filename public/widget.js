(function() {
  // Voice Widget Configuration
  const script = document.getElementById('bolo-voice-widget');
  const config = {
    publicKey: script.getAttribute('data-public-key'),
    agentId: script.getAttribute('data-agent-id'),
    title: script.getAttribute('data-title') || 'Voice Assistant',
    logoUrl: script.getAttribute('data-logo-url'),
    primaryColor: script.getAttribute('data-primary-color') || '#6366F1',
    secondaryColor: script.getAttribute('data-secondary-color') || '#8B5CF6',
    position: script.getAttribute('data-position') || 'bottom-right',
    buttonText: script.getAttribute('data-button-text') || 'Start a conversation',
    welcomeMessage: script.getAttribute('data-welcome-message') || 'Hi there, How can we help?',
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

  // Create Widget UI with Bolo design
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'voice-widget-container';
    
    // Add widget styles
    const styles = document.createElement('style');
    styles.textContent = `
      @keyframes mic-pulse {
        0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); transform: scale(1); }
        70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); transform: scale(1.05); }
        100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); transform: scale(1); }
      }
      
      .voice-widget-button-active {
        animation: mic-pulse 2s infinite;
      }
      
      .voice-gradient {
        background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
      }
    `;
    document.head.appendChild(styles);
    
    widget.innerHTML = `
      <!-- Floating Button -->
      <div id="voice-widget-button" style="
        position: fixed;
        ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
        ${config.position.includes('top') ? 'top: 20px;' : 'bottom: 20px;'}
        z-index: 10000;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
        border: none;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </div>
      
      <!-- Voice Modal -->
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
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
          border-radius: 24px;
          padding: 0;
          max-width: 380px;
          width: 90%;
          text-align: center;
          color: white;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        ">
          <!-- Header with logo -->
          <div style="
            padding: 32px 24px 16px 24px;
            position: relative;
          ">
            ${config.logoUrl ? `
              <div style="
                width: 60px;
                height: 60px;
                background: rgba(0,0,0,0.2);
                border-radius: 50%;
                margin: 0 auto 16px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
              ">
                <img src="${config.logoUrl}" style="
                  width: 40px;
                  height: 40px;
                  object-fit: contain;
                  filter: brightness(0) invert(1);
                " alt="Logo" />
              </div>
            ` : `
              <div style="
                width: 60px;
                height: 60px;
                background: rgba(0,0,0,0.2);
                border-radius: 50%;
                margin: 0 auto 16px auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 28px;
              ">
                🎤
              </div>
            `}
            
            <h2 style="
              margin: 0 0 8px 0;
              font-size: 28px;
              font-weight: 400;
              line-height: 1.2;
            ">${config.welcomeMessage}</h2>
          </div>
          
          <!-- Voice status and mic button -->
          <div style="
            background: rgba(255,255,255,0.1);
            margin: 16px 24px 24px 24px;
            border-radius: 16px;
            padding: 24px;
            backdrop-filter: blur(10px);
          ">
            <div id="mic-container" style="
              width: 80px;
              height: 80px;
              margin: 0 auto 16px auto;
              border-radius: 50%;
              background: rgba(255,255,255,0.2);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;
              border: 3px solid rgba(255,255,255,0.3);
            ">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="color: white;">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              </svg>
            </div>
            
            <div id="voice-status" style="
              color: rgba(255,255,255,0.9);
              font-size: 14px;
              margin-bottom: 16px;
            ">
              Tap the microphone to start
            </div>
            
            <button id="end-call" style="
              background: rgba(220, 53, 69, 0.9);
              color: white;
              border: none;
              border-radius: 12px;
              padding: 12px 24px;
              cursor: pointer;
              font-weight: 600;
              font-size: 14px;
              display: none;
              margin: 0 auto;
            ">End Call</button>
          </div>
          
          <!-- Bottom navigation bar -->
          <div style="
            background: rgba(255,255,255,0.1);
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            backdrop-filter: blur(10px);
          ">
            <div style="
              display: flex;
              align-items: center;
              color: rgba(255,255,255,0.8);
              font-size: 14px;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              Home
            </div>
            <button id="close-widget" style="
              background: none;
              border: none;
              color: rgba(255,255,255,0.8);
              cursor: pointer;
              display: flex;
              align-items: center;
              font-size: 14px;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Close
            </button>
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
    const startBtn = document.getElementById('mic-container');
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
        console.log('Starting voice call with config:', { publicKey: config.publicKey, agentId: config.agentId });
        
        // Validate required config
        if (!config.publicKey) {
          throw new Error('API key is required. Please check your data-public-key attribute.');
        }
        
        if (!config.agentId) {
          throw new Error('Agent ID is required. Please check your data-agent-id attribute.');
        }

        const RetellWebClient = await loadVoiceSDK();
        webClient = new RetellWebClient();

        webClient.on('call_started', () => {
          console.log('Voice call started successfully');
          status.textContent = 'Call connected. Start speaking!';
          startBtn.style.display = 'none';
          endBtn.style.display = 'inline-block';
          button.classList.add('voice-widget-button-active');
        });

        webClient.on('call_ended', () => {
          console.log('Voice call ended');
          status.textContent = 'Call ended. Click start to begin new conversation.';
          startBtn.style.display = 'inline-block';
          endBtn.style.display = 'none';
          button.classList.remove('voice-widget-button-active');
        });

        webClient.on('error', (error) => {
          console.error('Voice call error:', error);
          status.textContent = 'Error: ' + error.message;
          startBtn.style.display = 'inline-block';
          endBtn.style.display = 'none';
          button.classList.remove('voice-widget-button-active');
        });

        status.textContent = 'Connecting...';
        
        // Create web call with BOTH api_key and agent_id
        console.log('Making API call to create web call...');
        const response = await fetch('https://gcqrnvllzfdkspjfwmng.supabase.co/functions/v1/create-retell-web-call', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: config.publicKey,  // Now sending the API key!
            agent_id: config.agentId
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('API Error:', response.status, data);
          throw new Error(data.error || 'Failed to start call');
        }

        console.log('Web call created successfully:', data);

        await webClient.startCall({
          accessToken: data.access_token,
          sampleRate: data.sample_rate,
          enableUpdate: true
        });

      } catch (error) {
        console.error('Voice call error:', error);
        status.textContent = 'Error starting call: ' + error.message;
        button.classList.remove('voice-widget-button-active');
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