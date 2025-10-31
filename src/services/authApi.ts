// Auth API - Handles authentication and user shipping info
import { apiService, UserProfile, authUtils } from './apiService';
import { offlineAuthService, OfflineUser } from './offlineAuthService';

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
  // Get current user (online or offline)
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

    // Fallback to offline user
    const offlineUser = offlineAuthService.getCurrentUser();
    if (offlineUser) {
      return {
        id: offlineUser.id,
        email: offlineUser.email,
        fullName: offlineUser.fullName,
        phone: offlineUser.phone,
        role: offlineUser.role,
      };
    }

    return null;
  }

  // Logout
  logout(): void {
    authUtils.removeToken();
    offlineAuthService.logout();
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

  // Get user profile (try online first, then offline)
  async getProfile(): Promise<UserProfile | OfflineUser | null> {
    try {
      if (authUtils.isAuthenticated()) {
        const profile = await apiService.getProfile();
        return profile;
      }
    } catch (error) {
      console.warn('Error fetching online profile:', error);
    }

    // Fallback to offline user
    return offlineAuthService.getCurrentUser();
  }
}

export const authApi = new AuthApi();

