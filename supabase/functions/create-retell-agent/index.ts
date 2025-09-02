import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const retellApiKey = Deno.env.get('RETELL_API_KEY') ?? '';
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
      voice_preferences,
      user_id
    } = await req.json();

    console.log('Received agent creation request:', {
      agent_name,
      voice_id,
      responsiveness,
      enable_backchannel
    });

    // Create agent record in database first
    const { data: agentRecord, error: dbError } = await supabase
      .from('agents')
      .insert({
        user_id: user_id,
        name: agent_name,
        description: system_prompt,
        language: 'en-US',
        voice_id: voice_id,
        first_message: first_message || "Hello! How can I help you today?",
        responsiveness: responsiveness || 1,
        enable_backchannel: enable_backchannel || false,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating agent record:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Only try to create Retell agent if API key is available
    let retellAgentId = null;
    if (retellApiKey) {
      try {
        // Create payload for Retell API
        const retellPayload = {
          agent_name: agent_name,
          voice_id: voice_id,
          language: "en-US",
          voice_model: "eleven_turbo_v2",
          responsiveness: responsiveness || 1,
          enable_backchannel: enable_backchannel || false,
          backchannel_frequency: backchannel_frequency || 1,
          first_message: first_message || "Hello! How can I help you today?",
          system_prompt: system_prompt,
          // Add other required fields based on Retell API documentation
        };

        console.log('Calling Retell API with payload:', retellPayload);

        const retellResponse = await fetch('https://api.retellai.com/create-agent', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${retellApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(retellPayload),
        });

        if (!retellResponse.ok) {
          const errorText = await retellResponse.text();
          console.error('Retell API error:', retellResponse.status, errorText);
          throw new Error(`Retell API error: ${retellResponse.status} - ${errorText}`);
        }

        const retellData = await retellResponse.json();
        retellAgentId = retellData.agent_id;
        console.log('Retell agent created successfully:', retellAgentId);

        // Update database record with Retell agent ID
        const { error: updateError } = await supabase
          .from('agents')
          .update({ 
            retell_agent_id: retellAgentId,
            status: 'active' 
          })
          .eq('id', agentRecord.id);

        if (updateError) {
          console.error('Error updating agent with Retell ID:', updateError);
        }
      } catch (retellError) {
        console.error('Error creating Retell agent:', retellError);
        // Don't fail the whole request if Retell API fails
        // Update agent status to indicate Retell creation failed
        await supabase
          .from('agents')
          .update({ status: 'retell_failed' })
          .eq('id', agentRecord.id);
      }
    } else {
      console.log('RETELL_API_KEY not configured, skipping Retell API call');
    }
    
    // Create notification for admin
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        type: 'new_agent_request',
        title: 'New Agent Configuration Submitted',
        message: `New agent "${agent_name}" configuration submitted${retellAgentId ? ' and created in Retell' : ' (pending Retell setup)'}.`,
        data: {
          internal_agent_id: agentRecord.id,
          retell_agent_id: retellAgentId,
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
    }

    return new Response(JSON.stringify({
      success: true,
      message: retellAgentId 
        ? "Agent created successfully in both database and Retell AI" 
        : "Agent configuration saved. Retell AI integration pending.",
      data: { 
        agent_id: agentRecord.id,
        retell_agent_id: retellAgentId,
        status: retellAgentId ? "active" : "pending_retell_setup",
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