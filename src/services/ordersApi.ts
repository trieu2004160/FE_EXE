// Orders API - Handle order creation and payment
import { apiService } from './apiService';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  products: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash_on_delivery' | 'payos';
}

export interface Order {
  _id: string;
  orderNumber?: string;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
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
  // Create order with cash on delivery
  async create(orderData: CreateOrderRequest): Promise<Order> {
    try {
      // For now, simulate API call
      // In production, this would call your backend API
      // const response = await apiService.request('/orders', {
      //   method: 'POST',
      //   body: JSON.stringify(orderData),
      // });

      // Simulate API response
      const mockOrder: Order = {
        _id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `ORD-${Date.now()}`,
        status: 'pending',
        total: orderData.products.reduce((sum, item) => sum + item.quantity * 100000, 0), // Mock total
        createdAt: new Date().toISOString(),
        shippingAddress: orderData.shippingAddress,
        items: orderData.products,
      };

      // Save to localStorage for order history
      const orders = this.getLocalOrders();
      orders.push(mockOrder);
      localStorage.setItem('user_orders', JSON.stringify(orders));

      return mockOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Create order with PayOS payment
  async createWithPayOS(orderData: CreateOrderRequest): Promise<Order> {
    try {
      // Similar to create, but would include PayOS integration
      const order = await this.create(orderData);
      
      // In production, this would initialize PayOS payment
      // const payosResponse = await apiService.request('/orders/payos', {
      //   method: 'POST',
      //   body: JSON.stringify({ orderId: order._id, ...orderData }),
      // });

      return order;
    } catch (error) {
      console.error('Error creating order with PayOS:', error);
      throw error;
    }
  }

  // Get orders from localStorage (for development)
  private getLocalOrders(): Order[] {
    try {
      const orders = localStorage.getItem('user_orders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Error reading orders:', error);
      return [];
    }
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const orders = this.getLocalOrders();
      return orders.find((o) => o._id === orderId) || null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }
}

export const ordersApi = new OrdersApi();

