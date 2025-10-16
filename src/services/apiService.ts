// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Types for API requests and responses
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiResponse<T = unknown> {
  message?: string;
  data?: T;
}

// API service class
class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('userToken');
    if (token && token !== 'authenticated') {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(data: RegisterRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/accounts/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/accounts/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Helper method to check if backend is available
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/accounts/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.warn('Backend health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Utility functions for auth token management
export const authUtils = {
  setToken: (token: string) => {
    localStorage.setItem('userToken', token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('userToken');
  },
  
  removeToken: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
  },
  
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('userToken');
    return !!token;
  }
};