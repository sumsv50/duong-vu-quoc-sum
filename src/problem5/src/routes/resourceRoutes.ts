import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController';
import { validate, resourceSchemas } from '../middleware/joiValidation';

const router = Router();
const resourceController = new ResourceController();

// Create a resource
router.post('/', validate(resourceSchemas.create), resourceController.createResource);

// Get all resources with filters
router.get('/', resourceController.getAllResources);

// Get a specific resource
router.get('/:id', resourceController.getResourceById);

// Update a resource
router.patch('/:id', validate(resourceSchemas.update), resourceController.updateResource);

// Delete a resource
router.delete('/:id', resourceController.deleteResource);

export { router as resourceRouter };