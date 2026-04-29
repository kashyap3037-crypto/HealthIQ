# 🩺 HealthIQ

An AI-powered disease information website built with React + Vite + Gemini API.

## Screenshots

![HealthIQ Home Page](public/image-0.png)

![Natural Home Remedies](public/image-1.png)

## Features
- 🔍 Search any disease by name
- 🌡️ Symptoms with severity levels
- 💊 Medicines with warnings
- ✅ What to do / 🚫 What not to do
- 🥗 Food to eat / 🚷 Food to avoid
- 🚨 Emergency signs
- 🌿 Home remedies
- ⏱️ Recovery timeline
- 🛡️ Prevention tips
- 💾 Auto-caching (same disease won't hit API twice)

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your `.env` file
```bash
cp .env.example .env
```

Open `.env` and paste your Gemini API key:
```
VITE_GEMINI_API_KEY=your_actual_key_here
```

**Get a free key at:** https://aistudio.google.com/app/apikey

### 3. Run the app
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Project Structure

```
mediguide/
├── .env                        ← Your API key (never commit this!)
├── .env.example                ← Template to copy
├── .gitignore                  ← .env is ignored by git
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                ← App entry point
    ├── App.jsx                 ← Main component + search UI
    ├── index.css               ← Global reset styles
    ├── api/
    │   └── gemini.js           ← Gemini API call + caching
    └── components/
        ├── ui.jsx              ← Badge, SectionCard, Bullet, etc.
        └── DiseaseResult.jsx   ← All 10 output cards
```

---

## Deploy to Vercel

1. Push to GitHub (`.env` is gitignored, so it's safe)
2. Go to https://vercel.com and import your repo
3. In **Environment Variables**, add:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: your Gemini API key
4. Deploy!

---

## Tech Stack
- **React 18** — Modern frontend architecture with reusable components
- **Vite** —Lightning-fast development and optimized production builds
- **Gemini 1.5 Flash** —AI-powered inference for real-time medical guidance
- **localStorage** — response caching

---

## College Project Notes
- Free Gemini API: 15 req/min, 1M tokens/day
- No backend needed — runs entirely in the browser
- Responses are cached so repeated searches are instant
