export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  public errors?: { field: string; message: string }[];

  constructor(message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}