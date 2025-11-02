// Orders API - Handle order creation and payment
import { apiService } from './apiService';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  district?: string;
  ward?: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  shippingAddress?: ShippingAddress; // Optional - can use address from user profile
  paymentMethod?: 'cash_on_delivery' | 'payos';
}

export interface OrderResponseDto {
  id: number;
  orderNumber?: string;
  status: string;
  total: number;
  subtotal: number;
  createdAt: string;
  shippingAddress: ShippingAddress;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  shopName: string;
}

// Axios error type for API errors
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: string[];
    };
    status?: number;
  };
  message?: string;
}

class OrdersApi {
  // Create order from cart (selected items only)
  async create(orderData: CreateOrderRequest): Promise<OrderResponseDto> {
    try {
      const response = await apiService.request<OrderResponseDto>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
      
      return response;
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw new Error(error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
  }

  // Create order with PayOS payment (same as create, PayOS integration will be handled on backend)
  async createWithPayOS(orderData: CreateOrderRequest): Promise<OrderResponseDto> {
    try {
      const orderWithPayment = {
        ...orderData,
        paymentMethod: 'payos' as const,
      };
      return await this.create(orderWithPayment);
    } catch (error) {
      console.error('Error creating order with PayOS:', error);
      throw error;
    }
  }

  // Get order by ID from API
  async getOrderById(orderId: number): Promise<OrderResponseDto | null> {
    try {
      const response = await apiService.request<OrderResponseDto>(`/orders/${orderId}`, {
        method: 'GET',
      });
      return response;
    } catch (error: any) {
      console.error('Error getting order:', error);
      if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        return null;
      }
      throw error;
    }
  }
}

export const ordersApi = new OrdersApi();

