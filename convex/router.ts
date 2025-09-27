import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Webhook endpoint for Vapi AI voice calls
http.route({
  path: "/vapi/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      
      // Handle different Vapi webhook events
      switch (body.type) {
        case "session-started":
          // Log session start
          console.log("Voice session started:", body.sessionId);
          break;
          
        case "transcript":
          // Process voice transcript
          if (body.transcript && body.sessionId) {
            // Here you would process the voice query
            // For now, just log it
            console.log("Voice transcript:", body.transcript);
          }
          break;
          
        case "session-ended":
          // Log session end
          console.log("Voice session ended:", body.sessionId);
          break;
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Vapi webhook error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Health check endpoint
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response(JSON.stringify({ status: "healthy", timestamp: Date.now() }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
