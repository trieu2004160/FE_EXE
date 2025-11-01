// API configuration
// Use relative path to leverage Vite proxy in development
// Vite proxy will forward /api/* to https://localhost:5001/api/*
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

console.log('[apiService] API_BASE_URL configured:', API_BASE_URL)

// Base Types
export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
  success?: boolean;
  errors?: string[];
}

// Shop Dashboard Types (matching backend DTOs)
// Backend returns PascalCase, so we support both formats
export interface ShopDashboardDto {
  // PascalCase (from backend)
  TotalProducts?: number;
  ProductsInStock?: number;
  OutOfStockProducts?: number;
  PendingOrderItems?: number;
  // camelCase (converted)
  totalProducts?: number;
  productsInStock?: number;
  outOfStockProducts?: number;
  pendingOrderItems?: number;
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
  imageUrl?: string; // Single image URL (normalized)
  imageUrls?: string[]; // Array of image URLs (camelCase from frontend)
  ImageUrls?: string[]; // Array from backend (PascalCase)
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
    
    // Get token from localStorage
    const token = localStorage.getItem('userToken');
    
    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Copy existing headers
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    // Set Content-Type only if not already set and not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    // Add Authorization header with Bearer token
    if (token && token !== 'authenticated' && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    } else {
      console.warn(`[apiService] No valid token found for request to ${endpoint}`, {
        hasToken: !!token,
        tokenValue: token?.substring(0, 30) || 'null/empty'
      });
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      console.log('[apiService] Making request:', {
        url,
        method: config.method || 'GET',
        hasAuth: !!headers['Authorization'],
      });

      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorData: any = {};
        
        try {
          const responseText = await response.text();
          if (responseText) {
            errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        // Enhanced logging for 401 errors
        if (response.status === 401) {
          const tokenInfo = this.getTokenInfo(token);
          console.error('[apiService] Unauthorized (401):', {
            endpoint,
            url,
            errorMessage,
            errorData,
            token: token ? `${token.substring(0, 30)}...` : 'missing',
            tokenInfo: tokenInfo ? {
              email: tokenInfo.email,
              role: tokenInfo.role,
              shopId: tokenInfo.ShopId,
              exp: new Date(tokenInfo.exp * 1000).toISOString(),
            } : null,
            responseHeaders: Object.fromEntries(response.headers.entries()),
          });
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // Handle network errors (Failed to fetch)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('[apiService] Network error (Failed to fetch):', {
          endpoint,
          url,
          baseURL: this.baseURL,
          possibleCauses: [
            'Backend server is not running',
            'CORS issue - check backend CORS configuration',
            'Network connectivity issue',
            'SSL certificate issue (if using HTTPS)',
            'Wrong URL or port'
          ],
          suggestion: `Make sure backend is running at ${url.includes('localhost:5001') ? 'https://localhost:5001' : this.baseURL}`,
        });
        
        throw new Error(`Không thể kết nối đến server. Vui lòng kiểm tra:\n1. Backend server đang chạy không?\n2. URL: ${url}\n3. CORS configuration`);
      }
      
      console.error('[apiService] Request failed:', {
        endpoint,
        url,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        token: token ? `${token.substring(0, 30)}...` : 'missing',
      });
      throw error;
    }
  }

  // Helper method to decode token info for debugging
  private getTokenInfo(token: string | null): { email?: string; role?: string | string[]; ShopId?: string; exp?: number } | null {
    if (!token || token === 'authenticated') return null;
    
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = JSON.parse(atob(paddedPayload));
      
      return {
        email: decoded.email || decoded[`http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`],
        role: decoded.role || decoded[`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`],
        ShopId: decoded.ShopId || decoded.shopId,
        exp: decoded.exp,
      };
    } catch {
      return null;
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

  // ==================== SHOP API ====================
  // Base URL: /api/shop

  /**
   * Get shop dashboard data
   * GET /api/shop/dashboard
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Lấy dữ liệu cho trang Dashboard (Tổng SP, SP hết hàng, Đơn hàng chờ xử lý)
   * Backend trả về PascalCase (TotalProducts, ProductsInStock, etc.) - ASP.NET default
   */
  async getShopDashboard(): Promise<ShopDashboardDto> {
    try {
      const data = await this.request<any>('/shop/dashboard', {
        method: 'GET',
      });
      
      console.log('[apiService] Dashboard response (raw):', data);
      
      // Backend returns PascalCase by default (ASP.NET Core)
      // Convert to camelCase for frontend use
      const result = {
        // PascalCase (keep original from backend)
        TotalProducts: data.TotalProducts ?? data.totalProducts ?? 0,
        ProductsInStock: data.ProductsInStock ?? data.productsInStock ?? 0,
        OutOfStockProducts: data.OutOfStockProducts ?? data.outOfStockProducts ?? 0,
        PendingOrderItems: data.PendingOrderItems ?? data.pendingOrderItems ?? 0,
        // camelCase (converted for frontend)
        totalProducts: data.TotalProducts ?? data.totalProducts ?? 0,
        productsInStock: data.ProductsInStock ?? data.productsInStock ?? 0,
        outOfStockProducts: data.OutOfStockProducts ?? data.outOfStockProducts ?? 0,
        pendingOrderItems: data.PendingOrderItems ?? data.pendingOrderItems ?? 0,
      };
      
      console.log('[apiService] Dashboard response (converted):', result);
      return result;
    } catch (error) {
      console.error('[apiService] Error in getShopDashboard:', error);
      throw error;
    }
  }

  /**
   * Get shop profile
   * GET /api/shop/profile
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Lấy thông tin chi tiết của cửa hàng (Tên, Mô tả, SĐT, Ảnh) để hiển thị trong trang "Cài đặt"
   */
  async getShopProfile() {
    return this.request('/shop/profile', {
      method: 'GET',
    });
  }

  /**
   * Update shop profile
   * PUT /api/shop/profile
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Cập nhật thông tin cửa hàng (hỗ trợ cả URL và upload ảnh)
   */
  async updateShopProfile(profileData: {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
  }) {
    return this.request('/shop/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  /**
   * Get shop products
   * GET /api/shop/products
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Lấy danh sách chỉ những sản phẩm mà Shop này sở hữu
   */
  async getShopProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/shop/products?${queryString}` : '/shop/products';
    
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Create a new product
   * POST /api/shop/products
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Tạo một sản phẩm mới (hỗ trợ cả URL và upload ảnh)
   */
  async createShopProduct(productData: {
    name: string;
    description: string;
    price: number;
    category: string;
    images?: string[];
    inStock: boolean;
  }) {
    return this.request('/shop/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Update a product
   * PUT /api/shop/products/{id}
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Cập nhật sản phẩm của Shop (BE kiểm tra quyền sở hữu)
   */
  async updateShopProduct(id: string, productData: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    images?: string[];
    inStock?: boolean;
  }) {
    return this.request(`/api/shop/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  /**
   * Delete a product
   * DELETE /api/shop/products/{id}
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Xóa sản phẩm của Shop (BE kiểm tra quyền sở hữu)
   */
  async deleteShopProduct(id: string) {
    return this.request(`/api/shop/products/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get shop orders
   * GET /api/shop/orders
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Lấy danh sách các món hàng (OrderItems) thuộc về Shop, kèm thông tin khách hàng, trạng thái xử lý
   */
  async getShopOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/shop/orders?${queryString}` : '/shop/orders';
    
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Update order status
   * PUT /api/shop/orders/items/{orderItemId}/status
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Shop cập nhật trạng thái xử lý của một món hàng (Pending -> Preparing -> Shipped...)
   */
  async updateOrderStatus(orderItemId: string, status: string) {
    return this.request(`/api/shop/orders/items/${orderItemId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  /**
   * Get shop reviews
   * GET /api/shop/reviews
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Lấy danh sách tất cả các đánh giá về sản phẩm của Shop
   */
  async getShopReviews(params?: {
    page?: number;
    limit?: number;
    rating?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.rating) searchParams.append('rating', params.rating.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/shop/reviews?${queryString}` : '/shop/reviews';
    
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Get shop statistics
   * GET /api/shop/statistics
   * Quyền: Chỉ Shop
   * Nhiệm vụ & Tác dụng: Lấy dữ liệu thống kê doanh thu cơ bản (doanh thu tháng này, số đơn...) cho Shop
   */
  async getShopStatistics() {
    return this.request('/shop/statistics', {
      method: 'GET',
    });
  }

  /**
   * Upload shop image
   * POST /api/shop/upload-image
   * Helper method for uploading shop-related images
   */
  async uploadShopImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('userToken');
    const headers: Record<string, string> = {};
    
    if (token && token !== 'authenticated') {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${this.baseURL}/api/shop/upload-image`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
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