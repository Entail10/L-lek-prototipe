# Lélek – Backend Szerver

AI-alapú pszichológiai segítő app backend szervere.

## Telepítés

```bash
npm install
npm start
```

## Környezeti változók (Render.com-on kell beállítani)

| Változó | Leírás |
|---------|--------|
| `ANTHROPIC_API_KEY` | Claude API kulcs (console.anthropic.com) |
| `OPENAI_API_KEY` | OpenAI API kulcs – TTS hanghoz (platform.openai.com) |

## Endpoints

- `POST /api/chat` – Chat üzenetek feldolgozása
- `POST /api/tts` – Szöveg hangra konvertálása
- `GET /health` – Szerver állapot ellenőrzése

## Deploy

Render.com-on:
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Region:** Frankfurt (EU)
