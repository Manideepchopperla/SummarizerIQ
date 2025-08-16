import express from 'express';
import {
  generateSummary,
  getSummaries,
  updateSummary,
  shareSummary,
  deleteSummary
} from '../controllers/summaryController.js';

import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', authenticateToken, generateSummary);
router.get('/', authenticateToken, getSummaries);
router.put('/:id', authenticateToken, updateSummary);
router.post('/share', authenticateToken, shareSummary);
router.delete('/:id', authenticateToken, deleteSummary);

export default router;
