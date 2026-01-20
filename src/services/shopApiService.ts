import axios from 'axios';
import { isTokenValid, hasShopRole, clearAuthData } from '@/utils/tokenUtils';

const API_BASE_URL = 'http://localhost:8081/api';

// Create axios instance with default config
const shopApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests and handle auth errors
shopApi.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('userToken');
  
  // Check if user has shop role and valid token
  if (!token || token === 'authenticated' || !isTokenValid() || !hasShopRole()) {
    throw new Error('Token không hợp lệ hoặc không có quyền truy cập Shop');
  }
  
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle response errors
shopApi.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      clearAuthData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interfaces
export interface ShopDashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  pendingOrders: number;
  monthlyRevenue: number;
  totalOrders: number;
}

export interface ShopProfile {
  id: number;
  name: string;
  description?: string;
  phone?: string;
  imageUrl?: string;
  address?: string;
  email?: string;
}

export interface ShopProduct {
  id: number;
  name: string;
  description?: string;
  features?: string;
  isPopular: boolean;
  basePrice: number;
  stockQuantity: number;
  productCategoryId: number;
  imageUrl?: string;
  specifications: {
    xuatXu?: string;
    baoQuan?: string;
    hanSuDung?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  features?: string;
  isPopular: boolean;
  basePrice: number;
  stockQuantity: number;
  productCategoryId: number;
  imageFile?: File;
  imageUrl?: string;
  specifications: {
    xuatXu?: string;
    baoQuan?: string;
    hanSuDung?: string;
  };
}

export interface ShopOrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  customerName: string;
  customerPhone: string;
  orderDate: string;
}

export interface ShopReview {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ShopStatistics {
  monthlyRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    productId: number;
    productName: string;
    totalSold: number;
    revenue: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

// API Functions
export const shopApiService = {
  // Dashboard
  getDashboardStats: async (): Promise<ShopDashboardStats> => {
    const response = await shopApi.get('/shop/dashboard');
    return response.data;
  },

  // Profile Management
  getProfile: async (): Promise<ShopProfile> => {
    const response = await shopApi.get('/shop/profile');
    return response.data;
  },

  updateProfile: async (profileData: Partial<ShopProfile>, imageFile?: File): Promise<ShopProfile> => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('imageFile', imageFile);
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      const response = await shopApi.put('/shop/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await shopApi.put('/shop/profile', profileData);
      return response.data;
    }
  },

  // Product Management
  getProducts: async (): Promise<ShopProduct[]> => {
    const response = await shopApi.get('/shop/products');
    return response.data;
  },

  createProduct: async (productData: CreateProductRequest): Promise<ShopProduct> => {
    if (productData.imageFile) {
      const formData = new FormData();
      formData.append('imageFile', productData.imageFile);
      
      // Add other fields
      formData.append('name', productData.name);
      if (productData.description) formData.append('description', productData.description);
      if (productData.features) formData.append('features', productData.features);
      formData.append('isPopular', productData.isPopular.toString());
      formData.append('basePrice', productData.basePrice.toString());
      formData.append('stockQuantity', productData.stockQuantity.toString());
      formData.append('productCategoryId', productData.productCategoryId.toString());
      
      // Add specifications
      if (productData.specifications.xuatXu) {
        formData.append('specifications.xuatXu', productData.specifications.xuatXu);
      }
      if (productData.specifications.baoQuan) {
        formData.append('specifications.baoQuan', productData.specifications.baoQuan);
      }
      if (productData.specifications.hanSuDung) {
        formData.append('specifications.hanSuDung', productData.specifications.hanSuDung);
      }

      const response = await shopApi.post('/shop/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await shopApi.post('/shop/products', productData);
      return response.data;
    }
  },

  updateProduct: async (productId: number, productData: Partial<CreateProductRequest>): Promise<ShopProduct> => {
    if (productData.imageFile) {
      const formData = new FormData();
      formData.append('imageFile', productData.imageFile);
      
      Object.entries(productData).forEach(([key, value]) => {
        if (key !== 'imageFile' && value !== undefined) {
          if (key === 'specifications' && typeof value === 'object') {
            Object.entries(value).forEach(([specKey, specValue]) => {
              if (specValue) {
                formData.append(`specifications.${specKey}`, specValue.toString());
              }
            });
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await shopApi.put(`/shop/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await shopApi.put(`/shop/products/${productId}`, productData);
      return response.data;
    }
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await shopApi.delete(`/shop/products/${productId}`);
  },

  // Order Management
  getOrders: async (): Promise<ShopOrderItem[]> => {
    const response = await shopApi.get('/shop/orders');
    return response.data;
  },

  updateOrderItemStatus: async (
    orderItemId: number, 
    status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<void> => {
    // Backend expects UpdateOrderItemStatusDto { newStatus: OrderItemShopStatus }
    // Enum order in BE: Pending=0, Preparing=1, ReadyToShip=2, Shipped=3, Cancelled=4
    const statusToEnumValue: Record<string, number> = {
      pending: 0,
      preparing: 1,
      // No "delivered" in BE enum; treat as Shipped for now
      shipped: 3,
      delivered: 3,
      cancelled: 4,
    };

    const newStatusValue = statusToEnumValue[String(status)];
    if (newStatusValue === undefined) {
      throw new Error(`Invalid order status: ${status}`);
    }

    await shopApi.put(`/shop/orders/items/${orderItemId}/status`, { newStatus: newStatusValue });
  },

  // Review Management
  getReviews: async (): Promise<ShopReview[]> => {
    const response = await shopApi.get('/shop/reviews');
    return response.data;
  },

  // Statistics
  getStatistics: async (): Promise<ShopStatistics> => {
    const response = await shopApi.get('/shop/statistics');
    return response.data;
  },
};

export default shopApiService;