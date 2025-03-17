# Orders API Documentation

This document provides detailed information about the Orders API endpoints.

## Authentication

All endpoints require authentication using a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Get All Orders

Retrieves a list of all orders.

- **URL**: `/orders`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions Required**: `ADMIN`

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "user_id": "string",
      "weight": number,
      "length": number,
      "width": number,
      "height": number,
      "product_type": "string",
      "delivery_city": "string",
      "destination_address": "string",
      "status": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### Get Order by ID

Retrieves a specific order by its ID.

- **URL**: `/orders/:id`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions Required**: `ADMIN` or `CUSTOMER`
- **URL Parameters**: `id=[string]`

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "user_id": "string",
    "weight": number,
    "length": number,
    "width": number,
    "height": number,
    "product_type": "string",
    "delivery_city": "string",
    "destination_address": "string",
    "status": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### Get Order Status History

Retrieves the status history of a specific order.

- **URL**: `/orders/:id/status-history`
- **Method**: `GET`
- **Auth Required**: Yes
- **Permissions Required**: `ADMIN` or `CUSTOMER`
- **URL Parameters**: `id=[string]`

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": [
    {
      "status": "string",
      "timestamp": "string"
    }
  ]
}
```

### Create Order

Creates a new order.

- **URL**: `/orders`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions Required**: `CUSTOMER`

#### Request Body

```json
{
  "weight": number,
  "length": number,
  "width": number,
  "height": number,
  "product_type": "string",
  "delivery_city": "string",
  "destination_address": "string"
}
```

#### Success Response

- **Code**: `201 Created`
- **Content Example**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "user_id": "string",
    "weight": number,
    "length": number,
    "width": number,
    "height": number,
    "product_type": "string",
    "delivery_city": "string",
    "destination_address": "string",
    "status": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### Update Order Status

Updates the status of a specific order.

- **URL**: `/orders/:id/status`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Permissions Required**: `ADMIN`
- **URL Parameters**: `id=[string]`

#### Request Body

```json
{
  "status": "string"
}
```

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "data": {
    "id": "string",
    "status": "string",
    "updated_at": "string"
  }
}
```

### Update Order Route

Updates the route assigned to a specific order.

- **URL**: `/orders/:id/route`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Permissions Required**: `ADMIN`
- **URL Parameters**: `id=[string]`

#### Request Body

```json
{
  "route_id": "string"
}
```

#### Success Response

- **Code**: `200 OK`
- **Content Example**:

```json
{
  "success": true,
  "message": "Transporter capacity updated successfully"
}
```

## Error Responses

### Common Error Responses

- **401 Unauthorized**

```json
{
  "success": false,
  "error": "Authentication required"
}
```

- **403 Forbidden**

```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

- **404 Not Found**

```json
{
  "success": false,
  "error": "Order not found"
}
```

- **500 Internal Server Error**

```json
{
  "success": false,
  "error": "Internal server error"
}
```
