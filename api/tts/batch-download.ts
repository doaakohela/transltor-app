import { generateBatchAudio } from '../../src/server/ttsEngine.ts';

export const config = {
  maxDuration: 60, // Extend function execution window on Vercel Pro/Enterprise if available
};

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
    const result = await generateBatchAudio(body);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel TTS batch-download error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to download batch audio' });
  }
}
