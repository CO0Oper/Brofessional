# Plainly

A tiny translator from candid language to LinkedIn-style professional prose, powered by `deepseek/deepseek-chat-v3.1` through OpenRouter.

**[Open the live app](https://co0oper.github.io/linkedin-speak-chat/)**

## Local setup

1. Install dependencies: `npm install`
2. Put `OPENROUTER_API_KEY=...` in `.dev.vars`.
3. Run the worker: `npm run worker:dev`
4. Point `API_URL` in `app.js` to the worker URL and serve this directory with any static server.

## Deploy

Create the `RATE_LIMITS` KV namespace named in `worker/wrangler.toml`, deploy the worker with `npm run worker:deploy`, then set its `OPENROUTER_API_KEY` using `npx wrangler secret put OPENROUTER_API_KEY`. GitHub Pages can serve the repository root.

The Worker limits each Cloudflare client IP to 20 requests per 24-hour window. Source messages are capped at 1,000 characters in both the browser and Worker.

The API key is never included in the frontend or committed to Git.

This project is not affiliated with LinkedIn.
