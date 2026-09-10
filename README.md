# Plainly

A tiny two-way translator between candid language and LinkedIn-style professional prose, powered by `deepseek/deepseek-chat-v3.1` through OpenRouter.

## Local setup

1. Install dependencies: `npm install`
2. Put `OPENROUTER_API_KEY=...` in `.dev.vars`.
3. Run the worker: `npm run worker:dev`
4. Point `API_URL` in `app.js` to the worker URL and serve this directory with any static server.

## Deploy

Deploy the worker with `npm run worker:deploy`, then set its `OPENROUTER_API_KEY` using `npx wrangler secret put OPENROUTER_API_KEY`. GitHub Pages can serve the repository root.

The API key is never included in the frontend or committed to Git.

This project is not affiliated with LinkedIn.
