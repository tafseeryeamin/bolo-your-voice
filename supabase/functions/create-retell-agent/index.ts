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
    console.log('Create Retell Agent function called');
    
    const retellApiKey = Deno.env.get('RETELL_API_KEY');
    if (!retellApiKey) {
      console.error('RETELL_API_KEY not found');
      throw new Error('Retell API key not configured');
    }

    const {
      agent_name,
      version,
      response_engine,
      voice_id,
      voice_model,
      language,
      responsiveness,
      enable_backchannel,
      backchannel_frequency,
      system_prompt
    } = await req.json();

    console.log('Creating Retell agent with payload:', {
      agent_name,
      voice_id,
      language,
      responsiveness,
      enable_backchannel,
      backchannel_frequency
    });

    // Create agent with Retell API
    const retellPayload = {
      agent_name,
      version,
      response_engine,
      voice_id,
      voice_model,
      language,
      responsiveness,
      enable_backchannel,
      backchannel_frequency,
      // Add system prompt to LLM configuration
      llm_websocket_url: null,
      begin_message: "Hello! I'm your AI assistant. How can I help you today?",
      general_prompt: system_prompt
    };

    console.log('Sending request to Retell API...');
    
    const response = await fetch('https://api.retellai.com/create-agent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(retellPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Retell API error:', response.status, errorText);
      throw new Error(`Retell API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Retell agent created successfully:', result);

    return new Response(JSON.stringify({
      success: true,
      agent_id: result.agent_id,
      data: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-retell-agent function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});