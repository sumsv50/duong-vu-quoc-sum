import { ResourceRepository } from '../repositories/resourceRepository';
import { Resource, CreateResourceDTO, UpdateResourceDTO, ResourceFilters } from '../models/resource';
import { NotFoundError } from '../utils/errors';

export class ResourceService {
  private repository: ResourceRepository;

  constructor() {
    this.repository = new ResourceRepository();
  }

  async createResource(data: CreateResourceDTO): Promise<Resource> {
    return this.repository.create(data);
  }

  async getAllResources(filters: ResourceFilters): Promise<{ resources: Resource[], total: number }> {
    return this.repository.findAll(filters);
  }

  async getResourceById(id: number): Promise<Resource> {
    const resource = await this.repository.findById(id);

    if (!resource) {
      throw new NotFoundError(`Resource with ID ${id} not found`);
    }

    return resource;
  }

  async updateResource(id: number, data: UpdateResourceDTO): Promise<Resource> {
    const resource = await this.repository.findById(id);

    if (!resource) {
      throw new NotFoundError(`Resource with ID ${id} not found`);
    }

    return await this.repository.update(id, data);
  }

  // Hard delete a resource by ID
  async deleteResource(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundError(`Resource with ID ${id} not found`);
    }
  }
}