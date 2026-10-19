import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initDatabase } from './db/database.js';

import itemsRouter from './routes/items.js';
import recommendationsRouter from './routes/recommendations.js';
import outfitsRouter from './routes/outfits.js';
import preferencesRouter from './routes/preferences.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// Initialize DB schema & default user
initDatabase();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : [CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for visibility
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Virtual Wardrobe Analyzer API',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/outfits', outfitsRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/users', usersRouter);

// Serve static client assets in production if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: `API route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start listening if run directly
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isDirectRun && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✨ Virtual Wardrobe Analyzer Backend running at http://localhost:${PORT}`);
  });
}

export default app;
