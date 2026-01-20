// Orders API - Handle order creation and payment
import { apiService } from './apiService';

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  shippingAddress?: ShippingAddress; // Optional - can use address from user profile
  paymentMethod?: 'cash_on_delivery' | 'payos';
  discountCode?: string;
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

type ErrorWithMessage = { message?: unknown };

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && typeof error.message === 'string' && error.message.trim() !== '') {
    return error.message;
  }

  if (typeof error === 'string' && error.trim() !== '') {
    return error;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const maybe = (error as ErrorWithMessage).message;
    if (typeof maybe === 'string' && maybe.trim() !== '') {
      return maybe;
    }
  }

  return fallback;
};

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
      console.log('[OrdersApi] Creating order with data:', orderData);
      const response = await apiService.createOrder(orderData);
      console.log('[OrdersApi] Order created successfully:', response);
      return response;
    } catch (error: unknown) {
      console.error('[OrdersApi] Error creating order:', error);
      throw new Error(getErrorMessage(error, 'Không thể tạo đơn hàng. Vui lòng thử lại.'));
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

  // Create PayOS link for an existing orderId
  async createPayOSPayment(orderId: number): Promise<{ checkoutUrl: string }> {
    try {
      return await apiService.createPayOSPaymentLink(orderId);
    } catch (error: unknown) {
      console.error('[OrdersApi] Error creating PayOS payment link:', error);
      throw new Error(getErrorMessage(error, 'Không thể tạo liên kết thanh toán PayOS. Vui lòng thử lại.'));
    }
  }

  // Get order by ID from API
  async getOrderById(orderId: number): Promise<OrderResponseDto | null> {
    try {
      const response = await apiService.getOrderById(orderId);
      return response;
    } catch (error: unknown) {
      console.error('Error getting order:', error);
      const msg = getErrorMessage(error, '');
      if (msg.includes('404') || msg.includes('Not Found')) {
        return null;
      }
      throw error;
    }
  }
}

export const ordersApi = new OrdersApi();