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
    
    const {
      agent_name,
      system_prompt,
      first_message,
      voice_id,
      responsiveness,
      enable_backchannel,
      backchannel_frequency
    } = await req.json();

    console.log('Creating Retell agent with simplified payload:', {
      agent_name,
      first_message,
      voice_id,
      responsiveness,
      enable_backchannel,
      backchannel_frequency
    });

    // Create simplified payload matching your form
    const webhookPayload = {
      agent_name,
      system_prompt,
      version: 0,
      response_engine: {
        type: "retell-llm",
        llm_id: "your_llm_id"
      },
      voice_id,
      voice_model: "eleven_turbo_v2",
      language: "en-US",
      responsiveness,
      enable_backchannel,
      backchannel_frequency,
      first_message: first_message || "Hello! How can I help you today?"
    };

    console.log('Sending request to webhook:', webhookPayload);
    
    // Send to your webhook URL
    const response = await fetch('https://awake-cockatoo-naturally.ngrok-free.app/webhook/955d68ca-7f0e-46d8-9835-b0bbf8a8b0eb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log('Webhook response status:', response.status);
    console.log('Webhook response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error response:', errorText);
      throw new Error(`Webhook error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Webhook response JSON:', result);

    return new Response(JSON.stringify({
      success: true,
      agent_id: result.agent_id || result.id, // Handle different response formats
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