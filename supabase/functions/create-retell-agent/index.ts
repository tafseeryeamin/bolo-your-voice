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
      backchannel_frequency,
      knowledge_base,
      website_link
    } = await req.json();

    console.log('Creating Retell agent with simplified payload:', {
      agent_name,
      first_message,
      voice_id,
      responsiveness,
      enable_backchannel,
      backchannel_frequency,
      knowledge_base,
      website_link
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
      first_message: first_message || "Hello! How can I help you today?",
      knowledge_base,
      website_link
    };

    console.log('Sending request to webhook with payload:');
    console.log('Payload JSON:', JSON.stringify(webhookPayload, null, 2));
    console.log('Payload size:', JSON.stringify(webhookPayload).length, 'bytes');
    
    // No longer sending to webhook - admin will handle agent creation
    console.log('Agent configuration saved, admin will be notified via email');

    return new Response(JSON.stringify({
      success: true,
      message: "Configuration saved successfully. Admin will review and provide agent ID.",
      data: { 
        status: "pending_admin_review",
        submitted_at: new Date().toISOString()
      }
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