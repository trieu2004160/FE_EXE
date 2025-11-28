// Orders API - Handle order creation and payment
import { apiService, CreateOrderRequest, OrderResponseDto, OrderItemDto, ShippingAddress } from './apiService';

// Re-export types
export type { CreateOrderRequest, OrderResponseDto, OrderItemDto, ShippingAddress };

class OrdersApi {
  // Create order from cart (selected items only)
  async create(orderData: CreateOrderRequest): Promise<OrderResponseDto> {
    try {
      return await apiService.createOrder(orderData);
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
  }

  // Create order with PayOS payment
  // Note: paymentMethod is not currently part of the backend DTO in apiService.
  // If needed, update apiService.ts and the backend.
  async createWithPayOS(orderData: CreateOrderRequest): Promise<OrderResponseDto> {
    try {
      // Logic for PayOS would go here, potentially modifying orderData or calling a different endpoint.
      // For now, we just call create.
      return await this.create(orderData);
    } catch (error) {
      console.error('Error creating order with PayOS:', error);
      throw error;
    }
  }

  // Get order by ID from API
  async getOrderById(orderId: number): Promise<OrderResponseDto | null> {
    try {
      return await apiService.getOrder(orderId);
    } catch (error: any) {
      console.error('Error getting order:', error);
      // Check for 404 in error message or status if available
      if (error.response?.status === 404 || error.message?.includes('404') || error.message?.includes('Not Found')) {
        return null;
      }
      throw error;
    }
  }
}

export const ordersApi = new OrdersApi();
