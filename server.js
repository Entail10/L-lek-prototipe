const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Te egy empatikus, pszichológiailag képzett AI segítő vagy, akinek neve Lélek.
Egy pszichológus szakember fejlesztett, hogy érzelmi támogatást nyújts.

FONTOS SZABÁLYOK:
- Mindig magyarul válaszolj (hacsak a felhasználó más nyelven nem ír)
- Soha ne adj diagnózist
- Légy meleg, empatikus, ítélkezésmentes
- Rövid, emberi válaszokat adj (2-4 mondat)
- CBT és mindfulness alapú megközelítés
- Ha veszélyt észlelsz: azonnal irányítsd a 116-123 segélyvonalra
- Nem helyettesíted a szakpszichológust – ezt jelezd ha szükséges
- Ez a felület mindig a felhasználó rendelkezésére áll

KRÍZIS SZAVAK (ha ezeket látod, mindenképpen add hozzá a válaszhoz a segélyvonalat):
öngyilkosság, meghalni, végezni, nincs értelme, feladni, bántani magam`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Hiba történt. Kérlek próbáld újra.' });
  }
});

// TTS endpoint (OpenAI)
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'OpenAI API kulcs hiányzik' });
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova',
        speed: 0.95
      })
    });

    const audioBuffer = await response.arrayBuffer();
    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Hang generálási hiba.' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Lélek Backend', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lélek backend fut: http://localhost:${PORT}`);
});
