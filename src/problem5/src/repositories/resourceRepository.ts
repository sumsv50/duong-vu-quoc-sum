import pool from '../config/database';
import { Resource, CreateResourceDTO, UpdateResourceDTO, ResourceFilters } from '../models/resource';

export class ResourceRepository {
  async create(resource: CreateResourceDTO): Promise<Resource> {
    const { name, description } = resource;
    const query = `
      INSERT INTO resources (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const result = await pool.query(query, [name, description]);
    return result.rows[0];
  }

  async findAll(filters: ResourceFilters): Promise<{ resources: Resource[], total: number }> {
    let query = `
      SELECT id, name, description, created_at as "createdAt", updated_at as "updatedAt"
      FROM resources
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    if (filters.name) {
      query += ` AND name ILIKE $${paramIndex}`;
      queryParams.push(`%${filters.name}%`);
      paramIndex++;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) 
      FROM (${query}) as count_query
    `;
    const countResult = await pool.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await pool.query(query, queryParams);

    return {
      resources: result.rows,
      total
    };
  }

  async findById(id: number): Promise<Resource | null> {
    const query = `
      SELECT id, name, description, created_at as "createdAt", updated_at as "updatedAt"
      FROM resources
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async update(id: number, data: UpdateResourceDTO): Promise<Resource> {
    const { name, description } = data;
    let query = 'UPDATE resources SET updated_at = NOW()';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      query += `, name = $${paramIndex}`;
      queryParams.push(name);
      paramIndex++;
    }

    if (description !== undefined) {
      query += `, description = $${paramIndex}`;
      queryParams.push(description);
      paramIndex++;
    }

    query += ` WHERE id = $${paramIndex} RETURNING id, name, description, created_at as "createdAt", updated_at as "updatedAt"`;
    queryParams.push(id);

    const result = await pool.query(query, queryParams);
    return result.rows[0];
  }

  // Hard delete a resource by ID
  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM resources WHERE id = $1';
    const result = await pool.query(query, [id]);

    return !!result.rowCount;
  }
}