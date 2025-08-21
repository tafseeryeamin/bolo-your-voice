import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
      internal_agent_id,
      agent_name,
      system_prompt,
      first_message,
      voice_id,
      responsiveness,
      enable_backchannel,
      backchannel_frequency,
      knowledge_base,
      website_link,
      voice_preferences
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
    
    // Create notification for admin
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type: 'new_agent_request',
        title: 'New Agent Configuration Submitted',
        message: `New agent "${agent_name}" configuration submitted and ready for review.`,
        data: {
          internal_agent_id,
          agent_name,
          voice_id,
          first_message,
          responsiveness,
          enable_backchannel,
          backchannel_frequency,
          knowledge_base,
          website_link,
          voice_preferences,
          submitted_at: new Date().toISOString()
        }
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    } else {
      console.log('Admin notification created successfully');
    }

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