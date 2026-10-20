import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0),
    version: '0.1.0'
  });
});

// Main API routes
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`[FlowPilot AI Server] Running on http://localhost:${PORT}`);
  console.log(`[FlowPilot AI Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[FlowPilot AI Server] AI Status: ${process.env.GEMINI_API_KEY ? 'Live API Key detected' : 'Demo/Mock Mode (Free)'}`);
});
