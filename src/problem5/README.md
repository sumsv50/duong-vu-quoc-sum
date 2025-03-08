

## Problem 5
# Express TypeScript CRUD API

A robust RESTful API built with Express.js, TypeScript, and PostgreSQL that implements the controller-service-repository pattern.

## Features

- Complete CRUD operations for resources
- Controller-Service-Repository pattern for clean code architecture
- PostgreSQL database integration
- Request validation using Joi
- Error handling middleware
- Database migrations

## Live demo

The service is already deployed and accessible at https://duong-vu-quoc-sum.onrender.com. Feel free to give it a try!

*(It may take a long time on the first access due to the sleep mechanism of Render's free tier.)*


## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Project Structure

```
express-crud-api/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   └── resourceController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── joiValidationMiddleware.ts
│   ├── models/
│   │   └── resource.ts
│   ├── repositories/
│   │   └── resourceRepository.ts
│   ├── routes/
│   │   └── resourceRoutes.ts
│   ├── scripts/
│   │   └── migrate.ts
│   ├── services/
│   │   └── resourceService.ts
│   ├── utils/
│   │   └── errors.ts
│   ├── validation/
│   │   └── resourceSchemas.ts
│   └── server.ts
├── migrations/
│   └── 1741358903_create_resources_table.sql
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### 1. Install dependencies
  Make sure you have Node.js and npm installed. Then, navigate to the `src/problem55` directory and install the dependencies:

  ```sh
  cd src/problem5
  npm install
  ```

### 2. Set up environment variables

Copy the `.env.example` file to create a new `.env` file:

```bash
cp .env.example .env
```

Then edit the `.env` file with your PostgreSQL connection details:

```
# PostgreSQL connection string
DATABASE_URL=postgres://username:password@localhost:5432/database_name

# Server configuration
PORT=3000
NODE_ENV=development
```

### 3. Run migrations

Run the migration:

```bash
npm run migrate
```

### 4. Start the server

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Documentation

### Resources Endpoints

#### Create a Resource

- **URL**: `/api/resources`
- **Method**: `POST`
- **Auth Required**: No (Add your own authentication middleware as needed)
- **Request Body**:
  ```json
  {
    "name": "Example Resource",
    "description": "This is an example resource"
  }
  ```
- **Validation**:
  - `name`: Required, string, 1-255 characters
  - `description`: Optional, string
- **Success Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "name": "Example Resource",
        "description": "This is an example resource",
        "createdAt": "2025-03-07T12:00:00.000Z",
        "updatedAt": "2025-03-07T12:00:00.000Z"
      }
    }
    ```

#### Get All Resources

- **URL**: `/api/resources`
- **Method**: `GET`
- **Query Parameters**:
  - `name`: Filter resources by name (optional)
  - `page`: Page number for pagination (optional, default: 1)
  - `limit`: Items per page (optional, default: 10)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 1,
      "total": 1,
      "data": [
        {
          "id": 1,
          "name": "Example Resource",
          "description": "This is an example resource",
          "createdAt": "2025-03-07T12:00:00.000Z",
          "updatedAt": "2025-03-07T12:00:00.000Z"
        }
      ]
    }
    ```

#### Get a Specific Resource

- **URL**: `/api/resources/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: Resource ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "name": "Example Resource",
        "description": "This is an example resource",
        "createdAt": "2025-03-07T12:00:00.000Z",
        "updatedAt": "2025-03-07T12:00:00.000Z"
      }
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "success": false,
      "error": "Resource with ID 1 not found"
    }
    ```

#### Update a Resource

- **URL**: `/api/resources/:id`
- **Method**: `PATCH`
- **URL Parameters**:
  - `id`: Resource ID
- **Request Body**:
  ```json
  {
    "name": "Updated Resource",
    "description": "This is an updated description"
  }
  ```
- **Validation**:
  - `name`: Optional, if provided: string, 1-255 characters
  - `description`: Optional, string
  - At least one field must be provided
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "name": "Updated Resource",
        "description": "This is an updated description",
        "createdAt": "2025-03-07T12:00:00.000Z",
        "updatedAt": "2025-03-07T12:30:00.000Z"
      }
    }
    ```

#### Delete a Resource (hard delete)

- **URL**: `/api/resources/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: Resource ID
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Resource with ID 1 deleted successfully"
    }
    ```
- **Error Response**:
  - **Code**: 404 Not Found
  - **Content**:
    ```json
    {
      "success": false,
      "error": "Resource with ID 1 not found"
    }
    ```

## Error Handling

The API uses a centralized error handling mechanism. All the errors are caught in the controllers and passed to the error handling middleware.

Error responses have the following format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Validation errors provide more details:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": "Resource name is required"
}
```

## Testing the API

You can test the API using tools like:

- [Postman](https://www.postman.com/)
- [cURL](https://curl.se/)
- [Insomnia](https://insomnia.rest/)

### Example cURL commands:

1. Create a resource:
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name": "Example Resource", "description": "This is an example resource"}'
```

2. Get all resources:
```bash
curl http://localhost:3000/api/resources
```

3. Get a specific resource:
```bash
curl http://localhost:3000/api/resources/1
```

4. Update a resource:
```bash
curl -X PUT http://localhost:3000/api/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Resource"}'
```

5. Delete a resource:
```bash
curl -X DELETE http://localhost:3000/api/resources/1
```

## Extending the Project

### Adding Authentication

You can add authentication to the API by implementing middleware that checks for JWT tokens or other authentication methods.

### Adding More Resources

To add more resources to the API, follow the same pattern:
1. Create a model for the resource
2. Create a repository for database interactions
3. Create a service for business logic
4. Create a controller for handling HTTP requests
5. Create routes for the resource
6. Add validation schemas
