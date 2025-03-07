import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      error: err.message
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: err.errors || []
    });
  }

  // Handle other specific errors here

  return res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
};