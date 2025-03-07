// src/middleware/joiValidation.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

/**
 * Creates a middleware function that validates request data against a Joi schema
 * @param schema Joi validation schema
 * @param source The request property to validate ('body', 'query', 'params')
 * @returns Express middleware function
 */
export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: false
        }
      }
    });

    if (error) {
      // Transform Joi errors into a more API-friendly format
      const errors = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      next(new ValidationError('Validation failed', errors));
      return;
    }

    // Replace the request data with the validated value
    req[source] = value;
    next();
  };
};

// Define validation schemas for resources
export const resourceSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(1).max(255).required()
      .messages({
        'string.empty': 'Name cannot be empty',
        'string.min': 'Name must have at least {#limit} character',
        'string.max': 'Name cannot exceed {#limit} characters',
        'any.required': 'Name is required'
      }),
    description: Joi.string().trim().max(1000).allow('', null)
      .messages({
        'string.max': 'Description cannot exceed {#limit} characters'
      })
  }),

  update: Joi.object({
    name: Joi.string().trim().min(1).max(255).optional()
      .messages({
        'string.empty': 'Resource name cannot be empty',
        'string.min': 'Resource name must be at least {#limit} character long',
        'string.max': 'Resource name cannot exceed {#limit} characters'
      }),
    description: Joi.string().trim().max(1000).allow('', null)
      .messages({
        'string.max': 'Description cannot exceed {#limit} characters'
      })
  }).min(1).messages({ 'object.min': 'At least one field is required for update' })
};