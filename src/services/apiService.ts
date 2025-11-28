import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

// Configuration
const API_BASE_URL = "https://localhost:5001/api";

// --- Interfaces ---

// Common
export interface ApiResponse {
  message: string;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

// Category
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string; // Base64
  isVisible?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageFile?: File;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  imageFile?: File;
}

// Product
export interface ImageDto {
  id: number;
  url: string; // Base64 string
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  features?: string;
  images?: ImageDto[];
  imageUrl?: string;   // Fallback if needed, though images[] is primary
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: Record<string, string>;
  productCategoryId: number;
  productCategoryName?: string;
  shopId: number;
  shopName?: string;
  reviews?: ProductReview[];
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  features?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: string; // JSON string or plain text
  productCategoryId: number;
  imageFiles?: File[];
  imageUrls?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  features?: string;
  isPopular?: boolean;
  basePrice?: number;
  maxPrice?: number;
  stockQuantity?: number;
  specifications?: string;
  productCategoryId?: number;
  imageFiles?: File[];
  imageUrls?: string[];
  keepImageIds?: number[];
}

// Review
export interface ProductReview {
  id: number;
  userId: string;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    fullName: string;
    avatarUrl?: string;
  };
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

// User Profile
export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
  avatarUrl?: string; // Base64 string
  roles: string[];
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber?: string;
  address?: string;
  introduction?: string;
  avatarFile?: File;
}

// Cart
export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  isSelected: boolean;
  shopName?: string;
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

// Order
export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  shopName: string;
}

export interface OrderResponseDto {
  id: number;
  orderDate: string;
  status: string;
  subtotal: number;
  total: number;
  shippingAddress: ShippingAddress;
  items: OrderItemDto[];
}

export interface CreateOrderRequest {
  shippingAddress?: ShippingAddress;
}

// Address
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

// Shop
export interface ShopProfile {
  id: number;
  name: string;
  description?: string;
  avatarBase64?: string;
  contactPhoneNumber?: string;
  joinDate: string;
}

export interface UpdateShopProfileRequest {
  name: string;
  description?: string;
  contactPhoneNumber?: string;
  avatarFile?: File;
  avatarUrl?: string;
}

export interface ShopDashboardDto {
  totalProducts: number;
  productsInStock: number;
  outOfStockProducts: number;
  pendingOrderItems: number;
}

export interface ShopProduct extends Product {
  soldCount: number;
  rating: number;
  status: string;
}

export interface ShopOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export interface ShopReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  productName: string;
}

export interface ShopStatistics {
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  orders: {
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  };
  topProducts: {
    id: number;
    name: string;
    sold: number;
    revenue: number;
  }[];
}

// Admin
export interface AdminShopDto {
  id: number;
  name: string;
  email: string;
  status: string;
  joinDate: string;
}

export interface AdminRevenueStats {
  totalRevenue: number;
  dailyRevenue: number;
  monthlyRevenue: number;
}

