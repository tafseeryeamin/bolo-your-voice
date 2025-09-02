// deno-lint-ignore-file no-explicit-any
/// <reference lib="deno.unstable" />
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  let payload: any = {};
  try {
    if (req.method !== "GET") payload = await req.json();
  } catch {
    // ignore – payload may be empty for GET requests
  }

  const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
  if (!apiKey) {
    return json({ error: "ElevenLabs API key not configured." }, 500);
  }

  const action = payload?.action as string | undefined;

  // Branch 1: SDP Join passthrough (recommended for full audio)
  if (req.method === "POST" && action === "join") {
    try {
      const {
        rtc_session_id,
        client_secret,
        agent_id,
        offer,
      } = payload || {};

      if (!offer?.sdp || !offer?.type) {
        return json({ error: "Missing SDP offer" }, 400);
      }

      // Use an environment variable so we don't hardcode ElevenLabs internals in code
      // Example: https://api.elevenlabs.io/v1/convai/conversation/join (confirm in docs/dashboard)
      const joinUrl = Deno.env.get("ELEVENLABS_JOIN_URL");
      if (!joinUrl) {
        return json({ error: "ELEVENLABS_JOIN_URL not set on server" }, 500);
      }

      // Build join payload with flexible shapes supported by ElevenLabs:
      // - If rtc_session_id/client_secret exist, include them.
      // - Otherwise include agent_id + offer (ElevenLabs may create session implicitly).
      const joinBody: Record<string, unknown> = { offer };
      if (rtc_session_id) joinBody.rtc_session_id = rtc_session_id;
      if (client_secret) joinBody.client_secret = client_secret;
      if (agent_id) joinBody.agent_id = agent_id;

      const res = await fetch(joinUrl, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinBody),
      });

      const text = await res.text();
      if (!res.ok) {
        return new Response(text || JSON.stringify({ error: "Join failed" }), {
          status: res.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(text, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return json({ error: err?.message || "Join error" }, 500);
    }
  }

  // Branch 2: Issue a ConvAI conversation token (token-only)
  try {
    const { agent_id } = payload || {};
    if (!agent_id) return json({ error: "agent_id is required" }, 400);

    // ElevenLabs ConvAI token endpoint
    const url = "https://api.elevenlabs.io/v1/convai/conversation/token";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      return json({ error: errorText, status: response.status }, response.status);
    }
    const data = await response.json();
    return json({ success: true, ...data }, 200);
  } catch (err: any) {
    return json({ error: err?.message || "Internal server error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}


