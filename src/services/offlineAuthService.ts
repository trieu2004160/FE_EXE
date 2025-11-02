// Offline Authentication Utilities
export interface OfflineUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  isOffline: boolean;
}

export interface OfflineAuthData {
  email: string;
  password: string; // In real app, this should be hashed
  user: OfflineUser;
}

class OfflineAuthService {
  private readonly STORAGE_KEY = 'offlineUsers';
  private readonly CURRENT_USER_KEY = 'currentUser';
  private readonly AUTH_TOKEN_KEY = 'userToken';

  // Get all offline users
  private getOfflineUsers(): OfflineAuthData[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading offline users:', error);
      return [];
    }
  }

  // Save offline users
  private saveOfflineUsers(users: OfflineAuthData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving offline users:', error);
    }
  }

  // Register user offline
  async registerOffline(userData: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }): Promise<{ success: boolean; message: string; user?: OfflineUser }> {
    const existingUsers = this.getOfflineUsers();
    
    // Check if user already exists
    const existingUser = existingUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      return {
        success: false,
        message: 'Email đã được sử dụng trong chế độ offline'
      };
    }

    // Create new user
    const newUser: OfflineUser = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fullName: userData.fullName,
      email: userData.email.toLowerCase(),
      phone: userData.phone,
      role: 'user',
      createdAt: new Date().toISOString(),
      isOffline: true
    };

    const newAuthData: OfflineAuthData = {
      email: userData.email.toLowerCase(),
      password: userData.password, // In production, hash this
      user: newUser
    };

    // Save to storage
    existingUsers.push(newAuthData);
    this.saveOfflineUsers(existingUsers);

    return {
      success: true,
      message: 'Đăng ký thành công trong chế độ offline',
      user: newUser
    };
  }

  // Login user offline
  async loginOffline(email: string, password: string): Promise<{
    success: boolean;
    message: string;
    user?: OfflineUser;
    token?: string;
  }> {
    const offlineUsers = this.getOfflineUsers();
    
    const userAuth = offlineUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!userAuth) {
      return {
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      };
    }

    // Generate offline token
    const offlineToken = `offline_${Date.now()}_${userAuth.user.id}`;
    
    // Save current session
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userAuth.user));
    localStorage.setItem(this.AUTH_TOKEN_KEY, offlineToken);

    return {
      success: true,
      message: 'Đăng nhập thành công (chế độ offline)',
      user: userAuth.user,
      token: offlineToken
    };
  }

  // Get current user
  getCurrentUser(): OfflineUser | null {
    try {
      const userData = localStorage.getItem(this.CURRENT_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Check if user is authenticated (offline or online)
  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  // Get offline users count for admin
  getOfflineUsersCount(): number {
    return this.getOfflineUsers().length;
  }

  // Clear all offline data (for testing/reset)
  clearOfflineData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

}

export const offlineAuthService = new OfflineAuthService();