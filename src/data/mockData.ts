// Types only - no hardcoded data
// All data should come from API/Backend

export interface Shop {
  id: number;
  name: string;
  avatar: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  isVerified?: boolean;
  rating: number;
  totalSales: number;
  totalProducts: number;
  joinedDate: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  description?: string;
  shopId: number;
}
