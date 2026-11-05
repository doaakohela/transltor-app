import { generateSpeechAudio, resolveVoiceAndProsody } from '../../src/server/ttsEngine.ts';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { text, lang = 'en', voice = 'en-US-GuyNeural' } = body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const voiceConfig = resolveVoiceAndProsody(voice, lang);
    const audioBuffer = await generateSpeechAudio(text, voiceConfig);

    return res.status(200).json({
      audioBase64: audioBuffer.toString('base64'),
      mimeType: 'audio/mp3',
    });
  } catch (err: any) {
    console.error('Vercel TTS speak error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to generate audio' });
  }
}
