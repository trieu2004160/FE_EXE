import {
  apiService,
  ShopDashboardDto,
  ShopProfile,
  ShopProduct,
  ShopOrder,
  ShopReview,
  ShopStatistics,
  CreateProductRequest,
  UpdateProductRequest
} from './apiService';

// Re-export types for convenience
export type { ShopDashboardDto, ShopProfile, ShopProduct, ShopOrder, ShopReview, ShopStatistics };

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
    return await apiService.getShopProfile();
  },

  // PUT /api/shop/profile
  updateShopProfile: async (profileData: any): Promise<ShopProfile> => {
    return await apiService.updateShopProfile(profileData);
  },

  // Products management
  // GET /api/shop/products
  getShopProducts: async (params?: any): Promise<{ products: ShopProduct[]; total: number }> => {
    return await apiService.getShopProducts(params);
  },

  // POST /api/shop/products
  createProduct: async (productData: CreateProductRequest): Promise<ShopProduct> => {
    return await apiService.createShopProduct(productData);
  },

  // PUT /api/shop/products/{id}
  updateProduct: async (id: number, productData: UpdateProductRequest): Promise<ShopProduct> => {
    return await apiService.updateShopProduct(id, productData);
  },

  // DELETE /api/shop/products/{id}
  deleteProduct: async (id: number): Promise<void> => {
    return await apiService.deleteShopProduct(id);
  },

  // Orders management
  // GET /api/shop/orders
  getShopOrders: async (params?: any): Promise<{ orders: ShopOrder[]; total: number }> => {
    return await apiService.getShopOrders(params);
  },

  // PUT /api/shop/orders/items/{orderItemId}/status
  updateOrderStatus: async (orderItemId: number, status: string): Promise<void> => {
    return await apiService.updateOrderStatus(orderItemId, status);
  },

  // Reviews management
  // GET /api/shop/reviews
  getShopReviews: async (): Promise<ShopReview[]> => {
    return await apiService.getShopReviews();
  },

  // Statistics
  // GET /api/shop/statistics
  getShopStatistics: async (): Promise<ShopStatistics> => {
    return await apiService.getShopStatistics();
  },
};