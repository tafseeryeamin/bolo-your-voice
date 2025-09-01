(function() {
  'use strict';

  // Configuration and initialization
  const WIDGET_VERSION = '1.2.0';
  const API_BASE_URL = 'https://gcqrnvllzfdkspjfwmng.supabase.co/functions/v1';
  const RETELL_SDK_URL = 'https://cdn.jsdelivr.net/npm/retell-client-js-sdk@2.0.7/dist/web/index.js';
  
  // Find the script element (multiple fallback methods)
  function findScriptElement() {
    // Method 1: Look for specific ID
    let script = document.getElementById('bolo-voice-widget');
    
    // Method 2: Look for script with our source
    if (!script) {
      script = document.querySelector('script[src*="bolo-voice-widget"]');
    }
    
    // Method 3: Use currentScript (works during execution)
    if (!script && document.currentScript) {
      script = document.currentScript;
    }
    
    // Method 4: Look for any script with data-agent-id
    if (!script) {
      script = document.querySelector('script[data-agent-id]');
    }
    
    return script;
  }

  const script = findScriptElement();
  if (!script) {
    console.error('Bolo Voice Widget: Could not find script element. Please ensure the script has id="bolo-voice-widget" or data-agent-id attribute.');
    return;
  }

  // Extract configuration from data attributes with validation
  const config = {
    publicKey: script.getAttribute('data-public-key'),
    agentId: script.getAttribute('data-agent-id'),
    title: script.getAttribute('data-title') || 'Talk to AI Assistant',
    logoUrl: script.getAttribute('data-logo-url'),
    primaryColor: script.getAttribute('data-primary-color') || '#6366F1',
    secondaryColor: script.getAttribute('data-secondary-color') || '#8B5CF6',
    position: script.getAttribute('data-position') || 'bottom-right',
    buttonText: script.getAttribute('data-button-text') || 'Start conversation',
    welcomeMessage: script.getAttribute('data-welcome-message') || 'Hi! How can I help you today?',
    offlineMessage: script.getAttribute('data-offline-message') || 'We\'re currently offline. Please leave a message!',
    debug: script.getAttribute('data-debug') === 'true',
    reportErrors: script.getAttribute('data-report-errors') === 'true',
    customApiUrl: script.getAttribute('data-api-url') // Allow custom API endpoint
  };

  // Debug logging function
  function debugLog(...args) {
    if (config.debug) {
      console.log(`[Bolo Widget v${WIDGET_VERSION}]`, ...args);
    }
  }

  // Error reporting function
  function reportError(error, context = {}) {
    console.error('Bolo Voice Widget Error:', error, context);
    
    if (config.reportErrors) {
      try {
        fetch('https://www.bolovoice.com/api/widget-errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: error.message || error,
            stack: error.stack,
            context,
            config: { agentId: config.agentId, debug: config.debug },
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            version: WIDGET_VERSION
          })
        }).catch(() => {}); // Silent fail for error reporting
      } catch (e) {
        // Ignore error reporting failures
      }
    }
  }

  debugLog('Configuration loaded:', config);

  // Validate required configuration
  if (!config.agentId) {
    const errorMessage = 'Missing required data-agent-id attribute';
    console.error('Bolo Voice Widget:', errorMessage);
    
    // Show developer-friendly error in development
    if (config.debug) {
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <strong>❌ Bolo Voice Widget Configuration Error</strong><br>
        Missing required attribute: <code>data-agent-id</code><br>
        <small>Add data-debug="false" to hide this message</small>
      `;
      errorDiv.style.cssText = `
        position: fixed; top: 10px; right: 10px; 
        background: #ff4444; color: white; padding: 12px; 
        border-radius: 8px; z-index: 10001; font-family: monospace;
        max-width: 300px; font-size: 12px; line-height: 1.4;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 10000);
    }
    
    reportError(new Error(errorMessage), { configProvided: !!script });
    return;
  }

  // Check browser compatibility
  function checkBrowserSupport() {
    const requiredFeatures = {
      'WebRTC': !!window.RTCPeerConnection,
      'MediaDevices': !!navigator.mediaDevices,
      'getUserMedia': !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      'Fetch': !!window.fetch,
      'Promises': !!window.Promise
    };

    const unsupported = Object.entries(requiredFeatures)
      .filter(([_, supported]) => !supported)
      .map(([feature]) => feature);

    if (unsupported.length > 0) {
      const errorMessage = `Browser missing required features: ${unsupported.join(', ')}`;
      debugLog('Browser support check failed:', requiredFeatures);
      reportError(new Error(errorMessage), { requiredFeatures });
      return false;
    }

    return true;
  }

  // Check HTTPS requirement
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    const errorMessage = 'HTTPS is required for microphone access';
    console.error('Bolo Voice Widget:', errorMessage);
    
    if (config.debug) {
      alert('Voice calls require HTTPS. Please contact the website administrator to enable secure connections.');
    }
    
    reportError(new Error(errorMessage), { protocol: location.protocol, hostname: location.hostname });
    return;
  }

  // Check browser support
  if (!checkBrowserSupport()) {
    console.error('Bolo Voice Widget: Browser not supported');
    return;
  }

  // Global state
  let isConnected = false;
  let isConnecting = false;
  let retellWebClient = null;
  let widgetElements = {};

  // Create external stylesheet to avoid CSP issues
  function createStylesheet() {
    if (document.getElementById('bolo-widget-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'bolo-widget-styles';
    style.textContent = `
      @keyframes bolo-pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.4);
          opacity: 0;
        }
      }
      
      @keyframes bolo-bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .bolo-pulse-active {
        animation: bolo-pulse 1.5s infinite !important;
      }
      
      .bolo-connecting {
        animation: bolo-bounce 0.6s infinite alternate !important;
      }
      
      .bolo-widget-button:hover {
        transform: scale(1.1) !important;
      }
      
      @media (max-width: 768px) {
        #bolo-voice-widget-container {
          bottom: 20px !important;
          right: 15px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create widget container
  function createWidget() {
    debugLog('Creating widget...');
    
    // Create stylesheet first
    createStylesheet();
    
    const container = document.createElement('div');
    container.id = 'bolo-voice-widget-container';
    container.style.cssText = `
      position: fixed;
      ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      ${config.position.includes('top') ? 'top: 20px;' : 'bottom: 20px;'}
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    `;

    // Create floating button
    const button = document.createElement('button');
    button.id = 'bolo-voice-button';
    button.className = 'bolo-widget-button';
    button.setAttribute('aria-label', config.buttonText);
    button.setAttribute('title', config.buttonText);
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
      position: relative;
      overflow: hidden;
    `;

    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.style.cssText = `
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create pulse ring for animation
    const pulseRing = document.createElement('div');
    pulseRing.className = 'bolo-pulse-ring';
    pulseRing.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      border: 2px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      opacity: 0;
    `;

    // Create icon (logo or default)
    let iconElement;
    if (config.logoUrl) {
      iconElement = document.createElement('img');
      iconElement.src = config.logoUrl;
      iconElement.style.cssText = `
        width: 32px;
        height: 32px;
        object-fit: contain;
        filter: brightness(0) invert(1);
      `;
      iconElement.onerror = () => {
        debugLog('Logo failed to load, using default icon');
        iconElement.replaceWith(createDefaultIcon());
      };
    } else {
      iconElement = createDefaultIcon();
    }

    function createDefaultIcon() {
      const defaultIcon = document.createElement('div');
      defaultIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      `;
      return defaultIcon;
    }

    // Assemble elements
    iconContainer.appendChild(iconElement);
    iconContainer.appendChild(pulseRing);
    button.appendChild(iconContainer);
    container.appendChild(button);
    
    // Add to DOM
    document.body.appendChild(container);

    // Store references
    widgetElements = { container, button, pulseRing, iconElement };

    // Add event listeners
    button.addEventListener('click', handleButtonClick);
    
    // Add keyboard accessibility
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleButtonClick();
      }
    });

    debugLog('Widget created successfully');
    return widgetElements;
  }

  // Load Retell SDK with retry mechanism
  function loadRetellSDK() {
    return new Promise((resolve, reject) => {
      if (window.RetellWebClient) {
        debugLog('Retell SDK already loaded');
        resolve(window.RetellWebClient);
        return;
      }

      debugLog('Loading Retell SDK...');
      const script = document.createElement('script');
      script.src = RETELL_SDK_URL;
      script.async = true;
      
      const timeout = setTimeout(() => {
        script.remove();
        reject(new Error('SDK loading timeout'));
      }, 15000);
      
      script.onload = () => {
        clearTimeout(timeout);
        if (window.RetellWebClient) {
          debugLog('Retell SDK loaded successfully');
          resolve(window.RetellWebClient);
        } else {
          reject(new Error('RetellWebClient not found after loading SDK'));
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load Retell SDK'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Create web call with improved error handling
  async function createWebCall() {
    try {
      debugLog('Creating web call for agent:', config.agentId);
      
      const apiUrl = config.customApiUrl || `${API_BASE_URL}/create-retell-web-call`;
      
      const response = await fetch(apiUrl, {
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
        debugLog('API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText
        });
        throw new Error(`API Error ${response.status}: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      debugLog('Web call created successfully:', data);
      
      if (!data.access_token) {
        throw new Error('No access token received from API');
      }
      
      return data;
    } catch (error) {
      debugLog('Error creating web call:', error);
      reportError(error, { agentId: config.agentId, apiUrl });
      throw error;
    }
  }

  // Check microphone permissions with better UX
  async function checkMicrophonePermission() {
    try {
      debugLog('Checking microphone permission...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported in this browser');
      }

      // Check current permission state if available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        debugLog('Current microphone permission:', permission.state);
        
        if (permission.state === 'denied') {
          throw new Error('Microphone access was denied. Please enable it in your browser settings.');
        }
      }

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      
      debugLog('Microphone permission granted');
      return true;
      
    } catch (error) {
      debugLog('Microphone permission error:', error);
      reportError(error, { context: 'microphone_permission' });
      
      let userMessage = 'Could not access microphone: ';
      if (error.name === 'NotAllowedError') {
        userMessage += 'Permission denied. Please allow microphone access and try again.';
      } else if (error.name === 'NotFoundError') {
        userMessage += 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotSupportedError') {
        userMessage += 'Not supported in this browser. Please try Chrome, Firefox, or Safari.';
      } else {
        userMessage += error.message;
      }
      
      alert(userMessage);
      return false;
    }
  }

  // Update button state
  function updateButtonState(state) {
    const { button, pulseRing } = widgetElements;
    if (!button || !pulseRing) return;
    
    // Remove all state classes
    button.classList.remove('bolo-connecting');
    pulseRing.classList.remove('bolo-pulse-active');
    pulseRing.style.opacity = '0';
    
    switch (state) {
      case 'connecting':
        button.classList.add('bolo-connecting');
        button.setAttribute('aria-label', 'Connecting...');
        break;
      case 'connected':
        pulseRing.classList.add('bolo-pulse-active');
        pulseRing.style.opacity = '1';
        button.setAttribute('aria-label', 'End call');
        break;
      case 'idle':
      default:
        button.setAttribute('aria-label', config.buttonText);
        break;
    }
  }

  // Start voice call with comprehensive error handling
  async function startCall() {
    if (isConnecting || isConnected) {
      debugLog('Already connecting or connected, ignoring start call');
      return;
    }

    try {
      isConnecting = true;
      debugLog('Starting voice call...');
      updateButtonState('connecting');

      // Check microphone permission first
      const hasPermission = await checkMicrophonePermission();
      if (!hasPermission) {
        return;
      }

      // Load SDK and create call in parallel for better performance
      const [RetellWebClient, callData] = await Promise.all([
        loadRetellSDK(),
        createWebCall()
      ]);

      // Initialize Retell client
      retellWebClient = new RetellWebClient();

      // Set up event listeners
      retellWebClient.on('call_started', () => {
        debugLog('Call started successfully');
        isConnected = true;
        isConnecting = false;
        updateButtonState('connected');
      });

      retellWebClient.on('call_ended', () => {
        debugLog('Call ended');
        isConnected = false;
        isConnecting = false;
        updateButtonState('idle');
        retellWebClient = null;
      });

      retellWebClient.on('error', (error) => {
        debugLog('Retell client error:', error);
        reportError(error, { context: 'retell_client' });
        
        isConnected = false;
        isConnecting = false;
        updateButtonState('idle');
        
        let errorMessage = 'Voice call failed: ';
        if (error.message) {
          if (error.message.includes('permission') || error.message.includes('microphone')) {
            errorMessage += 'Microphone access required. Please allow access and try again.';
          } else if (error.message.includes('network') || error.message.includes('connection')) {
            errorMessage += 'Network connection failed. Please check your internet and try again.';
          } else if (error.message.includes('token') || error.message.includes('auth')) {
            errorMessage += 'Authentication failed. Please contact support.';
          } else {
            errorMessage += 'Technical error occurred. Please try again.';
          }
        } else {
          errorMessage += 'Unknown error occurred. Please try again.';
        }
        
        alert(errorMessage);
      });

      retellWebClient.on('update', (update) => {
        debugLog('Call update:', update);
      });

      // Start the call
      debugLog('Starting call with access token...');
      await retellWebClient.startCall({
        accessToken: callData.access_token,
      });

    } catch (error) {
      debugLog('Failed to start call:', error);
      reportError(error, { context: 'start_call' });
      
      isConnecting = false;
      updateButtonState('idle');
      
      let errorMessage = 'Failed to start voice call: ';
      if (error.message.includes('API Error')) {
        errorMessage += 'Service temporarily unavailable. Please try again later.';
      } else if (error.message.includes('SDK')) {
        errorMessage += 'Voice service could not be loaded. Please check your internet connection.';
      } else if (error.message.includes('access token')) {
        errorMessage += 'Authentication failed. Please contact support.';
      } else {
        errorMessage += 'Technical error occurred. Please try again or contact support.';
      }
      
      alert(errorMessage);
    }
  }

  // Stop voice call
  function stopCall() {
    if (retellWebClient && (isConnected || isConnecting)) {
      debugLog('Stopping voice call...');
      try {
        retellWebClient.stopCall();
      } catch (error) {
        debugLog('Error stopping call:', error);
        reportError(error, { context: 'stop_call' });
      }
      updateButtonState('idle');
    }
  }

  // Handle button click
  function handleButtonClick() {
    debugLog('Button clicked, current state:', { isConnected, isConnecting });
    
    if (isConnected) {
      stopCall();
    } else if (!isConnecting) {
      startCall();
    }
  }

  // Cleanup function
  function cleanup() {
    debugLog('Cleaning up widget...');
    if (retellWebClient) {
      try {
        retellWebClient.stopCall();
      } catch (error) {
        debugLog('Error during cleanup:', error);
      }
    }
    
    if (widgetElements.container && widgetElements.container.parentNode) {
      widgetElements.container.parentNode.removeChild(widgetElements.container);
    }
    
    const styleElement = document.getElementById('bolo-widget-styles');
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  }

  // Initialize widget when DOM is ready
  function initWidget() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        debugLog('DOM loaded, creating widget');
        createWidget();
      });
    } else {
      debugLog('DOM already loaded, creating widget immediately');
      createWidget();
    }
  }

  // Handle page unload
  window.addEventListener('beforeunload', cleanup);
  
  // Handle page visibility changes (pause/resume)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isConnected) {
      debugLog('Page hidden, maintaining call');
    } else if (!document.hidden) {
      debugLog('Page visible');
    }
  });

  // Global error handler for uncaught widget errors
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('bolo-voice-widget')) {
      reportError(event.error || new Error(event.message), { 
        context: 'global_error_handler',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    }
  });

  // Initialize
  debugLog(`Initializing Bolo Voice Widget v${WIDGET_VERSION}...`);
  initWidget();

  // Expose cleanup function globally for manual cleanup if needed
  window.BoloVoiceWidget = {
    version: WIDGET_VERSION,
    cleanup: cleanup,
    getState: () => ({ isConnected, isConnecting }),
    config: config
  };

})();