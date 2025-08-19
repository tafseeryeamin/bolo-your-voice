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

    const agentConfig = await req.json();
    console.log('Received agent config:', agentConfig);

    // Map the configuration to Retell AI format
    const retellPayload = {
      agent_name: agentConfig.agent_name,
      voice_id: agentConfig.voice_id,
      voice_model: agentConfig.voice_model,
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
      background_sound: agentConfig.background_sound,
      background_sound_volume: agentConfig.background_sound_volume,
      language: "en-US", // Set to multilingual as requested
      webhook_url: agentConfig.webhook_url,
      begin_message_delay_ms: agentConfig.begin_message_delay_ms,
      ring_duration_ms: agentConfig.ring_duration_ms,
      stt_mode: agentConfig.stt_mode,
      vocab_specialization: agentConfig.vocab_specialization,
      allow_user_dtmf: agentConfig.allow_user_dtmf,
      user_dtmf_options: agentConfig.user_dtmf_options,
      denoising_mode: agentConfig.denoising_mode,
      version: 0,
      // Add default response_engine if not provided
      response_engine: agentConfig.response_engine || {
        type: "retell-llm",
        llm_id: "llm_default",
        version: 0
      }
    };

    console.log('Sending to Retell AI:', retellPayload);

    const response = await fetch('https://api.retellai.com/create-agent', {
      method: 'POST',
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
      throw new Error(`Retell AI API error: ${response.status} - ${responseText}`);
    }

    const result = JSON.parse(responseText);

    return new Response(JSON.stringify({ 
      success: true, 
      agent: result,
      message: 'Agent configuration saved successfully'
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