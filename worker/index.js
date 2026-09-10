const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat-v3.1";
const MESSAGE_LIMIT = 1000;
const DAILY_LIMIT = 20;
const DAY = 86_400;
const TARGET_LANGUAGES = new Set(["English", "Simplified Chinese", "Traditional Chinese", "Spanish", "French", "German", "Japanese", "Korean", "Portuguese"]);

export function translationTask(direction, targetLanguage) {
  return direction === "to-linkedin" ? `You are a translation engine for "LinkedIn Speak" — the dialect of corporate-professional English spoken on LinkedIn.
Translate the user's message (raw, blunt, often vulgar, usually Chinese) into LinkedIn Speak. Rules:
- Always output in English, whatever language the input is in.
- Preserve the actual meaning. A fluent reader must be able to decode what really happened.
- Never repeat the profanity or the hostility. Reframe conflict as alignment, failure as growth, quitting as a new chapter, exhaustion as commitment.
- Warm, upbeat, slightly humblebragging. Gratitude, journeys, learnings, excitement.
- 1-3 sentences. No hashtags, no emoji, no preamble.
Output ONLY the translation.` : `You are a translation engine that decodes "LinkedIn Speak" into direct, natural ${targetLanguage}.
Preserve the actual meaning, including conflict, failure, quitting, or exhaustion that the corporate phrasing may soften.
Write plainly and naturally in ${targetLanguage}. Use 1-3 sentences with no hashtags, emoji, preamble, commentary, or quotation marks.
Output ONLY the translation.`;
}

function cors(origin, allowedOrigin) {
  return {
    "Access-Control-Allow-Origin": allowedOrigin === "*" ? "*" : allowedOrigin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export async function rateLimit(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  const key = `daily:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
  const now = Math.floor(Date.now() / 1000);
  const current = await env.RATE_LIMITS.get(key, "json");
  const window = current?.resetAt > now ? current : { count: 0, resetAt: now + DAY };

  if (window.count >= DAILY_LIMIT) return { allowed: false, remaining: 0, retryAfter: window.resetAt - now };

  window.count += 1;
  await env.RATE_LIMITS.put(key, JSON.stringify(window), { expiration: window.resetAt });
  return { allowed: true, remaining: DAILY_LIMIT - window.count, retryAfter: window.resetAt - now };
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
      const { message, history = [], direction = "to-linkedin", targetLanguage = "English" } = await request.json();
      if (typeof message !== "string" || !message.trim() || message.length > MESSAGE_LIMIT) {
        return Response.json({ error: `Message must be between 1 and ${MESSAGE_LIMIT.toLocaleString()} characters.` }, { status: 400, headers });
      }
      if (!Array.isArray(history) || history.length > 8 || history.some((item) =>
        !["user", "assistant"].includes(item?.role) || typeof item.content !== "string" || item.content.length > 2000)) {
        return Response.json({ error: "Conversation history is invalid." }, { status: 400, headers });
      }
      if (!["to-linkedin", "from-linkedin"].includes(direction) || !TARGET_LANGUAGES.has(targetLanguage)) {
        return Response.json({ error: "Translation settings are invalid." }, { status: 400, headers });
      }

      if (!env.RATE_LIMITS) return Response.json({ error: "Rate limiter is not configured." }, { status: 503, headers });
      const limit = await rateLimit(request, env);
      const rateHeaders = {
        ...headers,
        "X-RateLimit-Limit": String(DAILY_LIMIT),
        "X-RateLimit-Remaining": String(limit.remaining),
      };
      if (!limit.allowed) {
        return Response.json({ error: "Daily limit reached. Try again after your 24-hour window resets." }, {
          status: 429,
          headers: { ...rateHeaders, "Retry-After": String(limit.retryAfter) },
        });
      }

      const task = translationTask(direction, targetLanguage);

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
      return Response.json({ reply: data.choices?.[0]?.message?.content?.trim() || "No translation returned." }, { headers: rateHeaders });
    } catch (error) {
      return Response.json({ error: error.message || "Unexpected server error." }, { status: 500, headers });
    }
  },
};
