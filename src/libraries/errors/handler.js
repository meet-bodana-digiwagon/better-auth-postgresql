import { logger } from '../logger/index.js';
import { AppError } from './app-error.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    logger.error({ err, reqId: req.id }, err.message);
    return res.status(err.httpStatus).json({
      error: err.message,
      ...(err.fields && { fields: err.fields }),
    });
  }

  logger.error({ err, reqId: req.id }, 'Unhandled error');
  return res.status(500).json({ error: 'An unexpected error occurred' });
}
