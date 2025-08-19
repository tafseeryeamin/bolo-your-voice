import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const retellApiKey = Deno.env.get('RETELL_API_KEY');
    
    if (!retellApiKey) {
      throw new Error('RETELL_API_KEY not found in environment variables');
    }

    const { agentId, ...agentConfig } = await req.json();
    console.log('Received agent config:', agentConfig);
    console.log('Agent ID:', agentId);

    // Validate required fields and provide defaults
    const agentName = agentConfig.agent_name || "My Agent";
    const voiceId = agentConfig.voice_id || "9BWtsMINqrJLrRacOk9x"; // Default to Aria voice
    const voiceModel = agentConfig.voice_model || "eleven_turbo_v2";
    
    // Map the configuration to Retell AI format with proper validation
    const retellPayload = {
      agent_name: agentName,
      voice_id: voiceId,
      voice_model: voiceModel,
      voice_temperature: agentConfig.voice_temperature || 1,
      voice_speed: agentConfig.voice_speed || 1,
      volume: agentConfig.volume || 1,
      responsiveness: agentConfig.responsiveness || 1,
      interruption_sensitivity: agentConfig.interruption_sensitivity || 1,
      enable_backchannel: agentConfig.enable_backchannel || false,
      backchannel_frequency: agentConfig.backchannel_frequency || 0.9,
      backchannel_words: agentConfig.backchannel_words || ["yeah", "uh-huh"],
      reminder_trigger_ms: agentConfig.reminder_trigger_ms || 10000,
      reminder_max_count: agentConfig.reminder_max_count || 2,
      ambient_sound: agentConfig.background_sound || "off",
      ambient_sound_volume: agentConfig.background_sound_volume || 1,
      language: "en-US",
      webhook_url: agentConfig.webhook_url || "https://your-webhook-url.com",
      begin_message_delay_ms: agentConfig.begin_message_delay_ms || 1000,
      ring_duration_ms: agentConfig.ring_duration_ms || 30000,
      stt_mode: agentConfig.stt_mode || "fast",
      vocab_specialization: agentConfig.vocab_specialization || "general",
      allow_user_dtmf: agentConfig.allow_user_dtmf || true,
      user_dtmf_options: agentConfig.user_dtmf_options || {
        digit_limit: 25,
        termination_key: "#",
        timeout_ms: 8000
      },
      denoising_mode: agentConfig.denoising_mode || "noise-cancellation",
      fallback_voice_ids: Array.isArray(agentConfig.fallback_voice_ids) ? agentConfig.fallback_voice_ids : [],
      boosted_keywords: Array.isArray(agentConfig.boosted_keywords) ? agentConfig.boosted_keywords : []
    };

    // Add create-only fields
    if (!agentId) {
      retellPayload.version = 0;
      retellPayload.response_engine = {
        type: "retell-llm",
        llm_id: "public_key_7ce8fc237e97788ef867f",
        version: 0
      };
      retellPayload.opt_out_sensitive_data_storage = false;
      retellPayload.opt_in_signed_url = false;
      retellPayload.normalize_for_speech = true;
      retellPayload.end_call_after_silence_ms = 600000;
      retellPayload.max_call_duration_ms = 3600000;
    }

    console.log('Sending to Retell AI:', retellPayload);

    // Determine if this is an update or create operation
    const isUpdate = !!agentId;
    const apiUrl = isUpdate 
      ? `https://api.retellai.com/update-agent/${agentId}`
      : 'https://api.retellai.com/create-agent';
    const method = isUpdate ? 'PATCH' : 'POST';

    console.log(`Making ${method} request to:`, apiUrl);

    const response = await fetch(apiUrl, {
      method: method,
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(retellPayload),
    });

    const responseText = await response.text();
    console.log('Retell AI response status:', response.status);
    console.log('Retell AI response text:', responseText);

    if (!response.ok) {
      console.error(`Retell AI API error: ${response.status} - ${responseText}`);
      console.error('Request payload was:', JSON.stringify(retellPayload, null, 2));
      console.error('Request headers:', {
        'Authorization': `Bearer ${retellApiKey.substring(0, 10)}...`,
        'Content-Type': 'application/json'
      });
      
      // Return a more detailed error response
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Retell AI API error: ${response.status} - ${responseText}`,
        details: responseText
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = JSON.parse(responseText);

    return new Response(JSON.stringify({ 
      success: true, 
      agent: result,
      isUpdate: isUpdate,
      message: isUpdate ? 'Agent configuration updated successfully' : 'Agent created successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in save-agent-config function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});