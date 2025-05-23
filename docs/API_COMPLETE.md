# Complete API Documentation

**Last Updated: 20 May 2025**

## Base Configuration

### Base URL
```
Development: http://localhost:4000/api
Production: https://api.beatlenuts.com/api
```

### Headers
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

## Authentication Endpoints

### General Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user|admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    },
    "token": "string"
  }
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    },
    "token": "string"
  }
}
```

### ESM Portal Authentication

#### POST /auth/esm-login
ESM portal login.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "seller|buyer",
      "businessName": "string",
      "approved": "boolean"
    },
    "token": "string"
  }
}
```

#### POST /auth/esm-register
ESM portal registration.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "seller|buyer",
  "phoneNumber": "string",
  "businessName": "string",
  "businessDescription": "string"
}
```

#### GET /auth/esm-me
Get current ESM user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "seller|buyer",
    "approved": "boolean"
  }
}
```

## ESM Products API

### GET /esm-products
Get all products with filtering and pagination.

**Query Parameters:**
- `search` - Search query
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `seller` - Filter by seller ID
- `sortBy` - Sort by: price, date, name
- `sortOrder` - asc or desc
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "seller": {
          "_id": "string",
          "name": "string",
          "businessName": "string"
        },
        "category": "string",
        "images": ["string"],
        "availability": "boolean"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "pages": "number",
      "limit": "number"
    }
  }
}
```

### GET /esm-products/:id
Get product by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "seller": {
      "_id": "string",
      "name": "string",
      "businessName": "string"
    },
    "category": "string",
    "images": ["string"],
    "availability": "boolean",
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

### POST /esm-products
Create new product (seller only).

**Headers:**
```
Authorization: Bearer <seller_token>
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "images": ["string"],
  "availability": "boolean",
  "units": "string",
  "minOrderQuantity": "number",
  "tags": ["string"]
}
```

### PUT /esm-products/:id
Update product (seller only).

### DELETE /esm-products/:id
Delete product (seller only).

## ESM Services API

### GET /esm-services
Get all services with filtering and pagination.

**Query Parameters:**
- `search` - Search query
- `category` - Filter by category
- `location` - Filter by location
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `provider` - Filter by provider ID
- `sortBy` - Sort by: price, date, rating
- `sortOrder` - asc or desc
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "_id": "string",
        "name": "string",
        "description": "string",
        "provider": {
          "_id": "string",
          "name": "string",
          "businessName": "string"
        },
        "category": "string",
        "price": "number",
        "priceType": "string",
        "location": {
          "city": "string",
          "state": "string"
        },
        "images": ["string"],
        "active": "boolean"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "pages": "number",
      "limit": "number"
    }
  }
}
```

### POST /esm-services
Create new service (seller only).

### GET /esm-services/:id
Get service by ID.

### PUT /esm-services/:id
Update service (seller only).

### DELETE /esm-services/:id
Delete service (seller only).

## Admin API Endpoints

### GET /admin/esm/sellers
Get all ESM sellers (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "businessName": "string",
      "approved": "boolean",
      "createdAt": "date"
    }
  ]
}
```

### PUT /admin/esm/sellers/:id/approve
Approve ESM seller (admin only).

### PUT /admin/esm/sellers/:id/suspend
Suspend ESM seller (admin only).

### GET /admin/esm/products
Get all products for admin review.

### PUT /admin/esm/products/:id/approve
Approve product listing (admin only).

### GET /admin/esm/analytics
Get ESM portal analytics (admin only).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSellers": "number",
    "activeSellers": "number",
    "pendingApprovals": "number",
    "totalProducts": "number",
    "totalServices": "number",
    "totalRevenue": "number",
    "monthlyStats": {
      "sales": "number",
      "newSellers": "number",
      "newProducts": "number"
    }
  }
}
```

## Messaging API

### GET /messages
Get user's messages.

### POST /messages
Send a message.

**Request Body:**
```json
{
  "receiverId": "string",
  "subject": "string",
  "content": "string",
  "productId": "string (optional)",
  "serviceId": "string (optional)"
}
```

### GET /messages/:id
Get message thread.

### PUT /messages/:id/read
Mark message as read.

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "message": "string",
    "statusCode": "number",
    "errors": {
      "field": ["error messages"]
    }
  }
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 200 requests per minute
- **Admin endpoints**: 500 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621234567
```

## Versioning

The API uses URL versioning. Current version is v1. Future versions will be available at:

```
/api/v2/...
```

## CORS Configuration

The API accepts requests from:
- `http://localhost:3000` (development)
- `https://beatlenuts.com` (production)
- `https://admin.beatlenuts.com` (admin panel)

## Webhook Events

The following webhook events are available:

- `seller.approved` - When seller is approved
- `product.created` - When new product is listed
- `order.placed` - When order is placed
- `message.received` - When message is received

Register webhooks at `/api/webhooks/register`

## Testing

Use the test endpoints to verify API connectivity:

```bash
curl http://localhost:4000/api/health
```

Response:
```json
{
  "status": "healthy",
  "uptime": 123456,
  "timestamp": "2025-05-20T12:00:00Z"
}
```