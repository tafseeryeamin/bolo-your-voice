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
    const voiceId = agentConfig.voice_id || "11labs-Adrian"; // Use 11labs-Adrian as default
    
    // Create base payload matching Retell SDK structure
    const retellPayload = {
      agent_name: agentName,
      voice_id: voiceId,
      response_engine: {
        type: "retell-llm",
        llm_id: "public_key_7ce8fc237e97788ef867f"
      }
    };

    // Only add optional fields if they are provided and not undefined
    if (agentConfig.voice_model) retellPayload.voice_model = agentConfig.voice_model;
    if (agentConfig.voice_temperature !== undefined) retellPayload.voice_temperature = agentConfig.voice_temperature;
    if (agentConfig.voice_speed !== undefined) retellPayload.voice_speed = agentConfig.voice_speed;
    if (agentConfig.volume !== undefined) retellPayload.volume = agentConfig.volume;
    if (agentConfig.responsiveness !== undefined) retellPayload.responsiveness = agentConfig.responsiveness;
    if (agentConfig.interruption_sensitivity !== undefined) retellPayload.interruption_sensitivity = agentConfig.interruption_sensitivity;
    if (agentConfig.enable_backchannel !== undefined) retellPayload.enable_backchannel = agentConfig.enable_backchannel;
    if (agentConfig.backchannel_frequency !== undefined) retellPayload.backchannel_frequency = agentConfig.backchannel_frequency;
    if (agentConfig.backchannel_words && agentConfig.backchannel_words.length > 0) retellPayload.backchannel_words = agentConfig.backchannel_words;
    if (agentConfig.reminder_trigger_ms !== undefined) retellPayload.reminder_trigger_ms = agentConfig.reminder_trigger_ms;
    if (agentConfig.reminder_max_count !== undefined) retellPayload.reminder_max_count = agentConfig.reminder_max_count;
    if (agentConfig.background_sound && agentConfig.background_sound !== "off") retellPayload.ambient_sound = agentConfig.background_sound;
    if (agentConfig.background_sound_volume !== undefined) retellPayload.ambient_sound_volume = agentConfig.background_sound_volume;
    if (agentConfig.webhook_url) retellPayload.webhook_url = agentConfig.webhook_url;
    if (agentConfig.begin_message_delay_ms !== undefined) retellPayload.begin_message_delay_ms = agentConfig.begin_message_delay_ms;
    if (agentConfig.ring_duration_ms !== undefined) retellPayload.ring_duration_ms = agentConfig.ring_duration_ms;
    if (agentConfig.stt_mode) retellPayload.stt_mode = agentConfig.stt_mode;
    if (agentConfig.vocab_specialization) retellPayload.vocab_specialization = agentConfig.vocab_specialization;
    if (agentConfig.allow_user_dtmf !== undefined) retellPayload.allow_user_dtmf = agentConfig.allow_user_dtmf;
    if (agentConfig.user_dtmf_options) retellPayload.user_dtmf_options = agentConfig.user_dtmf_options;
    if (agentConfig.denoising_mode) retellPayload.denoising_mode = agentConfig.denoising_mode;
    if (agentConfig.fallback_voice_ids && agentConfig.fallback_voice_ids.length > 0) retellPayload.fallback_voice_ids = agentConfig.fallback_voice_ids;
    if (agentConfig.boosted_keywords && agentConfig.boosted_keywords.length > 0) retellPayload.boosted_keywords = agentConfig.boosted_keywords;

    // For UPDATE operations, remove response_engine as it's not allowed
    if (agentId) {
      delete retellPayload.response_engine;
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
    
    // Log the agent_id like in your Python example
    console.log('Agent ID:', result.agent_id);
    console.log('Full response:', result);

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