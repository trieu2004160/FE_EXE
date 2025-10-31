// Cart Utilities - Manage cart in localStorage

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  shopId?: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const CART_STORAGE_KEY = 'shopping_cart';

class CartUtils {
  // Get cart from localStorage
  getCart(): CartState {
    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const cart = JSON.parse(cartData) as CartState;
        // Recalculate total to ensure consistency
        cart.totalAmount = this.calculateTotal(cart.items);
        return cart;
      }
    } catch (error) {
      console.error('Error reading cart:', error);
    }
    
    return {
      items: [],
      totalAmount: 0,
    };
  }

  // Calculate total from items
  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Add item to cart
  addItem(item: CartItem): void {
    const cart = this.getCart();
    const existingItem = cart.items.find(
      (i) => i.productId === item.productId
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    cart.totalAmount = this.calculateTotal(cart.items);
    this.saveCart(cart);
  }

  // Update item quantity
  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.items.find((i) => i.productId === productId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = quantity;
        cart.totalAmount = this.calculateTotal(cart.items);
        this.saveCart(cart);
      }
    }
  }

  // Remove item from cart
  removeItem(productId: number): void {
    const cart = this.getCart();
    cart.items = cart.items.filter((i) => i.productId !== productId);
    cart.totalAmount = this.calculateTotal(cart.items);
    this.saveCart(cart);
  }

  // Clear cart
  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  // Save cart to localStorage
  private saveCart(cart: CartState): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  // Get cart item count
  getItemCount(): number {
    const cart = this.getCart();
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

export const cartUtils = new CartUtils();

