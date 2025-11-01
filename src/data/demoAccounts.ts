export interface DemoAccount {
  email: string;
  password: string;
  role: "admin" | "user" | "shop";
  name: string;
  redirectPath?: string; // Custom redirect path after login
  description?: string;
  shopId?: number; // Shop ID for shop users
}

export const demoAccounts: DemoAccount[] = [
  {
    email: "admin@nova.com",
    password: "admin123",
    role: "admin",
    name: "Admin",
    redirectPath: "/", // Admin goes to homepage with dashboard icon
    description: "Quản trị viên hệ thống",
  },
  {
    email: "shop@nova.com",
    password: "shop123",
    role: "shop",
    name: "Shop Owner",
    redirectPath: "/shop-dashboard", // Shop goes directly to dashboard
    description: "Chủ cửa hàng mẫu",
    shopId: 1,
  },
  {
    email: "cobon@example.com",
    password: "ShopPassword123!",
    role: "shop",
    name: "Cobon Shop",
    redirectPath: "/", // This shop goes to homepage with shop icon
    description: "Cửa hàng Cobon",
    shopId: 2,
  },
  {
    email: "user@nova.com",
    password: "user123",
    role: "user",
    name: "User",
    redirectPath: "/profile", // User goes to profile
    description: "Người dùng thường",
  },
];

// Function to find demo account by email and password
export const findDemoAccount = (email: string, password: string): DemoAccount | null => {
  return demoAccounts.find(
    (account) => account.email === email && account.password === password
  ) || null;
};

// Function to add new demo account (for development purposes)
export const addDemoAccount = (account: Omit<DemoAccount, "redirectPath" | "shopId"> & { redirectPath?: string; shopId?: number }) => {
  const newAccount: DemoAccount = {
    ...account,
    redirectPath: account.redirectPath || (account.role === "admin" || account.role === "shop" ? "/" : "/profile"),
    shopId: account.shopId,
  };
  
  demoAccounts.push(newAccount);
  return newAccount;
};

// Function to get user data for JWT token simulation
export const getDemoUserData = (email: string, password: string) => {
  const account = findDemoAccount(email, password);
  if (!account) return null;
  
  return {
    id: account.email, // Using email as ID for demo
    email: account.email,
    fullName: account.name,
    role: account.role,
    shopId: account.shopId,
    roles: [account.role], // Backend expects array of roles
  };
};