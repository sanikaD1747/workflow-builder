import express from 'express';
import mongoose from 'mongoose';
import { checkLLMHealth } from '../services/llmService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const health = {
    backend: { status: 'healthy', message: 'Backend is running' },
    database: { status: 'unknown', message: '' },
    llm: { status: 'unknown', message: '' }
  };
  
  // Check MongoDB
  try {
    if (mongoose.connection.readyState === 1) {
      health.database = { status: 'healthy', message: 'MongoDB is connected' };
    } else {
      health.database = { status: 'unhealthy', message: 'MongoDB is not connected' };
    }
  } catch (error) {
    health.database = { status: 'unhealthy', message: error.message };
  }
  
  // Check LLM
  try {
    health.llm = await checkLLMHealth();
  } catch (error) {
    health.llm = { status: 'unhealthy', message: error.message };
  }
  
  const overallHealthy = 
    health.backend.status === 'healthy' &&
    health.database.status === 'healthy' &&
    health.llm.status === 'healthy';
  
  res.status(overallHealthy ? 200 : 503).json(health);
});

export default router;
