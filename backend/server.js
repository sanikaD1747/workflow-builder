import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import workflowRoutes from './routes/workflows.js';
import runRoutes from './routes/runs.js';
import healthRoutes from './routes/health.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/workflow-builder';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/health', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Workflow Builder API', 
    version: '1.0.0',
    endpoints: {
      workflows: '/api/workflows',
      runs: '/api/runs',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

import { MongoMemoryServer } from 'mongodb-memory-server';

// Connect to MongoDB
const startServer = async () => {
  try {
    let mongoUri = MONGO_URL;
    
    // If we're using localhost and want to use memory server
    if (mongoUri.includes('localhost') || process.env.USE_MEMORY_DB === 'true') {
      console.log('Starting MongoDB Memory Server...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`Memory DB started at ${mongoUri}`);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startServer();

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
