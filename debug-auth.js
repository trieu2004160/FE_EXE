// Debug script to test authentication logic outside of React app

// Mock localStorage
const localStorage = {
  storage: {},
  getItem(key) {
    return this.storage[key] || null;
  },
  setItem(key, value) {
    this.storage[key] = value;
  },
  removeItem(key) {
    delete this.storage[key];
  },
};

// Simulate user data from demoAccounts
const demoUserData = {
  id: "shop@nova.com",
  email: "shop@nova.com",
  fullName: "Shop Owner",
  role: "shop",
  shopId: 1,
  roles: ["shop"],
};

// Create JWT-like mock token (same logic as Login.tsx)
const header = { alg: "HS256", typ: "JWT" };
const payload = {
  email: demoUserData.email,
  nameid: demoUserData.id,
  role: demoUserData.role,
  exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  iss: "nova-app",
  aud: "nova-users",
};

// Add ShopId for shop users
if (demoUserData.role?.toLowerCase() === "shop" && demoUserData.shopId) {
  payload.ShopId = demoUserData.shopId.toString();
}

// Create JWT format: header.payload.signature
const encodedHeader = btoa(JSON.stringify(header));
const encodedPayload = btoa(JSON.stringify(payload));
const mockSignature = btoa("mock-signature");
const mockToken = `${encodedHeader}.${encodedPayload}.${mockSignature}`;

console.log("=== DEBUG AUTHENTICATION ===");
console.log("Mock Token:", mockToken);
console.log("");

// Store token
// localStorage.setItem("userToken", mockToken);
localStorage.removeItem("userToken");

// Test decodeJWT function (copy from tokenUtils.ts)
const decodeJWT = (token) => {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (middle part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64 and parse JSON
    const decodedPayload = JSON.parse(atob(paddedPayload));

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Test getTokenInfo function
const getTokenInfo = () => {
  const token = localStorage.getItem("userToken");
  if (!token || token === "authenticated") {
    return null;
  }

  return decodeJWT(token);
};

// Test getUserRole function
const getUserRole = () => {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return null;
  }

  // Handle both single role and array of roles
  if (Array.isArray(tokenInfo.role)) {
    // Return first role or prioritize shop role (case-insensitive)
    const shopRole = tokenInfo.role.find(
      (role) => role.toLowerCase() === "shop"
    );
    if (shopRole) {
      return shopRole;
    }
    return tokenInfo.role[0];
  }

  return tokenInfo.role;
};

// Test isTokenValid function
const isTokenValid = () => {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return false;
  }

  // Check if token is expired
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenInfo.exp > currentTime;
};

// Test hasShopRole function
const hasShopRole = () => {
  const role = getUserRole();
  return role?.toLowerCase() === "shop";
};

// Test getShopId function
const getShopId = () => {
  const tokenInfo = getTokenInfo();
  if (!tokenInfo || !tokenInfo.ShopId) {
    return null;
  }

  return parseInt(tokenInfo.ShopId);
};

// Run all tests
console.log("Token Info:", getTokenInfo());
console.log("User Role:", getUserRole());
console.log("Is Token Valid:", isTokenValid());
console.log("Has Shop Role:", hasShopRole());
console.log("Shop ID:", getShopId());

console.log("");
console.log("=== EXPECTED RESULTS ===");
console.log(
  'Token Info: Should show decoded payload with role="shop" and ShopId="1"'
);
console.log('User Role: Should return "shop"');
console.log("Is Token Valid: Should return true");
console.log("Has Shop Role: Should return true");
console.log("Shop ID: Should return 1");
