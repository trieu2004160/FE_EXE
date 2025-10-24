export interface Shop {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  joinedDate: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  isVerified: boolean;
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

export const mockShops: Shop[] = [
  {
    id: 1,
    name: "Xôi Chè Cô Bốn",
    avatar: "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/481970326_1053684360116760_3790526025556053821_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ONCXx_N7Fc4Q7kNvwGMKh-N&_nc_oc=AdnfwbXyRImNPUvXYz5hY5mX7JLU0MroCyUKfEHvT3061D-ZuJ7V9FQWSb3NSJGFRwr3SkdfT4fNHkbBovfNMyVz&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=sXT1orDzHf59AQw45eo5zA&oh=00_AfcsHwABxwo8hEIy325ug9Z1DPYUP4-uPBpDB6sjPo6B5g&oe=690070AC",
    rating: 4.8,
    totalProducts: 45,
    totalSales: 1250,
    joinedDate: "2023-01-15",
    description: "Chuyên cung cấp đồ cúng tâm linh, hoa quả tươi ngon và các sản phẩm phong thủy chất lượng cao.",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "contact@docungtamlinh.com",
    isVerified: true,
  },
  {
    id: 2,
    name: "Shop Hương Nến Thiên Nhiên",
    avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 4.9,
    totalProducts: 32,
    totalSales: 890,
    joinedDate: "2023-03-20",
    description: "Chuyên sản xuất và phân phối hương nến thiên nhiên, trầm hương cao cấp cho không gian tâm linh.",
    address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM",
    phone: "0907654321",
    email: "info@huongnenthiennhien.com",
    isVerified: true,
  },
  {
    id: 3,
    name: "Hoa Quả Tươi Sạch",
    avatar: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    rating: 4.7,
    totalProducts: 28,
    totalSales: 650,
    joinedDate: "2023-05-10",
    description: "Cung cấp hoa quả tươi sạch, được tuyển chọn kỹ lưỡng cho các dịp lễ cúng và sinh hoạt gia đình.",
    address: "789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
    phone: "0909876543",
    email: "sales@hoaquatuoisach.com",
    isVerified: false,
  },
];

export const mockProducts: Product[] = [
  // 🌸 HƯƠNG NẾN
  {
    id: 1,
    name: "Nến Thơm Trầm Hương",
    price: 59000,
    image:
      "https://tanmydesign.com/uploaded/san-pham/Noi%20that/PHong%20tam/cochine/Candles/AGW_Candle_With%20box_0682.jpg",
    rating: 5,
    reviews: 74,
    category: "Hương Nến",
    shopId: 2,
    description:
      "Nến thơm trầm hương giúp thanh lọc không khí, tạo cảm giác thư giãn và trang nghiêm khi thắp hương cúng.",
  },
  {
    id: 2,
    name: "Hộp Hương Que Quế Chi",
    price: 49000,
    image:
      "https://nhangmoclam.com/wp-content/uploads/2024/01/nu-que-chi-100g-cao-cap-moc-lam.jpg",
    rating: 4,
    reviews: 51,
    category: "Hương Nến",
    shopId: 2,
    description:
      "Hương que làm từ bột quế tự nhiên, cháy đều, thơm dịu – phù hợp cho mọi không gian thờ cúng.",
  },
  {
    id: 3,
    name: "Nến Ly Vàng Truyền Thống",
    price: 39000,
    image:
      "https://vatphamphatgiao.com/wp-content/uploads/2022/11/Nen-Coc-%E2%80%93-Den-Cay-Ly-Thuy-Tinh-Hoa-Sen-Doi-Mau-Vang-Chay-24h-1.jpg",
    rating: 5,
    reviews: 68,
    category: "Hương Nến",
    shopId: 2,
    description:
      "Cặp nến ly màu vàng, biểu trưng cho sự sung túc, ấm no và thịnh vượng trong mỗi dịp lễ.",
  },
  {
    id: 4,
    name: "Hương Nụ Hoa Sen",
    price: 69000,
    image:
      "https://hinhanh.nhungtho.vn/upload/MOTNENNHANGTHOM/241199251_1593166721031516_8423503939944489630_n.jpg",
    rating: 5,
    reviews: 39,
    category: "Hương Nến",
    shopId: 2,
    description:
      "Hương nụ hoa sen nhẹ nhàng, thanh khiết – mang lại không gian tĩnh lặng, an yên.",
  },

  // 🍎 HOA QUẢ
  {
    id: 5,
    name: "Chuối Chín Vàng",
    price: 29000,
    image:
      "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/12/26/chuoi-chin-16720695582281654655438.jpg",
    rating: 5,
    reviews: 90,
    category: "Hoa Quả",
    shopId: 3,
    description:
      "Nải chuối chín vàng tự nhiên – biểu trưng cho sự sum vầy, đủ đầy trong mâm cúng gia tiên.",
  },
  {
    id: 6,
    name: "Cam Tươi Ngọt",
    price: 35000,
    image:
      "https://cf.shopee.vn/file/af560124280e0f7e97b7fae473f0bcf0",
    rating: 4,
    reviews: 42,
    category: "Hoa Quả",
    shopId: 3,
    description:
      "Cam chín mọng, ngọt thanh, tượng trưng cho may mắn và tài lộc trong các dịp lễ cúng.",
  },
  {
    id: 7,
    name: "Táo Đỏ Tươi",
    price: 39000,
    image:
      "https://stockdep.net/files/images/8048665.jpg",
    rating: 4,
    reviews: 55,
    category: "Hoa Quả",
    shopId: 3,
    description:
      "Táo đỏ tươi giòn ngọt, tượng trưng cho sự bình an và may mắn cho gia đình.",
  },
  {
    id: 8,
    name: "Mãng Cầu Xanh",
    price: 45000,
    image:
      "https://tamthatlaocai.vn/wp-content/uploads/2022/02/mang-cau-xiem.jpg",
    rating: 5,
    reviews: 48,
    category: "Hoa Quả",
    shopId: 3,
    description:
      "Mãng cầu tươi ngon – biểu trưng cho cầu mong điều lành, thường dùng trong mâm ngũ quả truyền thống.",
  },

  // 🍵 XÔI – CHÈ
  {
    id: 9,
    name: "Xôi Gấc Đỏ",
    price: 29000,
    image:
      "https://i-giadinh.vnecdn.net/2023/12/08/Thnhphm11-1702020519-9081-1702020523.jpg",
    rating: 5,
    reviews: 61,
    category: "Xôi – Chè",
    shopId: 1,
    description:
      "Xôi gấc đỏ thơm ngon – tượng trưng cho may mắn, hạnh phúc và sung túc.",
  },
  {
    id: 10,
    name: "Chè Đậu Xanh Truyền Thống",
    price: 25000,
    image:
      "https://file.hstatic.net/200000721249/file/che_dau_xanh__1__530e50a7a3794a01b7221f3946ebbf1d.jpg",
    rating: 5,
    reviews: 48,
    category: "Xôi – Chè",
    shopId: 1,
    description:
      "Chè đậu xanh truyền thống – vị ngọt thanh, dễ ăn, thường dùng trong các dịp lễ cúng.",
  },
  {
    id: 11,
    name: "Chè Trôi Nước",
    price: 27000,
    image:
      "https://file.hstatic.net/200000721249/file/cach_lam_che_troi_nuoc_truyen_thong_cdce03913e29486ea04199f58dcdd017.jpg",
    rating: 4,
    reviews: 52,
    category: "Xôi – Chè",
    shopId: 1,
    description:
      "Chè trôi nước dẻo thơm, viên tròn tượng trưng cho đoàn viên và sung túc.",
  },

  // 🎁 COMBO TIẾT KIỆM (Combo Đồ Cúng)
  {
    id: 12,
    name: "Combo Đồ Cúng Đầy Tháng",
    price: 499000,
    image:
      "https://tiki.vn/blog/wp-content/uploads/2023/09/cach-tinh-ngay-cung-day-thang-cho-be-trai-va-gio-cung.jpg",
    rating: 5,
    reviews: 80,
    category: "Combo Tiết Kiệm",
    shopId: 1,
    description:
      "Combo đồ cúng đầy đủ cho lễ đầy tháng – bao gồm hoa quả, hương nến và xôi chè tiện lợi.",
  },
  {
    id: 13,
    name: "Combo Đồ Cúng Rằm",
    price: 459000,
    image:
      "https://enzy.vn/wp-content/uploads/2025/08/1-7.png",
    rating: 5,
    reviews: 92,
    category: "Combo Tiết Kiệm",
    shopId: 1,
    description:
      "Combo đồ cúng rằm gồm đầy đủ hoa quả, hương, nến và xôi chè – tiện lợi và trang trọng.",
  },
  {
    id: 14,
    name: "Combo Đồ Cúng Tốt Nghiệp",
    price: 529000,
    image:
      "https://docungtamlinh.com.vn/wp-content/uploads/2023/08/cung-co-hon-thang-7-am-lich-2999k-vit-heo-quay-1.jpg",
    rating: 5,
    reviews: 70,
    category: "Combo Tiết Kiệm",
    shopId: 1,
    description:
      "Combo đồ cúng cho lễ tốt nghiệp – tượng trưng cho lòng tri ân và khởi đầu mới.",
  },
  {
    id: 15,
    name: "Combo Đồ Cúng Rằm Tháng 7",
    price: 559000,
    image:
      "https://afamilycdn.com/150157425591193600/2020/8/25/1-15983261150471104397136.jpg",
    rating: 5,
    reviews: 85,
    category: "Combo Tiết Kiệm",
    shopId: 1,
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

// Shop utility functions
export const getShopById = (id: number) => {
  return mockShops.find(shop => shop.id === id);
};

export const getProductsByShopId = (shopId: number) => {
  return mockProducts.filter(product => product.shopId === shopId);
};

export const getAllShops = () => {
  return mockShops;
};