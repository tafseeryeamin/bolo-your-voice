(function() {
  'use strict';

  const WIDGET_VERSION = '0.1.0';
  const API_BASE_URL = 'https://gcqrnvllzfdkspjfwmng.supabase.co/functions/v1';
  const STORAGE_KEY = 'bolo-eleven-widget-state';

  function findScriptElement() {
    let script = document.getElementById('bolo-eleven-widget');
    if (!script && document.currentScript) script = document.currentScript;
    if (!script) script = document.querySelector('script[data-agent-id]');
    return script;
  }

  const script = findScriptElement();
  if (!script) return;

  const config = {
    agentId: script.getAttribute('data-agent-id'),
    apiUrl: script.getAttribute('data-api-url') || `${API_BASE_URL}/create-elevenlabs-session`,
    primaryColor: script.getAttribute('data-primary-color') || '#111827',
    secondaryColor: script.getAttribute('data-secondary-color') || '#6366F1',
    debug: script.getAttribute('data-debug') === 'true',
    position: script.getAttribute('data-position') || 'bottom-right',
    logoUrl: script.getAttribute('data-logo-url'),
    buttonText: script.getAttribute('data-button-text') || 'Talk',
  };

  function log(...args) { if (config.debug) console.log(`[Eleven Widget v${WIDGET_VERSION}]`, ...args); }

  if (!config.agentId) {
    console.error('Eleven Widget: missing data-agent-id');
    return;
  }

  function createStyles() {
    if (document.getElementById('bolo-eleven-widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'bolo-eleven-widget-styles';
    style.textContent = `
      .be-btn{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer;box-shadow:0 8px 32px rgba(0,0,0,.3);background:linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});}
      .be-container{position:fixed;z-index:10000;}
    `;
    document.head.appendChild(style);
  }

  function placeContainer() {
    const div = document.createElement('div');
    div.className = 'be-container';
    if (config.position.includes('right')) div.style.right = '20px'; else div.style.left = '20px';
    if (config.position.includes('top')) div.style.top = '20px'; else div.style.bottom = '20px';
    const btn = document.createElement('button');
    btn.className = 'be-btn';
    btn.title = config.buttonText;
    if (config.logoUrl) {
      const img = document.createElement('img');
      img.src = config.logoUrl; img.width = 32; img.height = 32; img.style.filter = 'brightness(0) invert(1)';
      btn.appendChild(img);
    } else {
      btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
    }
    div.appendChild(btn);
    document.body.appendChild(div);
    return { div, btn };
  }

  async function createSession() {
    const res = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: config.agentId }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`API ${res.status}: ${t}`);
    }
    return res.json();
  }

  let pc = null;
  let mediaStream = null;

  async function startCall() {
    log('Starting Eleven call');
    const session = await createSession();
    // Expected fields vary; prefer websocket/webrtc join data
    // Fallbacks are placeholders; user will provide specifics
    const { rtc_session_id, client_secret, ice_servers, join_url } = session;

    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    pc = new RTCPeerConnection({ iceServers: ice_servers || [{ urls: 'stun:stun.l.google.com:19302' }] });
    mediaStream.getTracks().forEach(track => pc.addTrack(track, mediaStream));

    const audioEl = new Audio();
    audioEl.autoplay = true;
    pc.ontrack = (e) => { audioEl.srcObject = e.streams[0]; };

    // Application-specific signaling. Replace with ElevenLabs join if supplied.
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    let answerPayload = null;
    try {
      // Prefer a provided join_url from backend/session
      const targetUrl = join_url || config.apiUrl;
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          rtc_session_id,
          client_secret,
          offer: { sdp: offer.sdp, type: offer.type }
        })
      });
      if (res.ok) {
        answerPayload = await res.json();
      } else {
        const t = await res.text();
        throw new Error(`Join failed ${res.status}: ${t}`);
      }
    } catch (err) {
      console.error('Join error', err);
      alert('Join step failed. Please ensure your function handles SDP exchange in the same URL or returns join_url.');
      stopCall();
      return;
    }

    try {
      const remote = answerPayload.answer || answerPayload; // support {answer:{sdp,type}} or plain
      await pc.setRemoteDescription(new RTCSessionDescription(remote));
    } catch (err) {
      console.error('Failed to set remote description', err, answerPayload);
      alert('Invalid SDP answer from server.');
      stopCall();
    }
  }

  function stopCall() {
    if (pc) { pc.close(); pc = null; }
    if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
  }

  function init() {
    createStyles();
    const { btn } = placeContainer();
    let active = false;
    btn.addEventListener('click', async () => {
      try {
        if (!active) { await startCall(); active = true; }
        else { stopCall(); active = false; }
      } catch (e) {
        console.error('Eleven call error', e);
        active = false;
        stopCall();
        alert('Unable to start call. Please try again.');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


