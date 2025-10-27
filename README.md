# Product Management API

A RESTful API built with Express.js for managing products with authentication, validation, and advanced features.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/PLP-MERN-Stack-Development/express-js-server-side-framework-c-johnmaxwell.git
cd /path/to/express-js-server-side-framework-c-johnmaxwell
```
2. Install dependencies
```bash
npm install
```
3. Set up environmental variables
```bash
cp .env.example .env
# Edit .env with your values
```
4. Start the server
```bash
npm start
```

## API Documentation

### Base URL
http://localhost:3000

### Authentication
Protected routes require an API key in the request headers: x-api-key: secret-api-key-123

#### Public routes (no API required)
    GET /
    GET /api/products
    GET /api/products/:id
    GET /api/products/search
    GET /api/products/stats

#### Protected routes (API key requires)
   POST /api/products
   PUT /api/products/:id
   DELETE /api/products/:id

#### Available API keys
   secret-api-key-123
   test-key-456


### Endpoints 

#### 1. Root Endpoint
GET /
Returns welcome message.
Response: "Welcome to my FIRST API... Visit /api/products to see all products."

#### 2. Get All Products
GET /api/products
Retrieve all products with optional filtering and pagination.
Query Parameters:
   category (optional) - Filter by category
   inStock (optional) - Filter by stock status (true/false)
   minPrice (optional) - Minimum price
   maxPrice (optional) - Maximum price
   page (optional) - Page number (default: 1)
   limit (optional) - Items per page (default: 10)
Example request: GET /api/products?category=pencils&inStock=true&page=1&limit=5
Example response:
```json
{
  "success": true,
  "data": [
    {
      "id": "2",
      "name": "Mechanical Pencil",
      "description": "Metallic with a case of free 0.5 hb leds",
      "price": 800,
      "category": "pencils",
      "inStock": false
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "itemsPerPage": 5,
    "totalItems": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

#### 3. Get Product ID
GET /api/products/:id
Retrieve a specific product by its ID.
Example request: Retrieve a specific product by its ID.
Example response:
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "SketchPad",
    "description": "Fine quality paper with 50, 140gsm sheets",
    "price": 400,
    "category": "books",
    "inStock": true
  }
}
```

#### 4. Search products
GET /api/products/search
Search products by name or description
Query parameters: q (required) - Search query
Example request: GET /api/products/search?q=charcoal
Example response:
```json
{
  "success": true,
  "data": [
    {
      "id": "4",
      "name": "Charcoal",
      "description": "Give the darkest shades of black",
      "price": 180,
      "category": "pencils",
      "inStock": true
    }
  ],
  "count": 1
}
```

#### 5. Get Product Statistics
GET /api/products/stats
Get statistics about products.
Example eequest: GET /api/products/stats
Example response:
```json
{
  "success": true,
  "data": {
    "totalProducts": 4,
    "inStock": 3,
    "outOfStock": 1,
    "averagePrice": 407,
    "categories": {
      "books": 1,
      "pencils": 2,
      "tool": 1
    }
  }
}
```

#### 6. Create Product
POST /api/products
Create a new product. Requires API key.
Headers:
Content-Type: application/json
x-api-key: secret-api-key-123
Request Body:
```json
{
  "name": "Watercolor Set",
  "description": "12 vibrant watercolor paints",
  "price": 35,
  "category": "paints",
  "inStock": true
}

Example Response:
json

{
  "success": true,
  "message": "Product added successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Watercolor Set",
    "description": "12 vibrant watercolor paints",
    "price": 35,
    "category": "paints",
    "inStock": true
  }
}
```

#### 7. Update Product
PUT /api/products/:id
Update an existing product. Requires API key.
Headers:
Content-Type: application/json
x-api-key: secret-api-key-123
Request Body:
```json
{
  "name": "Updated SketchPad",
  "price": 450,
  "inStock": false
}

Example Response:
json

{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "1",
    "name": "Updated SketchPad",
    "description": "Fine quality paper with 50, 140gsm sheets",
    "price": 450,
    "category": "books",
    "inStock": false
  }
}
```
 
#### 8. Delete Product
DELETE /api/products/:id
Delete a product. Requires API key.
Headers:
x-api-key: secret-api-key-123
Example Response:
```json

{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": "1",
    "name": "SketchPad",
    "description": "Fine quality paper with 50, 140gsm sheets",
    "price": 400,
    "category": "books",
    "inStock": true
  }
}
```
Error Responses
Validation Error (400)
```json

{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Price must be a number"
  ]
}
```
Not Found Error (404)
```json

{
  "success": false,
  "message": "Product not found"
}
```
Authentication Error (401)
```json

{
  "success": false,
  "message": "API key is required. Please provide x-api-key in headers."
}
```
Server Error (500)
```json

{
  "success": false,
  "message": "Something went wrong on the server"
}
```
Product Schema
```javascript
{
  id: "string", // Unique identifier (auto-generated)
  name: "string", // Product name
  description: "string", // Product description
  price: "number", // Product price
  category: "string", // Product category
  inStock: "boolean" // Stock availability
}
```
Available Categories
   books
   pencils
   tool
   paints (example)
Scripts
   npm start - Start the server
   npm test - Run tests (if available)