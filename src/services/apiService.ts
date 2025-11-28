import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

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
  imageUrl?: string;
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
  url: string; // Base64 string or URL
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  features?: string;
  images: ImageDto[];
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: Record<string, string>;
  productCategoryId: number;
  productCategoryName?: string;
  shopId: number;
  shopName?: string;
  imageUrl?: string; // Helper for frontend display (first image)
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  features?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: string; // JSON string
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
  specifications?: string; // JSON string
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

export interface CartResponseDto {
  id: number;
  items: CartItemDto[];
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

export interface ShopProduct {
  id: number;
  name: string;
  basePrice: number;
  stockQuantity: number;
  soldCount: number;
  rating: number;
  status: string;
  images?: { id: number; url: string }[];
  description?: string;
  features?: string;
  isPopular?: boolean;
  maxPrice?: number;
  productCategoryId?: number;
  specifications?: string | Record<string, string>;
  imageUrl?: string;
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

// --- ApiService Class ---

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL;
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: { 'Content-Type': 'application/json' },
    });

    // 1. Interceptor Request: Attach Token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token') || localStorage.getItem('userToken');
        if (token) {
          const cleanToken = token.replace(/"/g, '');
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
        console.error("API Error:", error.response?.status, error.config?.url, error.message);
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
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.request(config) as Promise<T>;
  }

  // --- 1. Auth & Account ---
  public async register(data: RegisterRequest) {
    return this.request<ApiResponse>({ method: 'POST', url: '/Accounts/register', data });
  }

  public async login(data: LoginRequest) {
    return this.request<LoginResponse>({ method: 'POST', url: '/Accounts/login', data });
  }

  public async changePassword(data: ChangePasswordRequest) {
    return this.request<ApiResponse>({ method: 'POST', url: '/Accounts/changepassword', data });
  }

  public async deleteAccount(data: DeleteAccountRequest) {
    return this.request<ApiResponse>({ method: 'DELETE', url: '/Accounts/deleteme', data });
  }

  // --- 2. Public Data ---
  public async getCategories() {
    return this.request<Category[]>({ method: 'GET', url: '/Categories' });
  }

  public async getCategory(id: number) {
    return this.request<Category>({ method: 'GET', url: `/Categories/${id}` });
  }

  public async getCategoryProducts(categoryId: number) {
    return this.request<Product[]>({ method: 'GET', url: `/Categories/${categoryId}/products` });
  }

  public async getProducts() {
    return this.request<Product[]>({ method: 'GET', url: '/Products' });
  }

  public async getProduct(id: number) {
    return this.request<Product>({ method: 'GET', url: `/Products/${id}` });
  }

  public async getProductReviews(productId: number) {
    return this.request<ProductReview[]>({ method: 'GET', url: `/products/${productId}/reviews` });
  }

  public async searchProducts(keyword: string) {
    if (!keyword || keyword.trim() === '') return [];
    return this.request<Product[]>({ method: 'GET', url: `/Search?q=${encodeURIComponent(keyword)}` });
  }

  // --- 3. User Features ---
  public async getProfile() {
    return this.request<UserProfile>({ method: 'GET', url: '/Profile/me' });
  }

  public async updateProfile(data: UpdateProfileRequest) {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
    if (data.address) formData.append('address', data.address);
    if (data.introduction) formData.append('introduction', data.introduction);
    if (data.avatarFile) formData.append('avatarFile', data.avatarFile);

    return this.request<UserProfile>({
      method: 'PUT',
      url: '/Profile/me',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async createProductReview(productId: number, data: CreateReviewRequest) {
    return this.request<ProductReview>({ method: 'POST', url: `/products/${productId}/reviews`, data });
  }

  public async getCart() {
    return this.request<CartResponseDto>({ method: 'GET', url: '/Cart' });
  }

  public async addToCart(productId: number, quantity: number) {
    return this.request<CartResponseDto>({ method: 'POST', url: '/Cart/items', data: { productId, quantity } });
  }

  public async updateCartItem(cartItemId: number, quantity: number) {
    return this.request<CartResponseDto>({ method: 'PUT', url: `/Cart/items/${cartItemId}/quantity`, data: { quantity } });
  }

  public async selectCartItem(cartItemId: number, isSelected: boolean) {
    return this.request<CartResponseDto>({ method: 'PUT', url: `/Cart/items/${cartItemId}/select`, data: { isSelected } });
  }

  public async removeCartItem(cartItemId: number) {
    return this.request<CartResponseDto>({ method: 'DELETE', url: `/Cart/items/${cartItemId}` });
  }

  public async getOrders() {
    return this.request<OrderResponseDto[]>({ method: 'GET', url: '/Orders' });
  }

  public async getOrder(id: number) {
    return this.request<OrderResponseDto>({ method: 'GET', url: `/Orders/${id}` });
  }

  public async createOrder(data: CreateOrderRequest) {
    return this.request<OrderResponseDto>({ method: 'POST', url: '/Orders', data });
  }

  // --- 4. User Address Book ---
  public async getAddresses() {
    return this.request<AddressResponseDto[]>({ method: 'GET', url: '/useraddresses' });
  }

  public async getAddress(id: number) {
    return this.request<AddressResponseDto>({ method: 'GET', url: `/useraddresses/${id}` });
  }

  public async addAddress(data: UpsertAddressDto) {
    return this.request<AddressResponseDto>({ method: 'POST', url: '/useraddresses', data });
  }

  public async updateAddress(id: number, data: UpsertAddressDto) {
    return this.request<void>({ method: 'PUT', url: `/useraddresses/${id}`, data });
  }

  public async deleteAddress(id: number) {
    return this.request<void>({ method: 'DELETE', url: `/useraddresses/${id}` });
  }

  public async setDefaultAddress(id: number) {
    return this.request<void>({ method: 'POST', url: `/useraddresses/${id}/set-default` });
  }

  // --- 5. Shop Management ---
  public async getShopDashboard() {
    return this.request<ShopDashboardDto>({ method: 'GET', url: '/shop/dashboard' });
  }

  public async getShopProfile() {
    return this.request<ShopProfile>({ method: 'GET', url: '/shop/profile' });
  }

  public async updateShopProfile(data: UpdateShopProfileRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.contactPhoneNumber) formData.append('contactPhoneNumber', data.contactPhoneNumber);
    if (data.avatarFile) formData.append('avatarFile', data.avatarFile);
    if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl);

    return this.request<ShopProfile>({
      method: 'PUT',
      url: '/shop/profile',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async getShopProducts() {
    return this.request<ShopProduct[]>({ method: 'GET', url: '/shop/products' });
  }

  public async getShopProduct(id: number) {
    return this.request<ShopProduct>({ method: 'GET', url: `/shop/products/${id}` });
  }

  public async createShopProduct(data: CreateProductRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.features) formData.append('features', data.features);
    formData.append('isPopular', String(data.isPopular));
    formData.append('basePrice', String(data.basePrice));
    if (data.maxPrice) formData.append('maxPrice', String(data.maxPrice));
    formData.append('stockQuantity', String(data.stockQuantity));
    formData.append('productCategoryId', String(data.productCategoryId));
    if (data.specifications) formData.append('specifications', data.specifications);

    if (data.imageFiles) {
      data.imageFiles.forEach(file => formData.append('imageFiles', file));
    }
    if (data.imageUrls) {
      data.imageUrls.forEach(url => formData.append('imageUrls', url));
    }

    return this.request<ShopProduct>({
      method: 'POST',
      url: '/shop/products',
      data: formData,
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
    if (data.specifications) formData.append('specifications', data.specifications);

    if (data.imageFiles) {
      data.imageFiles.forEach(file => formData.append('imageFiles', file));
    }
    if (data.imageUrls) {
      data.imageUrls.forEach(url => formData.append('imageUrls', url));
    }
    if (data.keepImageIds) {
      data.keepImageIds.forEach(id => formData.append('keepImageIds', String(id)));
    }

    return this.request<ShopProduct>({
      method: 'PUT',
      url: `/shop/products/${id}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async deleteShopProduct(id: number) {
    return this.request<void>({ method: 'DELETE', url: `/shop/products/${id}` });
  }

  public async getShopOrders() {
    return this.request<ShopOrder[]>({ method: 'GET', url: '/shop/orders' });
  }

  public async updateOrderStatus(orderItemId: number, status: string) {
    return this.request<void>({ method: 'PUT', url: `/shop/orders/items/${orderItemId}/status`, data: { status } });
  }

  public async getShopReviews() {
    return this.request<ShopReview[]>({ method: 'GET', url: '/shop/reviews' });
  }

  public async getShopStatistics() {
    return this.request<ShopStatistics>({ method: 'GET', url: '/shop/statistics' });
  }

  // --- 6. Admin Management ---
  public async adminGetCategories() {
    return this.request<Category[]>({ method: 'GET', url: '/admin/categories' });
  }

  public async adminCreateCategory(data: CreateCategoryRequest) {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.imageFile) formData.append('imageFile', data.imageFile);

    return this.request<Category>({
      method: 'POST',
      url: '/admin/categories',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async adminUpdateCategory(id: number, data: UpdateCategoryRequest) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.imageFile) formData.append('imageFile', data.imageFile);

    return this.request<Category>({
      method: 'PUT',
      url: `/admin/categories/${id}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async adminDeleteCategory(id: number) {
    return this.request<void>({ method: 'DELETE', url: `/admin/categories/${id}` });
  }

  public async adminUpdateCategoryVisibility(id: number, isVisible: boolean) {
    return this.request<void>({ method: 'PUT', url: `/admin/categories/${id}/visibility`, data: { isVisible } });
  }

  public async adminReorderCategories(categoryIds: number[]) {
    return this.request<void>({ method: 'PUT', url: '/admin/categories/reorder', data: categoryIds });
  }

  public async adminGetShops() {
    return this.request<AdminShopDto[]>({ method: 'GET', url: '/admin/shops' });
  }

  public async adminCreateShop(data: any) {
    return this.request<any>({ method: 'POST', url: '/admin/shops/create-new', data });
  }

  public async adminConvertGuestToShop(data: any) {
    return this.request<any>({ method: 'POST', url: '/admin/shops/convert-guest', data });
  }

  public async adminUpdateShop(id: number, data: any) {
    return this.request<any>({ method: 'PUT', url: `/admin/shops/${id}`, data });
  }

  public async adminUpdateShopStatus(id: number, status: string) {
    return this.request<void>({ method: 'PUT', url: `/admin/shops/${id}/status`, data: { status } });
  }

  public async adminResetShopPassword(id: number) {
    return this.request<any>({ method: 'POST', url: `/admin/shops/${id}/reset-password` });
  }

  public async adminGetProducts() {
    return this.request<Product[]>({ method: 'GET', url: '/admin/products' });
  }

  public async adminUpdateProductVisibility(id: number, isVisible: boolean) {
    return this.request<void>({ method: 'PUT', url: `/admin/products/${id}/visibility`, data: { isVisible } });
  }

  public async adminChangeProductCategory(id: number, newCategoryId: number) {
    return this.request<void>({ method: 'PUT', url: `/admin/products/${id}/change-category`, data: { newCategoryId } });
  }

  public async adminGetCommissions() {
    return this.request<any>({ method: 'GET', url: '/admin/config/commissions' });
  }

  public async adminUpdateDefaultCommission(rate: number) {
    return this.request<void>({ method: 'PUT', url: '/admin/config/commissions/default', data: { rate } });
  }

  public async adminUpdateShopCommission(shopId: number, rate: number) {
    return this.request<void>({ method: 'PUT', url: `/admin/config/commissions/shop/${shopId}`, data: { rate } });
  }

  public async adminGetRevenueStats() {
    return this.request<AdminRevenueStats>({ method: 'GET', url: '/admin/dashboard/revenue-stats' });
  }

  public async adminGetRevenueByShop() {
    return this.request<any>({ method: 'GET', url: '/admin/dashboard/revenue-by-shop' });
  }

  public async adminGetLogs() {
    return this.request<any[]>({ method: 'GET', url: '/admin/logs' });
  }
}

export const apiService = ApiService.getInstance();
export default apiService;