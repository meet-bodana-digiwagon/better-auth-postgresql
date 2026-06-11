import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { authHandler } from './apps/auth/auth-router.js';
import { testRouter } from './apps/auth/test-routes.js';
import { errorHandler } from './libraries/errors/handler.js';
import { logger } from './libraries/logger/index.js';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  const start = performance.now();
  res.on('finish', () => {
    logger.info({ method: req.method, url: req.originalUrl, status: res.statusCode, duration: `${(performance.now() - start).toFixed(0)}ms` }, 'request');
  });
  next();
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { error: 'Too many attempts, try again later' },
});

app.use('/api/auth', authLimiter, authHandler);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/test', testRouter);

app.use(errorHandler);

export { app };
