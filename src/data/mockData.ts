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
  {
    id: 1,
    name: "Bộ Hoa Quả Tốt Nghiệp Cao Cấp",
    price: 299000,
    originalPrice: 399000,
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 124,
    category: "Hoa Quả",
    isNew: true,
    isBestSeller: true,
    description: "Bộ hoa quả tươi ngon, đẹp mắt dành cho lễ tốt nghiệp. Bao gồm các loại hoa quả cao cấp được tuyển chọn kỹ lưỡng."
  },
  {
    id: 2,
    name: "Bó Hương Nụ Tâm An",
    price: 149000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKicrU3CuRkCv-l6QfjQWr_TBZuvu6EHZwSbxUt0mNF8R2LK8OB4JodzUPWCxPqVEgWDs&usqp=CAU",
    rating: 5,
    reviews: 89,
    category: "Hương Nến",
    isBestSeller: true,
    description: "Bó hương nụ tâm an với mùi hương thanh khiết, mang lại cảm giác bình an và thư thái."
  },
  {
    id: 3,
    name: "Nến Thờ Long Phụng Sum Vầy",
    price: 199000,
    originalPrice: 249000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHWbAPFjFSLETS9EkHieSxG9dx3IJVBCH-Jg&s",
    rating: 4,
    reviews: 67,
    category: "Hương Nến",
    description: "Nến thờ cao cấp với họa tiết long phụng, tượng trưng cho sự sum vầy và thịnh vượng."
  },
  {
    id: 4,
    name: "Hoa Sen Tươi Phúc Lộc",
    price: 179000,
    image:
      "https://cdn.tgdd.vn/Files/2024/03/18/1563153/sen-da-loc-la-sen-gi-y-nghia-va-cong-dung-sen-da-loc-202403180513497313.jpg",
    rating: 5,
    reviews: 156,
    category: "Hoa Tươi",
    isNew: true,
    description: "Hoa sen tươi đẹp, tượng trưng cho sự thuần khiết và phúc lộc trong các dịp quan trọng."
  },
  {
    id: 6,
    name: "Trà Hoa Cúc Thanh Tịnh",
    price: 129000,
    originalPrice: 159000,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 203,
    category: "Xôi – Chè",
    description: "Trà hoa cúc thanh mát, giúp thanh lọc cơ thể và mang lại cảm giác thư thái."
  },
  {
    id: 7,
    name: "Bình Hoa Lê Trắng Thanh Khiết",
    price: 349000,
    image:
      "https://quatangphale.com.vn/assets/tin-tuc-su-kien/2023_08/binh-hoa-pha-le-58-01_1.jpg",
    rating: 5,
    reviews: 78,
    category: "Hoa Tươi",
    isNew: true,
    description: "Bình hoa lê trắng tinh khôi, tượng trưng cho sự thanh khiết và may mắn."
  },
  // Thêm sản phẩm mới để có đủ dữ liệu
  {
    id: 9,
    name: "Bộ Chén Dĩa Cao Cấp",
    price: 450000,
    originalPrice: 550000,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 201,
    category: "Đồ Dùng",
    isBestSeller: true,
    description: "Bộ chén dĩa cao cấp với thiết kế tinh xảo, phù hợp cho các buổi tiệc quan trọng."
  },
  {
    id: 10,
    name: "Giỏ Hoa Lan Hồ Điệp",
    price: 520000,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 5,
    reviews: 87,
    category: "Hoa Tươi",
    isNew: true,
    description: "Giỏ hoa lan hồ điệp sang trọng, tượng trưng cho sự thành công và vinh quang."
  },
  {
    id: 11,
    name: "Nước Mắm Truyền Thống",
    price: 85000,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    rating: 4,
    reviews: 145,
    category: "Gia Vị",
    description: "Nước mắm truyền thống với hương vị đậm đà, ủ từ cá cơm tươi ngon."
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