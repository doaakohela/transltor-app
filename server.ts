import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  generateSpeechAudio,
  generateFullWordSequence,
  generateBatchAudio,
  translateText,
  resolveVoiceAndProsody,
} from './src/server/ttsEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = 3000;

// Enable CORS for Chrome Extensions, Vercel, and external callers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.resolve(__dirname, 'public')));

// Explicit SEO routes ensuring correct MIME types for Google Search Console and crawlers
app.get('/sitemap.xml', (_req, res) => {
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.sendFile(path.resolve(__dirname, 'public', 'sitemap.xml'));
});

app.get('/sitemap.txt', (_req, res) => {
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(path.resolve(__dirname, 'public', 'sitemap.txt'));
});

app.get('/robots.txt', (_req, res) => {
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(path.resolve(__dirname, 'public', 'robots.txt'));
});

app.get('/ads.txt', (_req, res) => {
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.sendFile(path.resolve(__dirname, 'public', 'ads.txt'));
});

/**
 * API: Speak a single word or preview phrase in ANY world language
 */
app.post('/api/tts/speak', async (req, res) => {
  try {
    const { text, lang = 'en', voice = 'en-US-GuyNeural' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const voiceConfig = resolveVoiceAndProsody(voice, lang);
    const audioBuffer = await generateSpeechAudio(text, voiceConfig);

    return res.json({
      audioBase64: audioBuffer.toString('base64'),
      mimeType: 'audio/mp3',
    });
  } catch (err: any) {
    console.error('TTS preview error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to generate audio' });
  }
});

/**
 * API: Generate full sequence for a single vocabulary item in any language pair
 * e.g. [Source 1x] + [pause] + [Source 2x] + [pause] + [Target 1x]
 */
app.post('/api/tts/full-word', async (req, res) => {
  try {
    const result = await generateFullWordSequence(req.body);
    return res.json(result);
  } catch (err: any) {
    console.error('Full word sequence error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to generate word sequence' });
  }
});

/**
 * API: Batch Audio Generator for large lists up to thousands of words
 * Supports any language pair in the world with high-speed concurrency!
 */
app.post('/api/tts/batch-download', async (req, res) => {
  try {
    const result = await generateBatchAudio(req.body);
    return res.json(result);
  } catch (err: any) {
    console.error('Batch download error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to download batch audio' });
  }
});

/**
 * API: Real-time Translation (like Google Translate) with auto language detection
 */
app.post('/api/translate', async (req, res) => {
  try {
    const result = await translateText(req.body);
    return res.json(result);
  } catch (err: any) {
    console.error('Translation error:', err);
    return res.status(500).json({ error: err?.message || 'Translation failed' });
  }
});

// Setup dev middleware with Vite or serve static production build
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Neural Multilingual Audio Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