export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- ApiService Class ---

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL;
    // Initialize Axios Instance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    // 1. Interceptor Request: Attach Token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');
        if (token && token !== 'undefined' && token !== 'null') {
          const cleanToken = token.replace(/^"|"$/g, ''); // Remove extra quotes
          config.headers.Authorization = `Bearer ${cleanToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Interceptor Response: Handle Errors
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        console.error(`API Error [${error.config?.url}]:`, error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Helper to handle axios requests and return Promise<T>
  public async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    return this.axiosInstance.request<any, T>({
      url: endpoint,
      ...options
    });
  }

  // ==========================================
  // 1. AUTH & ACCOUNT
  // ==========================================
  public async register(data: RegisterRequest) {
    return this.axiosInstance.post<any, ApiResponse>('/Accounts/register', data);
  }

  public async login(data: LoginRequest) {
    return this.axiosInstance.post<any, LoginResponse>('/Accounts/login', data);
  }

  public async changePassword(data: ChangePasswordRequest) {
    return this.axiosInstance.post<any, ApiResponse>('/Accounts/changepassword', data);
  }

  public async deleteAccount(data: DeleteAccountRequest) {
    // DELETE with body requires specific config in axios
    return this.axiosInstance.delete<any, ApiResponse>('/Accounts/deleteme', { data });
  }

  // ==========================================
  // 2. PUBLIC DATA
  // ==========================================
  public async getCategories() {
    return this.axiosInstance.get<any, Category[]>('/Categories');
  }

  public async getCategory(id: number) {
    return this.axiosInstance.get<any, Category>(`/Categories/${id}`);
  }

  public async getCategoryProducts(categoryId: number) {
    return this.axiosInstance.get<any, Product[]>(`/Categories/${categoryId}/products`);
  }

  public async getProducts(params?: SearchParams) {
    // If no search params, call GET All
    if (!params || !params.query) {
      return this.axiosInstance.get<any, Product[]>('/Products');
    }
    // If search, call search function
    return this.searchProducts(params.query);
  }

  public async searchProducts(keyword: string) {
    // Fix 400 error: If keyword is empty, return empty array immediately
    if (!keyword || keyword.trim() === '') return [];
    return this.axiosInstance.get<any, Product[]>(`/Search?q=${encodeURIComponent(keyword)}`);
  }

  public async getProduct(id: number) {
    return this.axiosInstance.get<any, Product>(`/Products/${id}`);
  }

  public async getProductById(id: number | string) {
    return this.getProduct(Number(id));
  }

  public async getProductReviews(productId: number) {
    return this.axiosInstance.get<any, ProductReview[]>(`/products/${productId}/reviews`);
  }

  // ==========================================
  // 3. USER FEATURES
  // ==========================================
  public async getProfile() {
    return this.axiosInstance.get<any, UserProfile>('/Profile/me');
  }

  public async updateProfile(data: UpdateProfileRequest) {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
    if (data.address) formData.append('address', data.address);
    if (data.introduction) formData.append('introduction', data.introduction);

    // Upload avatar
    if (data.avatarFile) formData.append('avatarFile', data.avatarFile);

    return this.axiosInstance.put<any, UserProfile>('/Profile/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async createProductReview(productId: number, data: CreateReviewRequest) {
    return this.axiosInstance.post<any, ProductReview>(`/products/${productId}/reviews`, data);
  }

  public async getCart() {
    return this.axiosInstance.get<any, CartResponseDto>('/Cart');
  }

  public async addToCart(productId: number, quantity: number) {
    return this.axiosInstance.post<any, CartResponseDto>('/Cart/items', { productId, quantity });
  }

  // Alias to fix "addItemToCart is not a function" if used elsewhere
  public async addItemToCart(param: { productId: number, quantity: number }) {
    return this.addToCart(param.productId, param.quantity);
  }

  public async updateCartItem(cartItemId: number, quantity: number) {
    return this.axiosInstance.put<any, CartResponseDto>(`/Cart/items/${cartItemId}/quantity`, { quantity });
  }

  public async selectCartItem(cartItemId: number, isSelected: boolean) {
    return this.axiosInstance.put<any, CartResponseDto>(`/Cart/items/${cartItemId}/select`, { isSelected });
  }

  public async removeCartItem(cartItemId: number) {
    return this.axiosInstance.delete<any, CartResponseDto>(`/Cart/items/${cartItemId}`);
  }

  public async getOrders() {
    return this.axiosInstance.get<any, OrderResponseDto[]>('/Orders');
  }

  public async getOrder(id: number) {
    return this.axiosInstance.get<any, OrderResponseDto>(`/Orders/${id}`);
  }

  public async createOrder(data: CreateOrderRequest) {
    return this.axiosInstance.post<any, OrderResponseDto>('/Orders', data);
  }

  // ==========================================
  // 4. USER ADDRESS BOOK
  // ==========================================
  public async getAddresses() {
    return this.axiosInstance.get<any, AddressResponseDto[]>('/useraddresses');
  }

  public async getAddress(id: number) {
    return this.axiosInstance.get<any, AddressResponseDto>(`/useraddresses/${id}`);
  }

  public async addAddress(data: UpsertAddressDto) {
    return this.axiosInstance.post<any, AddressResponseDto>('/useraddresses', data);
  }

  public async updateAddress(id: number, data: UpsertAddressDto) {
    return this.axiosInstance.put<any, void>(`/useraddresses/${id}`, data);
  }

  public async deleteAddress(id: number) {
    return this.axiosInstance.delete<any, void>(`/useraddresses/${id}`);
  }

  public async setDefaultAddress(id: number) {
    return this.axiosInstance.post<any, void>(`/useraddresses/${id}/set-default`);
  }

  // ==========================================
  // 5. SHOP MANAGEMENT
  // ==========================================
  public async getShopDashboard() {
    return this.axiosInstance.get<any, ShopDashboardDto>('/shop/dashboard');
  }

  public async getShopProfile() {
    return this.axiosInstance.get<any, ShopProfile>('/shop/profile');
  }

  public async updateShopProfile(data: UpdateShopProfileRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.contactPhoneNumber) formData.append('contactPhoneNumber', data.contactPhoneNumber);
    if (data.avatarFile) formData.append('avatarFile', data.avatarFile);
    if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl);

    return this.axiosInstance.put<any, ShopProfile>('/shop/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async getShopProducts(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.axiosInstance.get<any, { products: ShopProduct[]; total: number }>(`/shop/products${queryString}`);
  }

  public async getShopProduct(id: number) {
    return this.axiosInstance.get<any, ShopProduct>(`/shop/products/${id}`);
  }

  public async createShopProduct(data: CreateProductRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.features) formData.append('features', data.features);
    formData.append('basePrice', data.basePrice.toString());
    formData.append('stockQuantity', data.stockQuantity.toString());
    formData.append('productCategoryId', data.productCategoryId.toString());
    formData.append('isPopular', String(data.isPopular));
    if (data.maxPrice) formData.append('maxPrice', data.maxPrice.toString());
    if (data.specifications) formData.append('specifications', data.specifications);

    if (data.imageFiles) {
      data.imageFiles.forEach(file => formData.append('imageFiles', file));
    }
    if (data.imageUrls) {
      data.imageUrls.forEach(url => formData.append('imageUrls', url));
    }

    return this.axiosInstance.post<any, ShopProduct>('/shop/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async updateShopProduct(id: number, data: UpdateProductRequest) {
    const formData = new FormData();

    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.features) formData.append('features', data.features);

    if (data.isPopular !== undefined) formData.append('isPopular', String(data.isPopular));
    if (data.basePrice !== undefined) formData.append('basePrice', String(data.basePrice));
    if (data.maxPrice !== undefined) formData.append('maxPrice', String(data.maxPrice));
    if (data.stockQuantity !== undefined) formData.append('stockQuantity', String(data.stockQuantity));
    if (data.productCategoryId !== undefined) formData.append('productCategoryId', String(data.productCategoryId));

    if (data.specifications) {
      const specsToSend = typeof data.specifications === 'object'
        ? JSON.stringify(data.specifications)
        : data.specifications;
      formData.append('specifications', specsToSend);
    }

    if (data.imageFiles && data.imageFiles.length > 0) {
      data.imageFiles.forEach((file) => {
        formData.append('imageFiles', file);
      });
    }

    if (data.imageUrls && data.imageUrls.length > 0) {
      data.imageUrls.forEach((url) => {
        formData.append('imageUrls', url);
      });
    }

    if (data.keepImageIds && data.keepImageIds.length > 0) {
      data.keepImageIds.forEach((imgId) => {
        formData.append('keepImageIds', String(imgId));
      });
    }

    return this.axiosInstance.put<any, ShopProduct>(`/shop/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async deleteShopProduct(id: number) {
    return this.axiosInstance.delete<any, void>(`/shop/products/${id}`);
  }

  public async getShopOrders(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.axiosInstance.get<any, { orders: ShopOrder[]; total: number }>(`/shop/orders${queryString}`);
  }

  public async updateOrderStatus(orderItemId: number, status: string) {
    return this.axiosInstance.put<any, void>(`/shop/orders/items/${orderItemId}/status`, { newStatus: status });
  }

  public async getShopReviews() {
    return this.axiosInstance.get<any, ShopReview[]>('/shop/reviews');
  }

  public async getShopStatistics() {
    return this.axiosInstance.get<any, ShopStatistics>('/shop/statistics');
  }

  // ==========================================
  // 6. ADMIN MANAGEMENT
  // ==========================================

  // --- Categories ---
  public async adminGetCategories() {
    return this.axiosInstance.get<any, Category[]>('/admin/categories');
  }

  public async adminCreateCategory(data: CreateCategoryRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.imageFile) formData.append('imageFile', data.imageFile);
    return this.axiosInstance.post('/admin/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  public async adminUpdateCategory(id: number, data: UpdateCategoryRequest) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.imageFile) formData.append('imageFile', data.imageFile);
    return this.axiosInstance.put(`/admin/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  public async adminDeleteCategory(id: number) {
    return this.axiosInstance.delete(`/admin/categories/${id}`);
  }

  public async adminToggleCategoryVisibility(id: number, isHidden: boolean) {
    return this.axiosInstance.put(`/admin/categories/${id}/visibility`, { isHidden });
  }

  public async adminReorderCategories(orderedCategoryIds: number[]) {
    return this.axiosInstance.put('/admin/categories/reorder', { orderedCategoryIds });
  }

  // --- Shops ---
  public async adminGetShops() {
    return this.axiosInstance.get<any, AdminShopDto[]>('/admin/shops');
  }

  public async adminCreateShop(data: any) {
    return this.axiosInstance.post('/admin/shops/create-new', data);
  }

  public async adminConvertGuestToShop(data: any) {
    return this.axiosInstance.post('/admin/shops/convert-guest', data);
  }

  public async adminUpdateShop(id: number, data: any) {
    return this.axiosInstance.put(`/admin/shops/${id}`, data);
  }

  public async adminToggleShopLock(id: number, isLocked: boolean) {
    return this.axiosInstance.put(`/admin/shops/${id}/status`, { isLocked });
  }

  public async adminResetShopPassword(id: number, newPassword: string) {
    return this.axiosInstance.post(`/admin/shops/${id}/reset-password`, { newPassword });
  }

  // --- Products ---
  public async adminGetProducts() {
    return this.axiosInstance.get<any, Product[]>('/admin/products');
  }

  public async adminToggleProductVisibility(id: number, isHidden: boolean) {
    return this.axiosInstance.put(`/admin/products/${id}/visibility`, { isHidden });
  }

  public async adminChangeProductCategory(id: number, newCategoryId: number) {
    return this.axiosInstance.put(`/admin/products/${id}/change-category`, { newCategoryId });
  }

  // --- Config & Dashboard ---
  public async adminGetCommissions() {
    return this.axiosInstance.get('/admin/config/commissions');
  }

  public async adminSetDefaultCommission(rate: number) {
    return this.axiosInstance.put('/admin/config/commissions/default', { rate });
  }

  public async adminSetShopCommission(shopId: number, rate: number) {
    return this.axiosInstance.put(`/admin/config/commissions/shop/${shopId}`, { rate });
  }

  public async adminGetRevenueStats() {
    return this.axiosInstance.get<any, AdminRevenueStats>('/admin/dashboard/revenue-stats');
  }

  public async adminGetRevenueByShop() {
    return this.axiosInstance.get('/admin/dashboard/revenue-by-shop');
  }

  public async adminGetActivityLogs(count: number = 20) {
    return this.axiosInstance.get(`/admin/logs?count=${count}`);
  }
}

export const apiService = ApiService.getInstance();
export default apiService;
