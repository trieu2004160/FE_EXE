// Auth API - Handles authentication and user shipping info
import { apiService, UserProfile, authUtils } from './apiService';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

class AuthApi {
  // Get current user (online)
  getCurrentUser(): AuthUser | null {
    // Try to get from online profile first
    try {
      const userData = authUtils.getUserData();
      if (userData) {
        return {
          id: userData.email,
          email: userData.email,
          fullName: userData.fullName || '',
          phone: userData.phoneNumber,
          role: authUtils.getUserRole() || undefined,
        };
      }
    } catch (error) {
      console.warn('Error getting online user:', error);
    }

    return null;
  }

  // Logout
  logout(): void {
    authUtils.removeToken();
  }

  // Save shipping info to localStorage
  async saveShippingInfo(info: Omit<ShippingAddress, 'email'>): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('User not logged in');
      }

      const shippingInfo = {
        ...info,
        email: user.email,
      };

      localStorage.setItem(
        `shipping_info_${user.id}`,
        JSON.stringify(shippingInfo)
      );
    } catch (error) {
      console.error('Error saving shipping info:', error);
      throw error;
    }
  }

  // Get shipping info from localStorage
  async getShippingInfo(): Promise<{
    savedShippingInfo: ShippingAddress | null;
  }> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        return { savedShippingInfo: null };
      }

      const savedData = localStorage.getItem(`shipping_info_${user.id}`);
      if (savedData) {
        return {
          savedShippingInfo: JSON.parse(savedData) as ShippingAddress,
        };
      }
    } catch (error) {
      console.error('Error getting shipping info:', error);
    }

    return { savedShippingInfo: null };
  }

  // Get user profile (online)
  async getProfile(): Promise<UserProfile | null> {
    try {
      if (authUtils.isAuthenticated()) {
        const profile = await apiService.getProfile();
        return profile;
      }
    } catch (error) {
      console.warn('Error fetching online profile:', error);
    }

    return null;
  }
}

export const authApi = new AuthApi();

