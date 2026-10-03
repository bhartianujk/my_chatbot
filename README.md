# Anuj AI — Academic Chatbot

Responsive React/Vite chatbot with a Vercel serverless API that calls Google Gemini. The Gemini API key is never sent to the browser.

## Deploy to Vercel

1. Extract this ZIP and upload the **entire folder** to a new GitHub repository (including `api/`), or import the repository into Vercel.
2. In Vercel, choose **Add New → Project**, import the repository, and leave Framework Preset as **Vite**. Build command: `npm run build`; output directory: `dist`.
3. Under **Project → Settings → Environment Variables**, add `GEMINI_API_KEY` with your key from [Google AI Studio](https://aistudio.google.com/apikey). Optionally set `GEMINI_MODEL=gemini-2.5-flash` (default). Apply to Production (and Preview if desired).
4. **Redeploy** after adding/changing environment variables. Open your deployment URL and send a test question.
5. Edit `api/profile.js` to customize the knowledge base, then commit/push to redeploy. The included profile is a starter: verify current employment and publication details before going live.

**Security:** Never put `GEMINI_API_KEY` in a `VITE_` variable or in React source. `api/chat.js` runs on Vercel's server, not in the browser. Public chatbots can consume your API quota: set Google API usage limits and consider Vercel WAF/rate limiting, CAPTCHA, and abuse monitoring before sharing widely.

## Local development

Vite alone does not run Vercel functions. To test both the frontend and `/api/chat` locally:

```bash
npm install
npm install -g vercel
vercel login
vercel link
# Put GEMINI_API_KEY and optionally GEMINI_MODEL in .env.local (never commit it)
vercel dev
```

Open the local URL printed by `vercel dev` (usually http://localhost:3000). `npm run dev` alone runs only the UI and proxies `/api` to port 3000; use `vercel dev` for full-stack testing.

## Troubleshooting

- **Gemini is not configured:** Check `GEMINI_API_KEY` in Vercel Environment Variables and redeploy.
- **Model not found:** Set `GEMINI_MODEL` to a model enabled for your API key; model availability changes.
- **429 / high demand:** Check Gemini quota and billing; retry later or change to an available model.
- **404 at `/api/chat`:** Make sure `api/chat.js` is in the project root and deploy the whole repository.
- **API key restricted:** Ensure the key supports server-side Gemini Generative Language API calls.

## Project structure

- `src/main.jsx`: React chat interface
- `src/styles.css`: responsive design
- `api/chat.js`: serverless Gemini endpoint
- `api/profile.js`: editable owner-controlled knowledge base
- `.env.example`: environment variable names
- `vercel.json`: Vite deployment settings

This is a profile-based chatbot, not retrieval over arbitrary uploaded files. To add PDFs or live documents, extend the server endpoint with retrieval (RAG) and a document index.
