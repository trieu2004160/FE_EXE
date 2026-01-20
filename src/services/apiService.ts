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

  // Extra fields used by ShopDashboard UI (may not be provided by backend)
  totalOrders?: number;
  pendingOrders?: number;
  monthlyRevenue?: number;
  recentOrders?: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
  recentActivities?: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

// Account Types
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  mustChangePassword?: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForceChangePasswordRequest {
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Profile Types
export interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
  avatarFile?: File;
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
  bannerTitle?: string;
  description?: string;
  imageUrl?: string;
  imageFile?: File;
}

export interface UpdateCategoryRequest {
  name: string;
  bannerTitle?: string;
  description?: string;
  imageUrl?: string;
  imageFile?: File;
}

// Display Category Mapping Types
export interface DisplayCategoryMappingResponse {
  mappings: Record<string, number | null>;
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
  product?: Product;
  relatedProducts?: Product[];
  Product?: Product;
  RelatedProducts?: Product[];
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

// Global Search Types (matching backend GlobalSearchResponseDto)
export interface ProductSearchResultDto {
  id: number;
  name: string;
  imageUrl?: string;
  basePrice: number;
  shopName: string;
}

export interface ShopSearchResultDto {
  id: number;
  name: string;
  imageUrl?: string;
  popularProducts: ProductSearchResultDto[];
}

export interface GlobalSearchResponseDto {
  shops: ShopSearchResultDto[];
  products: ProductSearchResultDto[];
}

// Public Shop Profile Types
export interface PublicShopProfileDto {
  id: number;
  name: string;
  ownerFullName: string;
  description?: string;
  address?: string;
  avatarBase64?: string;
  contactPhoneNumber?: string;
  joinDate: string;
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

// Cart Types
export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  isSelected: boolean;
}

export interface ShopInCartDto {
  shopId: number;
  shopName: string;
  items: CartItemDto[];
}

export interface CartResponseDto {
  id: number;
  shops: ShopInCartDto[];
  totalPrice: number;
}

// UserAddress Types
export interface UpsertAddressDto {
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault?: boolean;
}

export interface AddressResponseDto {
  id: number;
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

// Order Types
export interface ShippingAddressDto {
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface CreateOrderDto {
  shippingAddress?: ShippingAddressDto;
  paymentMethod?: 'cash_on_delivery' | 'payos';
}

export interface OrderItemResponseDto {
  productId: number;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  shopName: string;
  shopStatus?: string;
}

export interface OrderResponseDto {
  id: number;
  orderNumber?: string;
  status: string;
  total: number;
  subtotal: number;
  orderDate: string;
  paymentMethod?: string;
  shippingAddress: ShippingAddressDto;
  items: OrderItemResponseDto[];
}

export interface OrderHistoryResponseDto {
  id: number;
  orderDate: string;
  status: string;
  paymentMethod?: string;
  isPaid?: boolean;
  total: number;
  totalItems: number;
  primaryProductName: string;
  primaryProductImage?: string;
}

// Admin Types
export interface AdminCategoryDto {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  isVisible?: boolean;
  displayOrder?: number;
}

export interface AdminShopDto {
  id: number;
  name: string; // Shop name
  ownerEmail: string;
  contactPhoneNumber?: string;
  isLocked: boolean;
  commissionRate?: number;
  // Additional fields that might be in response
  ownerFullName?: string;
  address?: string;
}

export interface AdminProductDto {
  id: number;
  name: string;
  shopName: string;
  categoryName: string;
  basePrice: number;
  stockQuantity: number;
  isVisible?: boolean;
}

export interface CommissionConfig {
  defaultCommissionRate?: number;
  shopCommissionRates?: Record<number, number>;
}

export interface RevenueStats {
  totalRevenue: number;
  totalCommission: number;
  totalOrders: number;
  activeShops: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;
}

export interface RevenueByShop {
  shopId: number;
  shopName: string;
  revenue: number;
  commission: number;
  orderCount: number;
  commissionRate: number;
}

// API service class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private normalizeProduct(raw: unknown): Product {
    if (!raw || typeof raw !== 'object') return raw as Product;

    const obj = raw as Record<string, unknown>;
    const shop = (obj.shop ?? obj.Shop) as Record<string, unknown> | undefined;

    const specs = (obj.specifications ?? obj.Specifications) as unknown;

    const shopId = (obj.shopId ?? obj.ShopId ?? shop?.id ?? shop?.Id) as unknown;
    const shopName = (obj.shopName ?? obj.ShopName ?? shop?.shopName ?? shop?.ShopName) as unknown;

