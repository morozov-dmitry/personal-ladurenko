# Lostal Admin API Documentation

## 📚 API Documentation

The Lostal Admin API provides comprehensive RESTful endpoints for managing orders, users, and comments for the Lostal Legal Office admin system.

### 🔗 Access Documentation

- **Swagger UI**: `http://localhost:3000/api/docs`
- **API Base URL**: `http://localhost:3000/api`

### 🏥 Health Endpoints

#### GET `/api/health`
Get overall system health status including DynamoDB connection.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0",
  "services": {
    "dynamodb": {
      "status": "healthy",
      "region": "eu-central-1",
      "environment": "development",
      "connected": true
    }
  }
}
```

#### GET `/api/health/dynamodb`
Get detailed DynamoDB health status.

### 📋 Orders Management

#### POST `/api/orders`
Create a new order.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+380961234567",
  "message": "I need legal consultation about contract law",
  "status": 1
}
```

#### GET `/api/orders`
Get all orders.

#### GET `/api/orders/:id`
Get order by ID.

#### PUT `/api/orders/:id`
Update an existing order.

#### DELETE `/api/orders/:id`
Delete an order.

### 👥 Users Management

#### POST `/api/users`
Create a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "name": "John Doe",
  "town": "Kyiv",
  "address": "123 Main Street, Apt 4B",
  "email": "john.doe@example.com",
  "phone": "+380961234567",
  "status": 1
}
```

#### GET `/api/users`
Get all users.

#### GET `/api/users/:id`
Get user by ID.

#### PUT `/api/users/:id`
Update an existing user.

#### DELETE `/api/users/:id`
Delete a user.

### 💬 Comments Management

#### POST `/api/comments`
Create a new comment.

**Request Body:**
```json
{
  "name": "Іван Петренко",
  "nameRu": "Иван Петренко",
  "message": "Дуже задоволений якістю послуг!",
  "messageRu": "Очень доволен качеством услуг!",
  "photo": "https://example.com/photo.jpg",
  "score": 5,
  "status": 1
}
```

#### GET `/api/comments`
Get all comments.

#### GET `/api/comments/:id`
Get comment by ID.

#### PUT `/api/comments/:id`
Update an existing comment.

#### DELETE `/api/comments/:id`
Delete a comment.

## 🔧 Development

### Prerequisites
- Node.js 22+
- npm or yarn
- AWS credentials configured

### Installation
```bash
npm install
```

### Running the API
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### Building
```bash
npm run build
```

## 🛠️ Features

- **Swagger/OpenAPI Documentation**: Interactive API documentation
- **Validation**: Request/response validation using class-validator
- **DynamoDB Integration**: AWS DynamoDB for data persistence
- **CORS Support**: Cross-origin resource sharing enabled
- **Error Handling**: Comprehensive error handling and HTTP status codes
- **TypeScript**: Full TypeScript support with type safety

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## 🔐 Authentication

The API supports JWT Bearer token authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🌍 Environment Variables

- `NODE_ENV`: Environment (development, staging, production)
- `PORT`: Server port (default: 3000)
- `AWS_REGION`: AWS region for DynamoDB
- `FRONTEND_URL`: Frontend URL for CORS

## 📊 Database Schema

### Orders Table
- `id` (String, Primary Key)
- `name` (String, Required)
- `phone` (String, Required)
- `message` (String, Required)
- `status` (Number, Default: 1)
- `createdAt` (Date)
- `updatedAt` (Date)

### Users Table
- `id` (String, Primary Key)
- `username` (String, Required, Unique)
- `password` (String, Required)
- `name` (String, Optional)
- `town` (String, Required)
- `address` (String, Required)
- `email` (String, Optional, Unique)
- `phone` (String, Required)
- `status` (Number, Default: 1)
- `createdAt` (Date)
- `updatedAt` (Date)

### Comments Table
- `id` (String, Primary Key)
- `name` (String, Required)
- `nameRu` (String, Required)
- `message` (String, Required)
- `messageRu` (String, Required)
- `photo` (String, Required)
- `score` (Number, Required, 1-5)
- `status` (Number, Default: 1)
- `createdAt` (Date)
- `updatedAt` (Date)

## 🚀 Deployment

The API is designed to run on AWS Lambda with API Gateway. Use the provided Terraform configuration for infrastructure deployment.

## 📞 Support

For technical support or questions about the API, please contact the development team.
