(function() {
  'use strict';

  // Get the script element that loaded this widget
  const script = document.getElementById('bolo-voice-widget');
  if (!script) {
    console.error('Bolo Voice Widget: Script element with id "bolo-voice-widget" not found');
    return;
  }

  // Extract configuration from data attributes
  const config = {
    publicKey: script.getAttribute('data-public-key'),
    agentId: script.getAttribute('data-agent-id'),
    title: script.getAttribute('data-title') || 'Talk to AI',
    logoUrl: script.getAttribute('data-logo-url'),
    primaryColor: script.getAttribute('data-primary-color') || '#6366F1',
    secondaryColor: script.getAttribute('data-secondary-color') || '#8B5CF6',
    position: script.getAttribute('data-position') || 'bottom-right',
    buttonText: script.getAttribute('data-button-text') || 'Start a conversation',
    welcomeMessage: script.getAttribute('data-welcome-message') || 'Hi! How can I help you today?',
    offlineMessage: script.getAttribute('data-offline-message') || 'We\'re currently offline. Please leave a message!'
  };

  console.log('Bolo Voice Widget: Configuration loaded', config);

  // Validate required configuration
  if (!config.publicKey || !config.agentId) {
    console.error('Bolo Voice Widget: Missing required configuration (publicKey or agentId)');
    return;
  }

  // Global state
  let isConnected = false;
  let isConnecting = false;
  let retellWebClient = null;

  // Create widget container
  function createWidget() {
    const container = document.createElement('div');
    container.id = 'bolo-voice-widget-container';
    container.style.cssText = `
      position: fixed;
      ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      ${config.position.includes('top') ? 'top: 20px;' : 'bottom: 20px;'}
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    // Create floating button
    const button = document.createElement('div');
    button.id = 'bolo-voice-button';
    button.style.cssText = `
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: none;
      outline: none;
    `;

    // Add hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    });

    // Create mic icon with animation
    const micContainer = document.createElement('div');
    micContainer.style.cssText = `
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create Bolo "B" icon as default
    const micIcon = document.createElement('div');
    micIcon.innerHTML = `
      <div style="
        width: 32px; 
        height: 32px; 
        background: rgba(255,255,255,0.2); 
        border-radius: 8px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: bold;
        font-size: 18px;
        color: white;
        transition: all 0.3s ease;
      ">B</div>
    `;

    // Add pulsing animation for when talking
    const pulseRing = document.createElement('div');
    pulseRing.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      border: 2px solid white;
      border-radius: 50%;
      opacity: 0;
      animation: pulse 2s infinite;
    `;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.4);
          opacity: 0;
        }
      }
      .pulse-active {
        animation: pulse 1.5s infinite !important;
      }
    `;
    document.head.appendChild(style);

    micContainer.appendChild(micIcon);
    micContainer.appendChild(pulseRing);

    // Use logo if provided, otherwise use mic icon
    if (config.logoUrl) {
      const logo = document.createElement('img');
      logo.src = config.logoUrl;
      logo.style.cssText = `
        width: 32px;
        height: 32px;
        object-fit: contain;
        filter: brightness(0) invert(1);
      `;
      logo.onerror = () => {
        // Fallback to mic icon if logo fails to load
        button.appendChild(micContainer);
      };
      button.appendChild(logo);
    } else {
      button.appendChild(micContainer);
    }

    container.appendChild(button);
    document.body.appendChild(container);

    // Add click handler
    button.addEventListener('click', handleButtonClick);

    return { container, button, pulseRing };
  }

  // Load Retell SDK
  function loadRetellSDK() {
    return new Promise((resolve, reject) => {
      if (window.RetellWebClient) {
        resolve(window.RetellWebClient);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/retell-client-js-sdk@2.0.7/dist/web/index.js';
      script.onload = () => {
        if (window.RetellWebClient) {
          console.log('Bolo Voice Widget: Retell SDK loaded successfully');
          resolve(window.RetellWebClient);
        } else {
          reject(new Error('RetellWebClient not found after loading SDK'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Retell SDK'));
      document.head.appendChild(script);
    });
  }

  // Create web call
  async function createWebCall() {
    try {
      console.log('Bolo Voice Widget: Creating web call...');
      
      const response = await fetch('https://gcqrnvllzfdkspjfwmng.supabase.co/functions/v1/create-retell-web-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: config.agentId
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create web call: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Bolo Voice Widget: Web call created successfully', data);
      return data;
    } catch (error) {
      console.error('Bolo Voice Widget: Error creating web call:', error);
      throw error;
    }
  }

  // Start voice call
  async function startCall(pulseRing) {
    if (isConnecting || isConnected) {
      console.log('Bolo Voice Widget: Already connecting or connected');
      return;
    }

    try {
      isConnecting = true;
      console.log('Bolo Voice Widget: Starting call...');

      // Show loading state
      if (pulseRing) {
        pulseRing.style.opacity = '0.5';
        pulseRing.classList.add('pulse-active');
      }

      // Load SDK if not already loaded
      const RetellWebClient = await loadRetellSDK();

      // Create web call
      const callData = await createWebCall();

      if (!callData.access_token) {
        throw new Error('No access token received from web call creation');
      }

      // Initialize Retell client
      retellWebClient = new RetellWebClient();

      // Set up event listeners
      retellWebClient.on('call_started', () => {
        console.log('Bolo Voice Widget: Call started');
        isConnected = true;
        isConnecting = false;
        if (pulseRing) {
          pulseRing.style.opacity = '1';
          pulseRing.classList.add('pulse-active');
        }
      });

      retellWebClient.on('call_ended', () => {
        console.log('Bolo Voice Widget: Call ended');
        isConnected = false;
        isConnecting = false;
        if (pulseRing) {
          pulseRing.style.opacity = '0';
          pulseRing.classList.remove('pulse-active');
        }
      });

      retellWebClient.on('error', (error) => {
        console.error('Bolo Voice Widget: Retell error:', error);
        isConnected = false;
        isConnecting = false;
        if (pulseRing) {
          pulseRing.style.opacity = '0';
          pulseRing.classList.remove('pulse-active');
        }
        alert('Failed to connect to voice service. Please try again.');
      });

      retellWebClient.on('update', (update) => {
        console.log('Bolo Voice Widget: Call update:', update);
      });

      // Start the call
      await retellWebClient.startCall({
        accessToken: callData.access_token,
      });

    } catch (error) {
      console.error('Bolo Voice Widget: Failed to start call:', error);
      isConnecting = false;
      if (pulseRing) {
        pulseRing.style.opacity = '0';
        pulseRing.classList.remove('pulse-active');
      }
      alert('Failed to start voice call. Please check your configuration and try again.');
    }
  }

  // Stop voice call
  function stopCall(pulseRing) {
    if (retellWebClient && isConnected) {
      console.log('Bolo Voice Widget: Stopping call...');
      retellWebClient.stopCall();
      if (pulseRing) {
        pulseRing.style.opacity = '0';
        pulseRing.classList.remove('pulse-active');
      }
    }
  }

  // Handle button click
  function handleButtonClick() {
    const pulseRing = document.querySelector('#bolo-voice-widget-container .pulse-active') || 
                     document.querySelector('#bolo-voice-widget-container div[style*="pulse"]');
    
    if (isConnected) {
      stopCall(pulseRing);
    } else {
      startCall(pulseRing);
    }
  }

  // Initialize widget when DOM is ready
  function initWidget() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidget);
    } else {
      createWidget();
    }
  }

  console.log('Bolo Voice Widget: Initializing...');
  initWidget();
})();