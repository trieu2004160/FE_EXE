// Token utilities for JWT handling
export interface DecodedToken {
  email: string;
  nameid: string; // User ID
  role: string | string[]; // Can be single role or array of roles
  ShopId?: string;
  exp: number;
  iss: string;
  aud: string;
}

export const decodeJWT = (token: string): DecodedToken | null => {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (middle part)
    const payload = parts[1];
    
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64 and parse JSON
    const decodedPayload = JSON.parse(atob(paddedPayload));
    
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getTokenInfo = () => {
  const token = localStorage.getItem('userToken');
  if (!token || token === 'authenticated') {
    return null;
  }
  
  return decodeJWT(token);
};

export const getUserRole = (): string | null => {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    // Fallback to localStorage
    return localStorage.getItem('userRole');
  }
  
  // Get role from token - try multiple claim formats
  let role = tokenInfo.role;
  
  // If role is in the token but with namespace claim
  if (!role && (tokenInfo as any)) {
    const decoded = tokenInfo as any;
    role = decoded.role 
      || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      || null;
  }
  
  if (!role) {
    return localStorage.getItem('userRole');
  }
  
  // Handle both single role and array of roles
  if (Array.isArray(role)) {
    // Return first role or prioritize shop role (case-insensitive)
    const shopRole = role.find(r => r?.toLowerCase() === 'shop');
    if (shopRole) {
      return shopRole;
    }
    return role[0] || null;
  }
  
  return role;
};

export const getShopId = (): number | null => {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return null;
  }
  
  // Try multiple claim formats
  const decoded = tokenInfo as any;
  const shopId = tokenInfo.ShopId 
    || decoded.shopId 
    || decoded['ShopId']
    || null;
  
  if (!shopId) {
    return null;
  }
  
  const parsed = parseInt(String(shopId));
  return isNaN(parsed) ? null : parsed;
};

export const isTokenValid = (): boolean => {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return false;
  }
  
  // Check if token is expired
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenInfo.exp > currentTime;
};

export const hasShopRole = (): boolean => {
  const role = getUserRole();
  return role?.toLowerCase() === 'shop';
};

export const clearAuthData = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userData');
};