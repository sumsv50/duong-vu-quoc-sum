import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/resourceService';
import { CreateResourceDTO, UpdateResourceDTO, ResourceFilters } from '../models/resource';

export class ResourceController {
  private service: ResourceService;

  constructor() {
    this.service = new ResourceService();
  }

  createResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resourceData: CreateResourceDTO = req.body;
      const newResource = await this.service.createResource(resourceData);

      res.status(201).json({
        success: true,
        data: newResource
      });
    } catch (error) {
      next(error);
    }
  };

  getAllResources = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: ResourceFilters = {
        name: req.query.name as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const { resources, total } = await this.service.getAllResources(filters);

      res.status(200).json({
        success: true,
        count: resources.length,
        total,
        data: resources
      });
    } catch (error) {
      next(error);
    }
  };

  getResourceById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resourceId = parseInt(req.params.id);
      const resource = await this.service.getResourceById(resourceId);

      res.status(200).json({
        success: true,
        data: resource
      });
    } catch (error) {
      next(error);
    }
  };

  updateResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resourceId = parseInt(req.params.id);
      const updateData: UpdateResourceDTO = req.body;

      const updatedResource = await this.service.updateResource(resourceId, updateData);

      res.status(200).json({
        success: true,
        data: updatedResource
      });
    } catch (error) {
      next(error);
    }
  };

  // Hard delete a resource by ID
  deleteResource = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resourceId = parseInt(req.params.id);
      await this.service.deleteResource(resourceId);

      res.status(200).json({
        success: true,
        message: `Resource with ID ${resourceId} deleted successfully`
      });
    } catch (error) {
      next(error);
    }
  };
}