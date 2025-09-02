import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agent_id } = await req.json();
    const apiKey = Deno.env.get('ELEVENLABS_API_KEY');

    if (!apiKey) {
      console.error('ELEVENLABS_API_KEY is not configured');
      return new Response(JSON.stringify({
        error: 'ElevenLabs API key not configured. Please contact administrator.'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!agent_id) {
      return new Response(JSON.stringify({ error: 'agent_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Note: ElevenLabs Conversational AI session creation API
    // Header: 'xi-api-key' per ElevenLabs docs
    // Endpoint: v1 ConvAI (subject to change; confirm in dashboard)
    const url = 'https://api.elevenlabs.io/v1/convai/conversations';

    console.log('Creating ElevenLabs conversation for agent:', agent_id);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);

      let errorMessage = `ElevenLabs API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return new Response(JSON.stringify({
        error: errorMessage,
        status: response.status,
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    // Expecting response to include a client token / conversation_id suitable for WebRTC join
    console.log('ElevenLabs conversation created successfully');

    return new Response(JSON.stringify({ success: true, ...data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating ElevenLabs session:', error);
    // deno-lint-ignore no-explicit-any
    const err: any = error;
    return new Response(JSON.stringify({
      error: err?.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});


