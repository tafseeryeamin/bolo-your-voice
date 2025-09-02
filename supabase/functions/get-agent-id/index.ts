// supabase/functions/get-agent-id/index.ts
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'POST') {
      const { agent_name, user_id } = await req.json();
      
      console.log('Looking up agent:', agent_name, 'for user:', user_id);
      
      // Look up agent in database
      const { data: agents, error } = await supabase
        .from('agents')
        .select('*')
        .eq('name', agent_name)
        .eq('user_id', user_id)
        .eq('status', 'active');

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (!agents || agents.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: "Agent not found or not active",
          message: "Please ensure your agent is created and approved by admin"
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const agent = agents[0];
      
      return new Response(JSON.stringify({
        success: true,
        agent_id: agent.retell_agent_id || agent.id,
        internal_agent_id: agent.id,
        retell_agent_id: agent.retell_agent_id,
        status: agent.status,
        message: "Agent ID retrieved successfully"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (req.method === 'GET') {
      const baseUrl = `${supabaseUrl}/functions/v1/get-agent-id`;
      
      return new Response(JSON.stringify({
        success: true,
        endpoint: baseUrl,
        method: "POST",
        required_body: {
          agent_name: "string",
          user_id: "string (optional)"
        },
        curl_example: `curl -X POST "${baseUrl}" -H "Content-Type: application/json" -d '{"agent_name": "your_agent_name", "user_id": "your_user_id"}'`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: "Method not allowed" 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-agent-id function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});