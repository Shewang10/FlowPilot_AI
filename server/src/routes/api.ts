import { Router } from 'express';

const router = Router();

router.get('/ping', (_req, res) => {
  res.json({ message: 'FlowPilot API router active' });
});

export default router;
