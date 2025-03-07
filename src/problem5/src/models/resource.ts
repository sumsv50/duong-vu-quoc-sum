export interface Resource {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateResourceDTO {
  name: string;
  description?: string;
}

export interface UpdateResourceDTO {
  name?: string;
  description?: string;
}

export interface ResourceFilters {
  name?: string;
  page?: number;
  limit?: number;
}
