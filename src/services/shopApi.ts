import { apiService } from './apiService';

// Types matching backend DTOs
// Backend returns PascalCase, but we support both formats
export interface ShopDashboardDto {
  // PascalCase (from backend)
  TotalProducts?: number;
  ProductsInStock?: number;
  OutOfStockProducts?: number;
  PendingOrderItems?: number;
  // camelCase (for frontend convenience)
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

export interface ShopStatisticsDto {
  revenueThisMonth: number;
  ordersThisMonth: number;
  dailyRevenueLast30Days: Record<string, number>;
  ordersToday: number;
}

// Shop Dashboard API endpoints
// Base URL: /api/shop
export const shopApi = {
  // Dashboard data
  // GET /api/shop/dashboard
  getDashboardData: async (): Promise<ShopDashboardDto> => {
    try {
      console.log('[shopApi] Calling getShopDashboard...');
      const result = await apiService.getShopDashboard();
      console.log('[shopApi] Dashboard data received:', result);
      return result;
    } catch (error) {
      console.error('[shopApi] Error in getDashboardData:', error);
      throw error;
    }
  },

  // Shop profile
  // GET /api/shop/profile
  getShopProfile: async (): Promise<ShopProfile> => {
    const raw: any = await apiService.getShopProfile();
    return {
      id: raw?.id ?? raw?.Id ?? 0,
      name: raw?.name ?? raw?.Name ?? "",
      ownerFullName: raw?.ownerFullName ?? raw?.OwnerFullName ?? "",
      ownerEmail: raw?.ownerEmail ?? raw?.OwnerEmail ?? "",
      description: raw?.description ?? raw?.Description,
      address: raw?.address ?? raw?.Address,
      contactPhoneNumber:
        raw?.contactPhoneNumber ?? raw?.ContactPhoneNumber ?? raw?.phone ?? raw?.Phone,
      joinDate: raw?.joinDate ?? raw?.JoinDate,
      avatarBase64: raw?.avatarBase64 ?? raw?.AvatarBase64,
    };
  },

  // PUT /api/shop/profile
  updateShopProfile: async (profileData: {
    name: string;
    ownerFullName?: string;
    ownerEmail?: string;
    contactPhoneNumber?: string;
    address?: string;
    description?: string;
    avatarFile?: File;
    avatarUrl?: string;
  }) => {
    return await apiService.updateShopProfile(profileData);
  },

  // Products management
  // GET /api/shop/products
  getShopProducts: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) => {
    return await apiService.getShopProducts(params);
  },

  // POST /api/shop/products
  createProduct: async (productData: {
    name: string;
    description?: string;
    features?: string;
    isPopular: boolean;
    basePrice: number;
    maxPrice?: number;
    stockQuantity: number;
    productCategoryId: number;
    specifications?: Record<string, string>;
    imageUrls?: string[];
    imageFiles?: File[];
  }) => {
    return await apiService.createShopProduct(productData);
  },

  // PUT /api/shop/products/{id}
  updateProduct: async (id: string, productData: {
    name?: string;
    description?: string;
    features?: string;
    isPopular?: boolean;
    basePrice?: number;
    maxPrice?: number;
    stockQuantity?: number;
    productCategoryId?: number;
    specifications?: Record<string, string>;
    keepImageIds?: number[];
    imageUrls?: string[];
    imageFiles?: File[];
  }) => {
    return await apiService.updateShopProduct(id, productData);
  },

  // DELETE /api/shop/products/{id}
  deleteProduct: async (id: string) => {
    return await apiService.deleteShopProduct(id);
  },

  // Orders management
  // GET /api/shop/orders
  getShopOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    // V2 backend supports order-level management via /shop/orders/v2.
    // We keep params signature but forward only status.
    return await apiService.getShopOrdersV2({ status: params?.status });
  },

  // PUT /api/shop/orders/{orderId}/status
  updateOrderStatus: async (orderId: string, status: string) => {
    return await apiService.updateShopOrderStatus(orderId, status);
  },

  // Reviews management
  // GET /api/shop/reviews
  getShopReviews: async (params?: {
    page?: number;
    limit?: number;
    rating?: number;
  }) => {
    return await apiService.getShopReviews(params);
  },

  // Statistics
  // GET /api/shop/statistics
  getShopStatistics: async () => {
    return await apiService.getShopStatistics();
  },

};

// Types for API responses
export interface ShopDashboardData {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  recentActivities: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }[];
}

export interface ShopProfile {
  id: number;
  name: string;
  ownerFullName: string;
  ownerEmail: string;
  description?: string;
  address?: string;
  contactPhoneNumber?: string;
  joinDate?: string;
  avatarBase64?: string;
}

export interface ShopProduct {
  id: number;
  name: string;
  description: string;
  features?: string;
  imageUrl?: string;
  imageFile?: File;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  specifications?: {
    xuatXu?: string;
    baoQuan?: string;
    hanSuDung?: string;
  };
  productCategoryId: number;
  shop?: {
    id: number;
    shopName: string;
  };
  reviews?: ProductReview[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  features?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  productCategoryId: number;
  imageUrl?: string;
  imageFile?: File;
  specifications?: {
    xuatXu?: string;
    baoQuan?: string;
    hanSuDung?: string;
  };
}

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

export interface ShopOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    ward: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  totalPrice: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface ShopReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerified: boolean;
}

export interface ShopStatistics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  monthlyOrders: number;
  totalProducts: number;
  totalReviews: number;
  averageRating: number;
  revenueChart: {
    month: string;
    revenue: number;
  }[];
  orderChart: {
    date: string;
    orders: number;
  }[];
}