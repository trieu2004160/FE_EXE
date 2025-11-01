// Mock JWT token generation for demo purposes
export const createMockJWT = (userData: {
  id: string;
  email: string;
  fullName: string;
  role: string;
  shopId?: number;
  roles: string[];
}) => {
  // Create JWT header
  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  // Create JWT payload with correct claim names to match backend
  const payload = {
    email: userData.email,
    nameid: userData.id, // User ID
    role: userData.roles, // Array of roles
    ShopId: userData.shopId?.toString(), // Shop ID as string
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days from now
    iss: "nova-app",
    aud: "nova-users"
  };

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/[=]/g, '');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/[=]/g, '');
  
  // Create mock signature (in real JWT this would be cryptographically signed)
  const mockSignature = btoa("mock-signature").replace(/[=]/g, '');

  // Combine all parts
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

// Function to create proper mock JWT for demo accounts
export const generateDemoJWT = (email: string, password: string, demoUserData: any) => {
  return createMockJWT({
    id: demoUserData.id,
    email: demoUserData.email,
    fullName: demoUserData.fullName,
    role: demoUserData.role,
    shopId: demoUserData.shopId,
    roles: [demoUserData.role === 'admin' ? 'Admin' : demoUserData.role === 'shop' ? 'Shop' : 'User']
  });
};