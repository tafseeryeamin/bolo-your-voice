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
    console.log('Get agent ID function called');
    
    if (req.method === 'POST') {
      const { agent_name } = await req.json();
      
      console.log('Received request for agent:', agent_name);
      
      // Simulate agent ID generation or retrieval
      // In a real implementation, this would fetch from your agent management system
      const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log('Generated agent ID:', agentId);
      
      return new Response(JSON.stringify({
        success: true,
        agent_id: agentId,
        message: "Agent ID retrieved successfully"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle GET request to provide curl example
    if (req.method === 'GET') {
      const baseUrl = 'https://gcqrnvllzfdkspjfwmng.supabase.co/functions/v1/get-agent-id';
      
      const curlExample = `curl -X POST "${baseUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_name": "your_agent_name"
  }'`;
      
      return new Response(JSON.stringify({
        success: true,
        curl_command: curlExample,
        endpoint: baseUrl,
        method: "POST",
        required_body: {
          agent_name: "string"
        },
        example_response: {
          success: true,
          agent_id: "agent_1234567890_abcdef123",
          message: "Agent ID retrieved successfully"
        }
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