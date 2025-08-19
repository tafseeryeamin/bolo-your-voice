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

    // Map the configuration to Retell AI format
    const retellPayload = {
      agent_name: agentConfig.agent_name,
      voice_id: agentConfig.voice_id,
      voice_model: agentConfig.voice_model || "eleven_turbo_v2",
      voice_temperature: agentConfig.voice_temperature,
      voice_speed: agentConfig.voice_speed,
      volume: agentConfig.volume,
      responsiveness: agentConfig.responsiveness,
      interruption_sensitivity: agentConfig.interruption_sensitivity,
      enable_backchannel: agentConfig.enable_backchannel,
      backchannel_frequency: agentConfig.backchannel_frequency,
      backchannel_words: agentConfig.backchannel_words,
      reminder_trigger_ms: agentConfig.reminder_trigger_ms,
      reminder_max_count: agentConfig.reminder_max_count,
      ambient_sound: agentConfig.background_sound,
      ambient_sound_volume: agentConfig.background_sound_volume,
      language: "en-US", // Set as requested
      webhook_url: agentConfig.webhook_url || "https://your-webhook-url.com", // Add default webhook
      begin_message_delay_ms: agentConfig.begin_message_delay_ms,
      ring_duration_ms: agentConfig.ring_duration_ms,
      stt_mode: agentConfig.stt_mode,
      vocab_specialization: agentConfig.vocab_specialization,
      allow_user_dtmf: agentConfig.allow_user_dtmf,
      user_dtmf_options: agentConfig.user_dtmf_options,
      denoising_mode: agentConfig.denoising_mode,
      fallback_voice_ids: agentConfig.fallback_voice_ids || [],
      boosted_keywords: agentConfig.boosted_keywords || [],
      version: 0,
      // Add required response_engine for create operations
      response_engine: agentConfig.response_engine || {
        type: "retell-llm",
        llm_id: "public_key_7ce8fc237e97788ef867f", // Use the provided LLM key
        version: 0
      },
      // Add other required fields for create
      opt_out_sensitive_data_storage: false,
      opt_in_signed_url: false,
      normalize_for_speech: true,
      end_call_after_silence_ms: 600000,
      max_call_duration_ms: 3600000
    };

    // Remove fields that are not allowed in UPDATE operations
    if (agentId) {
      delete retellPayload.response_engine;
      delete retellPayload.version;
      delete retellPayload.opt_out_sensitive_data_storage;
      delete retellPayload.opt_in_signed_url;
      delete retellPayload.normalize_for_speech;
      delete retellPayload.end_call_after_silence_ms;
      delete retellPayload.max_call_duration_ms;
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
      throw new Error(`Retell AI API error: ${response.status} - ${responseText}`);
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