    const normalized = { ...(obj as Record<string, unknown>) } as Record<string, unknown> & {
      shop?: { id?: number; shopName?: string };
    };

    const hasShopId = shopId !== null && shopId !== undefined;
    const hasShopName = shopName !== null && shopName !== undefined;

    if (!normalized.shop && hasShopId && hasShopName) {
      normalized.shop = {
        id: Number(shopId),
        shopName: String(shopName),
      };
    } else if (normalized.shop) {
      if (normalized.shop.id == null && hasShopId) normalized.shop.id = Number(shopId);
      if (normalized.shop.shopName == null && hasShopName) normalized.shop.shopName = String(shopName);
    }

    // Map backend PascalCase `Specifications` -> frontend camelCase `specifications`
    // Specs can be an object (Dictionary) or a JSON string depending on endpoint/mapping.
    if (normalized.specifications == null && specs != null) {
      normalized.specifications = specs as any;
    }

    return normalized as unknown as Product;
  }

  private buildUrl(endpoint: string): string {
    const normalizedBase = (this.baseURL || '').replace(/\/+$/, '');

    let normalizedEndpoint = (endpoint || '').trim();
    if (!normalizedEndpoint.startsWith('/')) {
      normalizedEndpoint = `/${normalizedEndpoint}`;
    }

    // Avoid accidental ".../api/api/..." when baseURL already includes /api
    if (/\/api$/i.test(normalizedBase) && /^\/api\b/i.test(normalizedEndpoint)) {
      normalizedEndpoint = normalizedEndpoint.replace(/^\/api\b/i, '');
      if (!normalizedEndpoint.startsWith('/')) {
        normalizedEndpoint = `/${normalizedEndpoint}`;
      }
    }

    return `${normalizedBase}${normalizedEndpoint}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint);

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
        let errorData: unknown = {};

        try {
          const responseText = await response.text();
          if (responseText) {
            errorData = JSON.parse(responseText) as unknown;

            if (typeof errorData === 'object' && errorData !== null) {
              const maybeMessage = (errorData as { message?: unknown }).message;
              const maybeError = (errorData as { error?: unknown }).error;

              if (typeof maybeMessage === 'string' && maybeMessage.trim() !== '') {
                errorMessage = maybeMessage;
              } else if (typeof maybeError === 'string' && maybeError.trim() !== '') {
                errorMessage = maybeError;
              } else {
                // ASP.NET Core validation errors (ValidationProblemDetails)
                const maybeErrors = (errorData as { errors?: unknown }).errors;
                if (typeof maybeErrors === 'object' && maybeErrors !== null) {
                  const errorsObj = maybeErrors as Record<string, unknown>;
                  const firstKey = Object.keys(errorsObj)[0];
                  const firstVal = firstKey ? errorsObj[firstKey] : undefined;
                  if (Array.isArray(firstVal) && typeof firstVal[0] === 'string') {
                    errorMessage = firstVal[0];
                  }
                }
              }
            }
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
              exp: tokenInfo.exp ? new Date(tokenInfo.exp * 1000).toISOString() : undefined,
            } : null,
            responseHeaders: Object.fromEntries(response.headers.entries()),
          });
        }

        throw new Error(errorMessage);
      }

      // Handle empty responses (common for 204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      const responseText = await response.text();
      if (!responseText) {
        return undefined as T;
      }

      try {
        return JSON.parse(responseText) as T;
      } catch {
        // Fallback for non-JSON payloads
        return responseText as unknown as T;
      }
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

        throw new Error(`KhÃ´ng thá»ƒ káº¿t ná»‘i Ä‘áº¿n server. Vui lÃ²ng kiá»ƒm tra:\n1. Backend server Ä‘ang cháº¡y khÃ´ng?\n2. URL: ${url}\n3. CORS configuration`);
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
   * Force change password (first-login flow)
   * POST /api/accounts/forcechangepassword
   */
  async forceChangePassword(data: ForceChangePasswordRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/accounts/forcechangepassword', {
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

  /**
   * Resend email verification OTP
   * POST /api/accounts/resend-verification-otp
   */
  async resendVerificationOtp(data: SendOtpRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/resend-verification-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Verify email with OTP
   * POST /api/accounts/verify-email
   */
  async verifyEmail(data: VerifyOtpRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Forgot password (send OTP)
   * POST /api/accounts/forgot-password
   */
  async forgotPassword(data: SendOtpRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Reset password with OTP
   * POST /api/accounts/reset-password
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/reset-password', {
      method: 'POST',
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
   * Uses FormData for file upload support
   */
  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse> {
    const formData = new FormData();

    // FullName lÃ required, luÃ´n pháº£i cÃ³
    const fullName = (data.fullName || '').trim();
    if (!fullName) {
      throw new Error('FullName is required');
    }
    formData.append('FullName', fullName);

    // CÃ¡c trÆ°á»ng optional - chá»‰ append náº¿u cÃ³ giÃ¡ trá»‹
    if (data.phoneNumber) {
      formData.append('PhoneNumber', data.phoneNumber.trim());
    }

    if (data.introduction) {
      formData.append('Introduction', data.introduction.trim());
    }

    // Chá»‰ append file náº¿u cÃ³
    if (data.avatarFile) {
      formData.append('AvatarFile', data.avatarFile);
    }

    // Log Ä‘á»ƒ debug
    console.log('[updateProfile] Sending FormData:', {
      FullName: fullName,
      PhoneNumber: data.phoneNumber || '(empty)',
      Introduction: data.introduction || '(empty)',
      hasAvatarFile: !!data.avatarFile,
    });

    return this.request<ApiResponse>('/profile/me', {
      method: 'PUT',
      body: formData,
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
   * Get mapping from hardcoded display categories to DB categories
   * GET /api/categories/display-mapping
   */
  async getDisplayCategoryMapping(): Promise<DisplayCategoryMappingResponse> {
    return this.request<DisplayCategoryMappingResponse>('/categories/display-mapping', {
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
    const raw = await this.request<unknown>('/products', {});
    return Array.isArray(raw) ? raw.map(p => this.normalizeProduct(p)) : [];
  }

  /**
   * Get product by ID
   * GET /api/products/{id}
   */
  async getProductById(id: number): Promise<ProductDetailResponse> {
    const raw = await this.request<unknown>(`/products/${id}`, { method: 'GET' });
    const envelope = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : undefined;
    const responseData = (envelope?.data && typeof envelope.data === 'object')
      ? (envelope.data as Record<string, unknown>)
      : envelope;

    const product = responseData?.product ?? responseData?.Product;
    const relatedProducts = responseData?.relatedProducts ?? responseData?.RelatedProducts ?? [];

    return {
      product: product ? this.normalizeProduct(product) : undefined,
      relatedProducts: Array.isArray(relatedProducts)
        ? relatedProducts.map((p: unknown) => this.normalizeProduct(p))
        : [],
    };
  }

  // ==================== PUBLIC SHOPS API ====================
  // Base URL: /api/shops

  /**
   * Public shop profile
   * GET /api/shops/{id}
   */
  async getPublicShopProfile(id: number): Promise<PublicShopProfileDto> {
    return this.request<PublicShopProfileDto>(`/shops/${id}`, { method: 'GET' });
  }

  /**
   * Public shop products
   * GET /api/shops/{id}/products
   */
  async getProductsByShopId(id: number): Promise<Product[]> {
    const raw = await this.request<unknown>(`/shops/${id}/products`, { method: 'GET' });
    return Array.isArray(raw) ? raw.map(p => this.normalizeProduct(p)) : [];
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
   * Global search for products and shops
   * GET /api/search?q={query}
   * This is the actual backend API endpoint
   */
  async globalSearch(query: string): Promise<GlobalSearchResponseDto> {
    if (!query || !query.trim()) {
      return { shops: [], products: [] };
    }

    return this.request<GlobalSearchResponseDto>(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  /**
   * Search products (legacy method - may not be implemented in backend)
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
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Láº¥y dá»¯ liá»‡u cho trang Dashboard (Tá»•ng SP, SP háº¿t hÃng, ÄÆ¡n hÃng chá» xá»­ lÃ½)
   * Backend tráº£ vá» PascalCase (TotalProducts, ProductsInStock, etc.) - ASP.NET default
   */
  async getShopDashboard(): Promise<ShopDashboardDto> {
    try {
      const data = await this.request<ShopDashboardDto>('/shop/dashboard', {
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
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Láº¥y thÃ´ng tin chi tiáº¿t cá»§a cá»­a hÃng (TÃªn, MÃ´ táº£, SÄT, áº¢nh) Ä‘á»ƒ hiá»ƒn thá»‹ trong trang "CÃi Ä‘áº·t"
   */
  async getShopProfile() {
    return this.request('/shop/profile', {
      method: 'GET',
    });
  }

  /**
   * Update shop profile (settings)
   * PUT /api/shop/profile
   * Backend expects [FromForm] UpdateShopProfileDto
   */
  async updateShopProfile(data: {
    name: string;
    ownerFullName?: string;
    ownerEmail?: string;
    description?: string;
    address?: string;
    contactPhoneNumber?: string;
    avatarFile?: File;
    avatarUrl?: string;
  }): Promise<void> {
    const formData = new FormData();
    formData.append('Name', (data.name || '').trim());

    if (data.ownerFullName !== undefined) formData.append('OwnerFullName', data.ownerFullName);
    if (data.ownerEmail !== undefined) formData.append('OwnerEmail', data.ownerEmail);
    if (data.description !== undefined) formData.append('Description', data.description);
    if (data.address !== undefined) formData.append('Address', data.address);
    if (data.contactPhoneNumber !== undefined) formData.append('ContactPhoneNumber', data.contactPhoneNumber);

    if (data.avatarFile) {
      formData.append('AvatarFile', data.avatarFile);
    } else if (data.avatarUrl) {
      formData.append('AvatarUrl', data.avatarUrl);
    }

    return this.request<void>('/shop/profile', {
      method: 'PUT',
      body: formData,
    });
  }

  /**
   * Update shop profile
   * PUT /api/shop/profile
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Láº¥y danh sÃ¡ch chá»‰ nhá»¯ng sáº£n pháº©m mÃ Shop nÃy sá»Ÿ há»¯u
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
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Táº¡o má»™t sáº£n pháº©m má»›i (há»— trá»£ cáº£ URL vÃupload áº£nh)
   */
  async createShopProduct(productData: {
    name: string;
    description?: string;
    features?: string;
    isPopular: boolean;
    basePrice: number;
    maxPrice?: number;
    stockQuantity: number;
    specifications?: Record<string, string>;
    productCategoryId: number;
    imageUrls?: string[];
    imageFiles?: File[];
  }) {
    // Backend expects [FromForm] CreateProductDto
    const formData = new FormData();
    formData.append('Name', productData.name);
    if (productData.description !== undefined) formData.append('Description', productData.description);
    if (productData.features !== undefined) formData.append('Features', productData.features);
    formData.append('IsPopular', String(productData.isPopular));
    formData.append('BasePrice', String(productData.basePrice));
    if (productData.maxPrice !== undefined) formData.append('MaxPrice', String(productData.maxPrice));
    formData.append('StockQuantity', String(productData.stockQuantity));
    if (productData.specifications) {
      for (const [key, value] of Object.entries(productData.specifications)) {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          formData.append(`Specifications[${key}]`, String(value));
        }
      }
    }
    formData.append('ProductCategoryId', String(productData.productCategoryId));

    if (productData.imageUrls?.length) {
      for (const url of productData.imageUrls) {
        formData.append('ImageUrls', url);
      }
    }

    if (productData.imageFiles?.length) {
      for (const file of productData.imageFiles) {
        formData.append('ImageFiles', file);
      }
    }

    return this.request('/shop/products', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Update a product
   * PUT /api/shop/products/{id}
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Cáº­p nháº­t sáº£n pháº©m cá»§a Shop (BE kiá»ƒm tra quyá»n sá»Ÿ há»¯u)
   */
  async updateShopProduct(id: string, productData: {
    name?: string;
    description?: string;
    features?: string;
    isPopular?: boolean;
    basePrice?: number;
    maxPrice?: number;
    stockQuantity?: number;
    specifications?: Record<string, string>;
    productCategoryId?: number;
    keepImageIds?: number[];
    imageUrls?: string[];
    imageFiles?: File[];
  }) {
    // Backend expects [FromForm] UpdateProductDto
    const formData = new FormData();
    if (productData.name !== undefined) formData.append('Name', productData.name);
    if (productData.description !== undefined) formData.append('Description', productData.description);
    if (productData.features !== undefined) formData.append('Features', productData.features);
    if (productData.isPopular !== undefined) formData.append('IsPopular', String(productData.isPopular));
    if (productData.basePrice !== undefined) formData.append('BasePrice', String(productData.basePrice));
    if (productData.maxPrice !== undefined) formData.append('MaxPrice', String(productData.maxPrice));
    if (productData.stockQuantity !== undefined) formData.append('StockQuantity', String(productData.stockQuantity));
    if (productData.specifications) {
      for (const [key, value] of Object.entries(productData.specifications)) {
        if (value !== undefined && value !== null && String(value).trim() !== '') {
          formData.append(`Specifications[${key}]`, String(value));
        }
      }
    }
    if (productData.productCategoryId !== undefined) formData.append('ProductCategoryId', String(productData.productCategoryId));

    if (productData.keepImageIds) {
      for (const keepId of productData.keepImageIds) {
        formData.append('KeepImageIds', String(keepId));
      }
    }

    if (productData.imageUrls?.length) {
      for (const url of productData.imageUrls) {
        formData.append('ImageUrls', url);
      }
    }

    if (productData.imageFiles?.length) {
      for (const file of productData.imageFiles) {
        formData.append('ImageFiles', file);
      }
    }

    return this.request<void>(`/shop/products/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  /**
   * Delete a product
   * DELETE /api/shop/products/{id}
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: XÃ³a sáº£n pháº©m cá»§a Shop (BE kiá»ƒm tra quyá»n sá»Ÿ há»¯u)
   */
  async deleteShopProduct(id: string) {
    return this.request<void>(`/shop/products/${id}`, {
      method: 'DELETE',
    });
  }

  /*
   * Get shop orders
   * GET /api/shop/orders
   * Quyá»n: Chá»‰ Shop
   *Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Láº¥y danh sÃ¡ch cÃ¡c mÃ³n hÃng (OrderItems) thuá»™c vá» Shop, kÃ¨m thÃ´ng tin khÃ¡ch hÃng, tráº¡ng thÃ¡i xá»­ lÃ½
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

  /*
   * Get shop orders (V2 - grouped by Order)
   * GET /api/shop/orders/v2
   */
  async getShopOrdersV2(params?: {
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/shop/orders/v2?${queryString}` : '/shop/orders/v2';

    return this.request(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Update order status (V2 - order-based)
   * PUT /api/shop/orders/{orderId}/status
   */
  async updateShopOrderStatus(orderId: string, status: string) {
    // Backend enum Core.Enums.OrderStatus:
    // Pending=0, PendingPayment=1, Paid=2, Shipping=3, Completed=4, Cancelled=5,
    // Processing=6, Received=7, Preparing=8, Delivering=9, Delivered=10
    const statusToEnumValue: Record<string, number> = {
      Pending: 0,
      PendingPayment: 1,
      Paid: 2,
      Shipping: 3,
      Completed: 4,
      Cancelled: 5,
      Processing: 6,
      Received: 7,
      Preparing: 8,
      Delivering: 9,
      Delivered: 10,
    };

    const newStatusValue = statusToEnumValue[String(status)];
    if (newStatusValue === undefined) {
      throw new Error(`Invalid order status: ${status}`);
    }

    console.log('[apiService] updateShopOrderStatus payload:', {
      orderId,
      status,
      newStatus: newStatusValue,
    });

    return this.request<void>(`/shop/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ newStatus: newStatusValue }),
    });
  }

  /**
   * Update order status
   * PUT /api/shop/orders/items/{orderItemId}/status
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Shop cáº­p nháº­t tráº¡ng thÃ¡i xá»­ lÃ½ cá»§a má»™t mÃ³n hÃng (Pending -> Preparing -> Shipped...)
   */
  async updateOrderStatus(orderItemId: string, status: string) {
    // Backend expects OrderItemShopStatus enum value (number), not string.
    // Enum order in BE: Pending=0, Preparing=1, ReadyToShip=2, Shipped=3, Cancelled=4
    const statusToEnumValue: Record<string, number> = {
      Pending: 0,
      Preparing: 1,
      ReadyToShip: 2,
      Shipped: 3,
      Cancelled: 4,
    };

    const newStatusValue = statusToEnumValue[String(status)];
    if (newStatusValue === undefined) {
      throw new Error(`Invalid order status: ${status}`);
    }

    return this.request<void>(`/shop/orders/items/${orderItemId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ newStatus: newStatusValue }),
    });
  }

  /**
   * Get shop reviews
   * GET /api/shop/reviews
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Láº¥y danh sÃ¡ch táº¥t cáº£ cÃ¡c Ä‘Ã¡nh giÃ¡ vá» sáº£n pháº©m cá»§a Shop
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
   * Quyá»n: Chá»‰ Shop
   * Nhiá»‡m vá»¥ & TÃ¡c dá»¥ng: Láº¥y dá»¯ liá»‡u thá»‘ng kÃª doanh thu cÆ¡ báº£n (doanh thu thÃ¡ng nÃy, sá»‘ Ä‘Æ¡n...) cho Shop
   */
  async getShopStatistics() {
    return this.request('/shop/statistics', {
      method: 'GET',
    });
  }

  // ==================== CART API ====================
  // Base URL: /api/cart

  /**
   * Get current user's cart
   * GET /api/cart
   * Requires authentication
   */
  async getCart(): Promise<CartResponseDto> {
    return this.request<CartResponseDto>('/cart', {
      method: 'GET',
    });
  }

  /**
   * Add item to cart
   * POST /api/cart/items
   * Requires authentication
   */
  async addItemToCart(data: { productId: number; quantity: number }): Promise<CartResponseDto> {
    return this.request<CartResponseDto>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update cart item quantity
   * PUT /api/cart/items/{cartItemId}/quantity
   * Requires authentication
   */
  async updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartResponseDto> {
    return this.request<CartResponseDto>(`/cart/items/${cartItemId}/quantity`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  /**
   * Toggle cart item selection
   * PUT /api/cart/items/{cartItemId}/select
   * Requires authentication
   */
  async selectCartItem(cartItemId: number, isSelected: boolean): Promise<CartResponseDto> {
    return this.request<CartResponseDto>(`/cart/items/${cartItemId}/select`, {
      method: 'PUT',
      body: JSON.stringify({ isSelected }),
    });
  }

  /**
   * Remove item from cart
   * DELETE /api/cart/items/{cartItemId}
   * Requires authentication
   */
  async removeCartItem(cartItemId: number): Promise<CartResponseDto> {
    return this.request<CartResponseDto>(`/cart/items/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  // ==================== USER ADDRESSES API ====================
  // Base URL: /api/useraddresses

  /**
   * Get all addresses for current user
   * GET /api/useraddresses
   * Requires authentication
   */
  async getUserAddresses(): Promise<AddressResponseDto[]> {
    return this.request<AddressResponseDto[]>('/useraddresses', {
      method: 'GET',
    });
  }

  /**
   * Get address by ID
   * GET /api/useraddresses/{id}
   * Requires authentication
   */
  async getUserAddressById(id: number): Promise<AddressResponseDto> {
    return this.request<AddressResponseDto>(`/useraddresses/${id}`, {
      method: 'GET',
    });
  }

  async addUserAddress(data: UpsertAddressDto): Promise<AddressResponseDto> {
    return this.request<AddressResponseDto>('/useraddresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update address
   * PUT /api/useraddresses/{id}
   * Requires authentication
   */
  async updateUserAddress(id: number, data: UpsertAddressDto): Promise<AddressResponseDto> {
    return this.request<AddressResponseDto>(`/useraddresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete address
   * DELETE /api/useraddresses/{id}
   * Requires authentication
   */
  async deleteUserAddress(id: number): Promise<void> {
    return this.request<void>(`/useraddresses/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Set default address
   * POST /api/useraddresses/{id}/set-default
   * Requires authentication
   */
  async setDefaultAddress(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/useraddresses/${id}/set-default`, {
      method: 'POST',
    });
  }

  // ==================== ORDERS API ====================
  // Base URL: /api/orders

  /**
   * Create order from cart (selected items only)
   * POST /api/orders
   * Requires authentication
   */
  async createOrder(data: {
    shippingAddress?: {
      fullName: string;
      phoneNumber: string;
      street: string;
      ward: string;
      district: string;
      city: string;
    };
    paymentMethod?: 'cash_on_delivery' | 'payos';
  }): Promise<OrderResponseDto> {
    // Backend expects PaymentMethod enum as number: COD=0, PayOS=1
    const payload: {
      shippingAddress?: typeof data.shippingAddress;
      paymentMethod?: 0 | 1;
    } = {};

    if (data.shippingAddress) {
      payload.shippingAddress = data.shippingAddress;
    }

    if (data.paymentMethod) {
      payload.paymentMethod = data.paymentMethod === 'payos' ? 1 : 0;
    }

    console.log('[apiService] Creating order:', payload);
    return this.request<OrderResponseDto>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Create PayOS payment link for an existing order
   * POST /api/payments/payos/create-link
   * Requires authentication
   */
  async createPayOSPaymentLink(orderId: number): Promise<{ checkoutUrl: string }> {
    return this.request<{ checkoutUrl: string }>('/payments/payos/create-link', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  /**
   * Sync PayOS payment status for an order.
   * POST /api/payments/payos/sync
   * Requires authentication
   */
  async syncPayOSPayment(orderId: number): Promise<{ updated: boolean }> {
    return this.request<{ updated: boolean }>('/payments/payos/sync', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  /**
   * Cancel a pending PayOS payment and delete the unpaid order
   * POST /api/payments/payos/cancel
   * Requires authentication
   */
  async cancelPayOSPayment(orderId: number): Promise<{ deleted: boolean }> {
    return this.request<{ deleted: boolean }>('/payments/payos/cancel', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  /**
   * Get order by ID
   * GET /api/orders/{id}
   * Requires authentication
   */
  async getOrderById(id: number): Promise<OrderResponseDto> {
    return this.request<OrderResponseDto>(`/orders/${id}`, {
      method: 'GET',
    });
  }

  /**
   * Get user orders
   * GET /api/orders
   * Requires authentication
   */
  async getUserOrders(): Promise<OrderHistoryResponseDto[]> {
    console.log('[apiService] Fetching user orders...');
    const result = await this.request<OrderHistoryResponseDto[]>('/orders', {
      method: 'GET',
    });
    console.log('[apiService] User orders response:', result);
    return result;
  }

  async getAdminCategories(): Promise<AdminCategoryDto[]> {
    return this.request<AdminCategoryDto[]>('/admin/categories', {
      method: 'GET',
    });
  }

  /**
   * Admin: Get mapping (hardcoded display -> DB category)
   * GET /api/admin/display-categories/mapping
   */
  async getAdminDisplayCategoryMapping(): Promise<DisplayCategoryMappingResponse> {
    return this.request<DisplayCategoryMappingResponse>('/admin/display-categories/mapping', {
      method: 'GET',
    });
  }

  /**
   * Admin: Update mapping for one display category
   * PUT /api/admin/display-categories/mapping
   */
  async updateAdminDisplayCategoryMapping(displayKey: string, categoryId: number | null): Promise<void> {
    return this.request<void>('/admin/display-categories/mapping', {
      method: 'PUT',
      body: JSON.stringify({ displayKey, categoryId }),
    });
  }

  /**
   * Create category (Admin)
   * POST /api/admin/categories
   */
  async createAdminCategory(data: CreateCategoryRequest): Promise<AdminCategoryDto> {
    const form = new FormData();
    form.append('Name', data.name);
    if (data.bannerTitle) form.append('BannerTitle', data.bannerTitle);
    if (data.description) form.append('Description', data.description);
    if (data.imageUrl) form.append('ImageUrl', data.imageUrl);
    if (data.imageFile) form.append('ImageFile', data.imageFile);

    return this.request<AdminCategoryDto>('/admin/categories', {
      method: 'POST',
      body: form,
    });
  }

  /**
   * Update category (Admin)
   * PUT /api/admin/categories/{id}
   */
  async updateAdminCategory(id: number, data: UpdateCategoryRequest): Promise<void> {
    const form = new FormData();
    form.append('Name', data.name);
    if (data.bannerTitle) form.append('BannerTitle', data.bannerTitle);
    if (data.description) form.append('Description', data.description);
    if (data.imageUrl) form.append('ImageUrl', data.imageUrl);
    if (data.imageFile) form.append('ImageFile', data.imageFile);

    return this.request<void>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: form,
    });
  }

  /**
   * Delete category (Admin)
   * DELETE /api/admin/categories/{id}
   */
  async deleteAdminCategory(id: number): Promise<void> {
    return this.request<void>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Toggle category visibility (Admin)
   * PUT /api/admin/categories/{id}/visibility
   */
  async toggleCategoryVisibility(id: number, isVisible: boolean): Promise<void> {
    return this.request<void>(`/admin/categories/${id}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ isHidden: !isVisible }),
    });
  }

  /**
   * Reorder categories (Admin)
   * PUT /api/admin/categories/reorder
   */
  async reorderCategories(categoryIds: number[]): Promise<void> {
    return this.request<void>('/admin/categories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ categoryIds }),
    });
  }

  /**
   * Get all shops (Admin)
   * GET /api/admin/shops
   */
  async getAdminShops(): Promise<AdminShopDto[]> {
    return this.request<AdminShopDto[]>('/admin/shops', {
      method: 'GET',
    });
  }

  /**
   * Create new shop account (Admin)
   * POST /api/admin/shops/create-new
   */
  async createShopAccount(data: {
    email: string;
    fullName: string;
    shopName: string;
    contactPhoneNumber?: string;
  }): Promise<AdminShopDto> {
    return this.request<AdminShopDto>('/admin/shops/create-new', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Convert guest to shop (Admin)
   * POST /api/admin/shops/convert-guest
   */
  async convertGuestToShop(data: {
    userEmail: string;
    shopName: string;
  }): Promise<AdminShopDto> {
    return this.request<AdminShopDto>('/admin/shops/convert-guest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update shop info (Admin)
   * PUT /api/admin/shops/{id}
   */
  async updateShopInfo(id: number, data: Partial<AdminShopDto>): Promise<void> {
    return this.request<void>(`/admin/shops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update shop status (Admin)
   * PUT /api/admin/shops/{id}/status
   */
  async updateShopStatus(id: number, isActive: boolean): Promise<void> {
    return this.request<void>(`/admin/shops/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  }

  /**
   * Reset shop password (Admin)
   * POST /api/admin/shops/{id}/reset-password
   */
  async resetShopPassword(id: number, newPassword: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/admin/shops/${id}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }

  /**
   * Get all products (Admin)
   * GET /api/admin/products
   */
  async getAdminProducts(): Promise<AdminProductDto[]> {
    return this.request<AdminProductDto[]>('/admin/products', {
      method: 'GET',
    });
  }

  /**
   * Toggle product visibility (Admin)
   * PUT /api/admin/products/{id}/visibility
   */
  async toggleProductVisibility(id: number, isVisible: boolean): Promise<void> {
    return this.request<void>(`/admin/products/${id}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ isVisible }),
    });
  }

  /**
   * Change product category (Admin)
   * PUT /api/admin/products/{id}/change-category
   */
  async changeProductCategory(id: number, categoryId: number): Promise<void> {
    return this.request<void>(`/admin/products/${id}/change-category`, {
      method: 'PUT',
      body: JSON.stringify({ categoryId }),
    });
  }

  /**
   * Get commission config (Admin)
   * GET /api/admin/config/commissions
   */
  async getCommissionConfig(): Promise<CommissionConfig> {
    return this.request<CommissionConfig>('/admin/config/commissions', {
      method: 'GET',
    });
  }

  /**
   * Set default commission (Admin)
   * PUT /api/admin/config/commissions/default
   */
  async setDefaultCommission(rate: number): Promise<void> {
    return this.request<void>('/admin/config/commissions/default', {
      method: 'PUT',
      body: JSON.stringify({ rate }),
    });
  }

  /**
   * Set shop commission (Admin)
   * PUT /api/admin/config/commissions/shop/{shopId}
   */
  async setShopCommission(shopId: number, rate: number): Promise<void> {
    return this.request<void>(`/admin/config/commissions/shop/${shopId}`, {
      method: 'PUT',
      body: JSON.stringify({ rate }),
    });
  }

  /**
   * Get revenue statistics (Admin)
   * GET /api/admin/dashboard/revenue-stats
   */
  async getRevenueStats(
    params?:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | { period?: 'daily' | 'weekly' | 'monthly' | 'yearly'; date?: string }
  ): Promise<RevenueStats> {
    const period = typeof params === 'string' ? params : params?.period;
    const date = typeof params === 'string' ? undefined : params?.date;

    const searchParams = new URLSearchParams();
    if (period) searchParams.append('period', period);
    if (date) searchParams.append('date', date);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/admin/dashboard/revenue-stats?${queryString}`
      : '/admin/dashboard/revenue-stats';

    return this.request<RevenueStats>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Get revenue by shop (Admin)
   * GET /api/admin/dashboard/revenue-by-shop
   */
  async getRevenueByShop(
    params?:
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | { period?: 'daily' | 'weekly' | 'monthly' | 'yearly'; date?: string }
  ): Promise<RevenueByShop[]> {
    const period = typeof params === 'string' ? params : params?.period;
    const date = typeof params === 'string' ? undefined : params?.date;

    const searchParams = new URLSearchParams();
    if (period) searchParams.append('period', period);
    if (date) searchParams.append('date', date);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/admin/dashboard/revenue-by-shop?${queryString}`
      : '/admin/dashboard/revenue-by-shop';

    return this.request<RevenueByShop[]>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Get system logs (Admin)
   * GET /api/admin/logs
   */
  async getSystemLogs(params?: {
    page?: number;
    limit?: number;
  }): Promise<unknown> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/admin/logs?${queryString}` : '/admin/logs';

    return this.request(endpoint, {
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
