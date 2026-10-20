import { Router } from 'express';
import { handleProcessLeads } from '../controllers/processController.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ message: 'FlowPilot API router active' });
});

router.post('/process', handleProcessLeads);

// Verify user-provided or environment API key
router.post('/verify-key', async (req, res) => {
  const { apiKey } = req.body || {};
  const keyToTest = apiKey?.trim() || process.env.GEMINI_API_KEY?.trim();

  if (!keyToTest) {
    res.json({
      valid: false,
      message: 'No API key provided. Using offline Demo Mode (100% Free).',
    });
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(keyToTest);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Say "OK" to verify API connection.');
    const text = result.response.text();

    res.json({
      valid: true,
      message: 'Gemini API key is active and responding correctly!',
      model: 'gemini-2.0-flash',
      response: text.trim(),
    });
  } catch (error: any) {
    res.json({
      valid: false,
      message: `API Key verification failed: ${error?.message || 'Invalid key or quota exceeded'}.`,
    });
  }
});

export default router;
