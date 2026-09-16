import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './server/db.js';
import { apiRouter } from './server/routes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security hardening: hide server framework signature
  app.disable('x-powered-by');

  // Middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // CORS Configuration
  const rawCorsEnv = process.env.CORS_ALLOWED_ORIGINS || '';
  const explicitOrigins = rawCorsEnv
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  if (process.env.APP_URL) {
    explicitOrigins.push(process.env.APP_URL.trim());
  }

  // Same-origin SPA plus any explicitly allow-listed origins (APP_URL / CORS_ALLOWED_ORIGINS).
  // Browser same-origin and non-browser requests send no Origin header, so they pass.
  const isOriginAllowed = (origin?: string): boolean => {
    if (!origin) return true;
    if (explicitOrigins.some(allowed => allowed.toLowerCase() === origin.toLowerCase())) {
      return true;
    }
    try {
      const hostname = new URL(origin).hostname.toLowerCase();
      if (hostname === 'enterpriseceo.africa' || hostname.endsWith('.enterpriseceo.africa')) return true;
      if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    } catch {
      return false;
    }
    return false;
  };

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      callback(null, isOriginAllowed(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  // Initialise database & admin seed
  try {
    await initDatabase();
  } catch (err) {
    console.error('[Server] Database initialization note:', err);
  }

  // Mount API routes FIRST
  app.use('/api', apiRouter);

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Development: Vite middleware / Production: static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server Error] Failed to boot server:', err);
});
