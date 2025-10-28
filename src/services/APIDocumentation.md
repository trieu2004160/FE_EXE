# API Documentation - NOVA Offering System

This document provides a comprehensive overview of all API endpoints available in the NOVA Offering System backend.

## Base Configuration

- **Base URL**: `http://localhost:5000/api` (configurable via `VITE_API_BASE_URL`)
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## API Response Format

Most API responses follow this standard format:

```typescript
interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  success?: boolean;
  errors?: string[];
}
```

---

## 1. Accounts API 🔑
**Base URL**: `/api/accounts`

### Register User
```http
POST /api/accounts/register
```

**Request Body:**
```typescript
interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}
```

**Response:** `ApiResponse` with message

---

### User Login
```http
POST /api/accounts/login
```

**Request Body:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:** 
```typescript
{
  token: string;
}
```

---

### Change Password
```http
POST /api/accounts/changepassword
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
```

**Response:** `ApiResponse` with message

---

### Delete Account
```http
DELETE /api/accounts/deleteme
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
interface DeleteAccountRequest {
  password: string;
}
```

**Response:** `ApiResponse` with message

---

## 2. Profile API 🧑‍💼
**Base URL**: `/api/profile`

### Get User Profile
```http
GET /api/profile/me
```

**Headers:** `Authorization: Bearer {token}`

**Response:** 
```typescript
{
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
}
```

---

### Update User Profile
```http
PUT /api/profile/me
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
}
```

**Response:** `ApiResponse` with message

---

## 3. Categories API 🗂️
**Base URL**: `/api/categories`

### Get All Categories
```http
GET /api/categories
```

**Response:** `Category[]`

---

### Get Products by Category
```http
GET /api/categories/{categoryId}/products
```

**Response:** `Product[]`

---

### Create Category
```http
POST /api/categories
```

**Headers:** `Authorization: Bearer {token}` (Admin only)

**Request Body:**
```typescript
interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}
```

**Response:** `Category`

---

### Update Category
```http
PUT /api/categories/{id}
```

**Headers:** `Authorization: Bearer {token}` (Admin only)

**Request Body:**
```typescript
interface UpdateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}
```

**Response:** 204 No Content

---

### Delete Category
```http
DELETE /api/categories/{id}
```

**Headers:** `Authorization: Bearer {token}` (Admin only)

**Response:** 204 No Content

---

## 4. Products API 📦
**Base URL**: `/api/products`

### Get All Products
```http
GET /api/products
```

**Response:** `Product[]`

---

### Get Product by ID
```http
GET /api/products/{id}
```

**Response:** 
```typescript
{
  product: Product;
  relatedProducts: Product[];
}
```

---

### Create Product
```http
POST /api/products
```

**Headers:** `Authorization: Bearer {token}` (Shop only)

**Request Body:**
```typescript
interface CreateProductRequest {
  name: string;
  description?: string;
  features?: string;
  imageUrl?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: string;
  productCategoryId: number;
}
```

**Response:** `Product`

---

### Update Product
```http
PUT /api/products/{id}
```

**Headers:** `Authorization: Bearer {token}` (Shop only)

**Request Body:** `UpdateProductRequest` (same fields as CreateProductRequest, all required)

**Response:** 204 No Content

---

### Delete Product
```http
DELETE /api/products/{id}
```

**Headers:** `Authorization: Bearer {token}` (Shop only)

**Response:** 204 No Content

---

## 5. Reviews API ⭐️
**Base URL**: `/api/products/{productId}/reviews`

### Get Product Reviews
```http
GET /api/products/{productId}/reviews
```

**Response:** `ProductReview[]`

---

### Create Product Review
```http
POST /api/products/{productId}/reviews
```

**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```typescript
interface CreateReviewRequest {
  rating: number;
  comment?: string;
}
```

**Response:** `ProductReview`

---

## 6. Admin API 🛠️
**Base URL**: `/api/admin`

### Grant Shop Role
```http
POST /api/admin/grantshoprole
```

**Headers:** `Authorization: Bearer {token}` (Admin only)

**Request Body:**
```typescript
interface GrantShopRoleRequest {
  userEmail: string;
  shopName: string;
}
```

**Response:** 
```typescript
{
  message: string;
  shopId: number;
}
```

---

## Data Models

### User Profile
```typescript
interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
}
```

### Category
```typescript
interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}
```

### Product
```typescript
interface Product {
  id: number;
  name: string;
  description?: string;
  features?: string;
  imageUrl?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: string;
  productCategoryId: number;
  shop?: {
    id: number;
    shopName: string;
  };
  reviews?: ProductReview[];
}
```

### Product Review
```typescript
interface ProductReview {
  id: number;
  userId: string;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    fullName: string;
  };
}
```

---

## Usage Examples

### Login Example
```typescript
import { apiService, authUtils } from '@/services/apiService';

try {
  const response = await apiService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  if (response.token) {
    authUtils.setToken(response.token);
    // Navigate to profile or get user data
    const userProfile = await apiService.getProfile();
    authUtils.setUserData(userProfile);
  }
} catch (error) {
  console.error('Login failed:', error);
}
```

### Get Products Example
```typescript
try {
  const products = await apiService.getProducts();
  console.log('Products:', products);
} catch (error) {
  console.error('Failed to get products:', error);
}
```

### Get Product Details Example
```typescript
try {
  const productDetails = await apiService.getProductById(1);
  console.log('Product:', productDetails.product);
  console.log('Related Products:', productDetails.relatedProducts);
} catch (error) {
  console.error('Failed to get product details:', error);
}
```

### Create Review Example
```typescript
try {
  const review = await apiService.createProductReview(1, {
    rating: 5,
    comment: 'Excellent product!'
  });
  
  console.log('Review created:', review);
} catch (error) {
  console.error('Failed to create review:', error);
}
```

---

## Error Handling

All API calls can throw errors. Handle them appropriately:

```typescript
try {
  const response = await apiService.someMethod();
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
    // Show user-friendly error message
  }
}
```

---

## Authentication

Use the `authUtils` helper functions for token management:

```typescript
import { authUtils } from '@/services/apiService';

// Set token
authUtils.setToken(token);

// Check if authenticated
if (authUtils.isAuthenticated()) {
  // User is logged in
}

// Check user role
if (authUtils.isAdmin()) {
  // User is admin
}

if (authUtils.isShop()) {
  // User is shop
}

// Get user data
const userData = authUtils.getUserData();

// Logout
authUtils.removeToken();
```

---

## Role-Based Access Control

The backend implements role-based access control:

- **Admin**: Full access to all endpoints including admin functions
- **Shop**: Can create/update/delete their own products
- **User/Guest**: Can view products and create reviews

Protected endpoints require the `Authorization: Bearer {token}` header and appropriate role permissions.