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
}

export const mockProducts: Product[] = [
  // 🌸 HƯƠNG NẾN
  {
    id: 1,
    name: "Nến Thơm Trầm Hương",
    price: 59000,
    image:
      "https://images.unsplash.com/photo-1612010167103-3fada3f9f0a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 74,
    category: "Hương Nến",
    description:
      "Nến thơm trầm hương giúp thanh lọc không khí, tạo cảm giác thư giãn và trang nghiêm khi thắp hương cúng.",
  },
  {
    id: 2,
    name: "Hộp Hương Que Quế Chi",
    price: 49000,
    image:
      "https://images.unsplash.com/photo-1615484477898-5e5b09dfb2c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4,
    reviews: 51,
    category: "Hương Nến",
    description:
      "Hương que làm từ bột quế tự nhiên, cháy đều, thơm dịu – phù hợp cho mọi không gian thờ cúng.",
  },
  {
    id: 3,
    name: "Nến Ly Vàng Truyền Thống",
    price: 39000,
    image:
      "https://images.unsplash.com/photo-1594385461347-77d03f9a2c8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 68,
    category: "Hương Nến",
    description:
      "Cặp nến ly màu vàng, biểu trưng cho sự sung túc, ấm no và thịnh vượng trong mỗi dịp lễ.",
  },
  {
    id: 4,
    name: "Hương Nụ Hoa Sen",
    price: 69000,
    image:
      "https://images.unsplash.com/photo-1611904751804-6f2ef83b6b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 39,
    category: "Hương Nến",
    description:
      "Hương nụ hoa sen nhẹ nhàng, thanh khiết – mang lại không gian tĩnh lặng, an yên.",
  },

  // 🍎 HOA QUẢ
  {
    id: 5,
    name: "Chuối Chín Vàng",
    price: 29000,
    image:
      "https://images.unsplash.com/photo-1574226516831-e1dff420e12e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 90,
    category: "Hoa Quả",
    description:
      "Nải chuối chín vàng tự nhiên – biểu trưng cho sự sum vầy, đủ đầy trong mâm cúng gia tiên.",
  },
  {
    id: 6,
    name: "Cam Tươi Ngọt",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1619566636858-71b1c7c7d8d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4,
    reviews: 42,
    category: "Hoa Quả",
    description:
      "Cam chín mọng, ngọt thanh, tượng trưng cho may mắn và tài lộc trong các dịp lễ cúng.",
  },
  {
    id: 7,
    name: "Táo Đỏ Tươi",
    price: 39000,
    image:
      "https://images.unsplash.com/photo-1570930031263-d00c7f3d40d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4,
    reviews: 55,
    category: "Hoa Quả",
    description:
      "Táo đỏ tươi giòn ngọt, tượng trưng cho sự bình an và may mắn cho gia đình.",
  },
  {
    id: 8,
    name: "Mãng Cầu Xanh",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1623164921038-0b6d91cb8f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 48,
    category: "Hoa Quả",
    description:
      "Mãng cầu tươi ngon – biểu trưng cho cầu mong điều lành, thường dùng trong mâm ngũ quả truyền thống.",
  },

  // 🍵 XÔI – CHÈ
  {
    id: 9,
    name: "Xôi Gấc Đỏ",
    price: 29000,
    image:
      "https://images.unsplash.com/photo-1607330284363-3f41b9e3c5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 61,
    category: "Xôi – Chè",
    description:
      "Xôi gấc đỏ thơm ngon – tượng trưng cho may mắn, hạnh phúc và sung túc.",
  },
  {
    id: 10,
    name: "Chè Đậu Xanh Truyền Thống",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1615483213080-1aef8b6e3d6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 48,
    category: "Xôi – Chè",
    description:
      "Chè đậu xanh truyền thống – vị ngọt thanh, dễ ăn, thường dùng trong các dịp lễ cúng.",
  },
  {
    id: 11,
    name: "Chè Trôi Nước",
    price: 27000,
    image:
      "https://images.unsplash.com/photo-1615484479154-8c9d6a7d69a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4,
    reviews: 52,
    category: "Xôi – Chè",
    description:
      "Chè trôi nước dẻo thơm, viên tròn tượng trưng cho đoàn viên và sung túc.",
  },

  // 🎁 COMBO TIẾT KIỆM (Combo Đồ Cúng)
  {
    id: 12,
    name: "Combo Đồ Cúng Đầy Tháng",
    price: 499000,
    image:
      "https://images.unsplash.com/photo-1617196039793-6576bdbd03b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 80,
    category: "Combo Tiết Kiệm",
    description:
      "Combo đồ cúng đầy đủ cho lễ đầy tháng – bao gồm hoa quả, hương nến và xôi chè tiện lợi.",
  },
  {
    id: 13,
    name: "Combo Đồ Cúng Rằm",
    price: 459000,
    image:
      "https://images.unsplash.com/photo-1606820979393-1ec67b4bbfd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 92,
    category: "Combo Tiết Kiệm",
    description:
      "Combo đồ cúng rằm gồm đầy đủ hoa quả, hương, nến và xôi chè – tiện lợi và trang trọng.",
  },
  {
    id: 14,
    name: "Combo Đồ Cúng Tốt Nghiệp",
    price: 529000,
    image:
      "https://images.unsplash.com/photo-1597231433140-69c1e1b1b1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 70,
    category: "Combo Tiết Kiệm",
    description:
      "Combo đồ cúng cho lễ tốt nghiệp – tượng trưng cho lòng tri ân và khởi đầu mới.",
  },
  {
    id: 15,
    name: "Combo Đồ Cúng Rằm Tháng 7",
    price: 559000,
    image:
      "https://images.unsplash.com/photo-1623330181173-0c21974f3b75?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 85,
    category: "Combo Tiết Kiệm",
    description:
      "Combo đồ cúng Rằm Tháng 7 – chuẩn bị sẵn đầy đủ lễ vật, tiện lợi và ý nghĩa.",
  },
];



// Utility functions để lọc sản phẩm
export const getBestSellerProducts = () => {
  return mockProducts.filter(product => product.isBestSeller);
};

export const getNewProducts = () => {
  return mockProducts.filter(product => product.isNew);
};

export const getProductsByCategory = (category: string) => {
  return mockProducts.filter(product => product.category === category);
};

export const getProductById = (id: number) => {
  return mockProducts.find(product => product.id === id);
};

export const getFeaturedProducts = (limit: number = 8) => {
  return mockProducts.slice(0, limit);
};

export const getAllCategories = () => {
  const categories = mockProducts.map(product => product.category);
  return [...new Set(categories)];
};

export const getAllProducts = () => {
  return mockProducts;
};