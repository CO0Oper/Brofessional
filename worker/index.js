const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat-v3.1";

function cors(origin, allowedOrigin) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin === "*" ? "*" : allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = env.FRONTEND_ORIGIN || "*";
    const headers = cors(origin, allowedOrigin);

    if (allowedOrigin !== "*" && origin !== allowedOrigin) {
      return Response.json({ error: "Origin not allowed." }, { status: 403, headers });
    }
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (request.method !== "POST") return Response.json({ error: "Method not allowed." }, { status: 405, headers });
    if (!env.OPENROUTER_API_KEY) return Response.json({ error: "Translator is not configured." }, { status: 503, headers });

    try {
      const { message, direction, history = [] } = await request.json();
      if (typeof message !== "string" || !message.trim() || message.length > 2000) {
        return Response.json({ error: "Message must be between 1 and 2,000 characters." }, { status: 400, headers });
      }
      if (!Array.isArray(history) || history.length > 8 || history.some((item) =>
        !["user", "assistant"].includes(item?.role) || typeof item.content !== "string" || item.content.length > 2000)) {
        return Response.json({ error: "Conversation history is invalid." }, { status: 400, headers });
      }

      const task = direction === "from-linkedin"
        ? "Translate the corporate LinkedIn-style text into candid, concise plain English. Preserve the meaning. Return only the translation."
        : `You are a translation engine for "LinkedIn Speak" — the dialect of corporate-professional English spoken on LinkedIn.
Translate the user's message (raw, blunt, often vulgar, usually Chinese) into LinkedIn Speak. Rules:
- Always output in English, whatever language the input is in.
- Preserve the actual meaning. A fluent reader must be able to decode what really happened.
- Never repeat the profanity or the hostility. Reframe conflict as alignment, failure as growth, quitting as a new chapter, exhaustion as commitment.
- Warm, upbeat, slightly humblebragging. Gratitude, journeys, learnings, excitement.
- 1-3 sentences. No hashtags, no emoji, no preamble.
Output ONLY the translation.`;

      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": env.FRONTEND_ORIGIN || "https://github.com",
          "X-Title": "Plainly",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: task },
            ...history,
            { role: "user", content: message.trim() },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "OpenRouter request failed.");
      return Response.json({ reply: data.choices?.[0]?.message?.content?.trim() || "No translation returned." }, { headers });
    } catch (error) {
      return Response.json({ error: error.message || "Unexpected server error." }, { status: 500, headers });
    }
  },
};
