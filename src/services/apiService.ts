// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// Base Types
export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  success?: boolean;
  errors?: string[];
}

// Account Types
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

// Profile Types
export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  features?: string;
  imageUrl?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: string | Record<string, string>; // Can be JSON string or Dictionary object
  productCategoryId: number;
  shop?: {
    id: number;
    shopName: string;
  };
  reviews?: ProductReview[];
}

export interface CreateProductRequest {
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

export interface UpdateProductRequest {
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

export interface ProductDetailResponse {
  product: Product;
  relatedProducts: Product[];
}

// Review Types
export interface ProductReview {
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

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

// Search Types
export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  page?: number;
  pageSize?: number;
}

export interface SearchResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Admin Types
export interface GrantShopRoleRequest {
  userEmail: string;
  shopName: string;
}

export interface GrantShopRoleResponse {
  message: string;
  shopId: number;
}

// API service class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('userToken');
    if (token && token !== 'authenticated') {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ==================== ACCOUNT API ====================
  // Base URL: /api/accounts

  /**
   * Register a new user account
   * POST /api/accounts/register
   */
  async register(data: RegisterRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * User login
   * POST /api/accounts/login
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/accounts/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Change user password
   * POST /api/accounts/changepassword
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/changepassword', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete user account
   * DELETE /api/accounts/deleteme
   */
  async deleteAccount(data: DeleteAccountRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/deleteme', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  }

  // ==================== PROFILE API ====================
  // Base URL: /api/profile

  /**
   * Get current user profile
   * GET /api/profile/me
   */
  async getProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/profile/me', {
      method: 'GET',
    });
  }

  /**
   * Update current user profile
   * PUT /api/profile/me
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ==================== CATEGORIES API ====================
  // Base URL: /api/categories

  /**
   * Get all categories
   * GET /api/categories
   */
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories', {
      method: 'GET',
    });
  }

  /**
   * Get products by category
   * GET /api/categories/{categoryId}/products
   */
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return this.request<Product[]>(`/categories/${categoryId}/products`, {
      method: 'GET',
    });
  }

  /**
   * Create a new category
   * POST /api/categories
   */
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a category
   * PUT /api/categories/{id}
   */
  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<void> {
    return this.request<void>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a category
   * DELETE /api/categories/{id}
   */
  async deleteCategory(id: number): Promise<void> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== PRODUCTS API ====================
  // Base URL: /api/products

  /**
   * Get all products
   * GET /api/products
   */
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/products', {
      method: 'GET',
    });
  }

  /**
   * Get product by ID with details and related products
   * GET /api/products/{id}
   */
  async getProductById(id: number): Promise<ProductDetailResponse> {
    return this.request<ProductDetailResponse>(`/products/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Create a new product
   * POST /api/products
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a product
   * PUT /api/products/{id}
   */
  async updateProduct(id: number, data: UpdateProductRequest): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a product
   * DELETE /api/products/{id}
   */
  async deleteProduct(id: number): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== REVIEWS API ====================
  // Base URL: /api/products/{productId}/reviews

  /**
   * Get reviews for a product
   * GET /api/products/{productId}/reviews
   */
  async getProductReviews(productId: number): Promise<ProductReview[]> {
    return this.request<ProductReview[]>(`/products/${productId}/reviews`, {
      method: 'GET',
    });
  }

  /**
   * Create a review for a product
   * POST /api/products/{productId}/reviews
   */
  async createProductReview(productId: number, data: CreateReviewRequest): Promise<ProductReview> {
    return this.request<ProductReview>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== SEARCH API ====================
  // Base URL: /api/search

  /**
   * Search products
   * GET /api/search?query={query}&category={category}&minPrice={minPrice}&maxPrice={maxPrice}
   */
  async searchProducts(params: SearchParams): Promise<SearchResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.query) searchParams.append('query', params.query);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    return this.request<SearchResponse>(`/search?${searchParams.toString()}`);
  }

  // ==================== ADMIN API ====================
  // Base URL: /api/admin

  /**
   * Grant shop role to user
   * POST /api/admin/grantshoprole
   */
  async grantShopRole(data: GrantShopRoleRequest): Promise<GrantShopRoleResponse> {
    return this.request<GrantShopRoleResponse>('/admin/grantshoprole', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Helper method to check if backend is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Upload file (for images, documents, etc.)
   * POST /api/upload
   */
  async uploadFile(file: File, type: 'product' | 'category' | 'profile' = 'product'): Promise<{
    url: string;
    fileName: string;
    fileSize: number;
    contentType: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('userToken');
    const headers: Record<string, string> = {};
    
    if (token && token !== 'authenticated') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// JWT Decode utility function
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Utility functions for auth token management
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('userToken', token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('userToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  },
  
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('userToken');
    return !!token && token !== 'authenticated';
  },

  setUserData: (userData: UserProfile) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },

  getUserData: (): UserProfile | null => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  setUserRole: (role: string) => {
    localStorage.setItem('userRole', role);
  },

  getUserRole: (): string | null => {
    return localStorage.getItem('userRole');
  },

  isAdmin: (): boolean => {
    return authUtils.getUserRole() === 'admin';
  },

  isShop: (): boolean => {
    return authUtils.getUserRole() === 'shop';
  }
};

// All types are already exported above with their interface declarations