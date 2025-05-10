# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API does not require authentication.

## Endpoints

### GET /

Returns a welcome message.

**Response**

```json
{
  "message": "Welcome to Beatlenuts-GR API"
}
```

### GET /examples

Returns a list of all examples.

**Response**

```json
[
  {
    "id": 1,
    "name": "Example 1",
    "createdAt": "2023-05-10T12:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Example 2",
    "createdAt": "2023-05-10T12:00:00.000Z"
  }
]
```

### GET /examples/:id

Returns a single example by ID.

**Parameters**

- `id` (path parameter): The ID of the example to retrieve

**Response (Success)**

```json
{
  "id": "123",
  "name": "Example",
  "createdAt": "2023-05-10T12:00:00.000Z"
}
```

**Response (Not Found)**

```json
{
  "message": "Example not found"
}
```

### POST /examples

Creates a new example.

**Request Body**

```json
{
  "name": "New Example"
}
```

**Response**

```json
{
  "id": "abc123",
  "name": "New Example",
  "createdAt": "2023-05-10T12:00:00.000Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes for different types of errors:

- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server error

Error responses include a message field explaining the error.

**Example Error Response**

```json
{
  "error": "Something went wrong!"
}
```