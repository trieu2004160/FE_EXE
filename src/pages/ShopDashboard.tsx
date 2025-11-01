import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Package,
  BarChart3,
  LogOut,
  Plus,
  Edit,
  Trash2,
  FileText,
  ShoppingCart,
  Heart,
  Star,
  Store,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";

interface Product {
  id: number;
  name: string;
  description?: string;
  features?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  productCategoryId: number;
  imageFile?: File;
  imageUrl?: string;
  specifications: {
    xuatXu?: string;
    baoQuan?: string;
    hanSuDung?: string;
  };
}

interface ProductFormData {
  name: string;
  description?: string;
  features?: string;
  isPopular: boolean;
  basePrice: number;
  maxPrice?: number;
  stockQuantity: number;
  productCategoryId: number;
  imageFile?: File;
  imageUrl?: string;
  specifications: {
    xuatXu?: string;
    baoQuan?: string;
    hanSuDung?: string;
  };
}

const ShopDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");
    if (!token || userRole !== "shop") {
      navigate("/login");
    }
  }, [navigate]);

  // Sample data
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Hoa Hồng Đỏ",
        description: "Hoa hồng đỏ tươi, biểu tượng của tình yêu",
        features: "Ý nghĩa cao quý;Màu sắc rực rỡ",
        isPopular: true,
        basePrice: 150000,
        maxPrice: 300000,
        stockQuantity: 50,
        productCategoryId: 1,
        imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd",
        specifications: {
          xuatXu: "Việt Nam",
          baoQuan: "Nơi khô ráo, thoáng mát",
          hanSuDung: "3-5 ngày",
        },
      },
      {
        id: 2,
        name: "Xôi Nước Cốt Dừa",
        description: "Xôi nước cốt dừa thơm béo, vị ngọt đậm đà",
        features: "Thơm béo;Vị ngọt tự nhiên",
        isPopular: false,
        basePrice: 50000,
        stockQuantity: 30,
        productCategoryId: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
        specifications: {
          xuatXu: "Việt Nam",
          baoQuan: "Bảo quản lạnh",
          hanSuDung: "1-2 ngày",
        },
      },
      {
        id: 3,
        name: "Combo Tốt Nghiệp Cơ Bản",
        description: "Gói cơ bản với hoa tươi và hương nến",
        features: "Đầy đủ vật phẩm;Ý nghĩa tốt lành",
        isPopular: true,
        basePrice: 300000,
        stockQuantity: 20,
        productCategoryId: 4,
        imageUrl:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
        specifications: {
          xuatXu: "Việt Nam",
          baoQuan: "Nơi khô ráo",
          hanSuDung: "7 ngày",
        },
      },
    ];
    setProducts(sampleProducts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleSaveProduct = (formData: ProductFormData) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id ? { ...p, ...formData } : p
        )
      );
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...formData,
      };
      setProducts([...products, newProduct]);
    }
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const categoryMap = {
    1: "Hoa Tươi",
    2: "Hương Nến",
    3: "Xôi Chè",
    4: "Combo",
  };

  const stats = [
    {
      title: "Tổng Sản Phẩm",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Đang Bán",
      value: products.filter((p) => p.stockQuantity > 0).length,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Hết Hàng",
      value: products.filter((p) => p.stockQuantity <= 0).length,
      icon: Heart,
      color: "bg-red-500",
    },
    {
      title: "Sản Phẩm Nổi Bật",
      value: products.filter((p) => p.isPopular).length,
      icon: Star,
      color: "bg-amber-500",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Quản Lý Sản Phẩm", icon: Package },
    { id: "orders", label: "Đơn Hàng", icon: FileText },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include Header */}
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-[calc(100vh-4rem)]">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-[#C99F4D]">Shop Panel</h1>
            <Badge className="mt-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
              Chủ Cửa Hàng
            </Badge>
          </div>

          <nav className="mt-6">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-green-50 transition-colors ${
                    activeTab === item.id
                      ? "bg-green-50 border-r-4 border-green-500 text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  <IconComponent className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng Xuất
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {sidebarItems.find((item) => item.id === activeTab)?.label ||
                "Dashboard"}
            </h2>
            <p className="text-gray-600 mt-2">
              Quản lý và điều chỉnh cửa hàng của bạn
            </p>
          </div>

          {/* Dashboard Content */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6 flex items-center">
                        <div
                          className={`p-3 rounded-full ${stat.color} text-white mr-4`}
                        >
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {stat.value}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt Động Gần Đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span>Sản phẩm "Hoa Hồng Đỏ" đã được cập nhật</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        2 phút trước
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span>Đơn hàng mới #1234 được tạo</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        15 phút trước
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span>Shop đã đăng nhập vào hệ thống</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        30 phút trước
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Management */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">Quản Lý Sản Phẩm</h3>
                  <p className="text-gray-600">Thêm, sửa, xóa sản phẩm</p>
                </div>
                <Button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddForm(true);
                  }}
                  className="bg-[#C99F4D] hover:bg-[#B8904A]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Sản Phẩm
                </Button>
              </div>

              {/* Products Table */}
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sản Phẩm
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh Mục
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng Thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thao Tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={
                                    product.imageUrl ||
                                    (product.imageFile
                                      ? URL.createObjectURL(product.imageFile)
                                      : "https://via.placeholder.com/40")
                                  }
                                  alt={product.name}
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                    {product.isPopular && (
                                      <Star className="h-4 w-4 inline ml-1 text-yellow-500" />
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="outline">
                                {
                                  categoryMap[
                                    product.productCategoryId as keyof typeof categoryMap
                                  ]
                                }
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.basePrice.toLocaleString("vi-VN")}đ
                              {product.maxPrice &&
                                ` - ${product.maxPrice.toLocaleString(
                                  "vi-VN"
                                )}đ`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge
                                className={
                                  product.stockQuantity > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {product.stockQuantity > 0
                                  ? `Còn ${product.stockQuantity}`
                                  : "Hết hàng"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:bg-red-50"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs placeholder */}
          {["orders", "settings"].includes(activeTab) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === "orders" && "Quản Lý Đơn Hàng"}
                  {activeTab === "settings" && "Cài Đặt Cửa Hàng"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Store className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-gray-500">
                    Tính năng này đang được phát triển...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

// Product Form Component
const ProductForm = ({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null;
  onSave: (data: ProductFormData) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    features: product?.features || "",
    isPopular: product?.isPopular ?? false,
    basePrice: product?.basePrice || 0,
    maxPrice: product?.maxPrice || 0,
    stockQuantity: product?.stockQuantity || 0,
    productCategoryId: product?.productCategoryId || 1,
    imageUrl: product?.imageUrl || "",
    specifications: {
      xuatXu: product?.specifications?.xuatXu || "",
      baoQuan: product?.specifications?.baoQuan || "",
      hanSuDung: product?.specifications?.hanSuDung || "",
    },
  });

  const [imageMethod, setImageMethod] = useState<"url" | "file">("url");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoryOptions = [
    { id: 1, name: "Hoa Tươi" },
    { id: 2, name: "Hương Nến" },
    { id: 3, name: "Xôi Chè" },
    { id: 4, name: "Combo" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {product ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ví dụ: Hoa Hồng Đỏ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.productCategoryId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productCategoryId: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    title="Chọn danh mục sản phẩm"
                    required
                  >
                    {categoryOptions.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mô tả sản phẩm
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả ngắn về sản phẩm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Đặc điểm sản phẩm
                </label>
                <Textarea
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="Các đặc điểm phân cách bằng dấu ; (ví dụ: Ý nghĩa cao quý;Màu sắc rực rỡ)"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-3">
                <Switch
                  checked={formData.isPopular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPopular: checked })
                  }
                />
                <label className="text-sm font-medium">Sản phẩm nổi bật</label>
              </div>
            </div>

            {/* Giá và số lượng */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Giá và tồn kho
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Giá gốc (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        basePrice: Number(e.target.value),
                      })
                    }
                    placeholder="150000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Giá tối đa (VNĐ)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.maxPrice || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="300000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số lượng tồn kho <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stockQuantity: Number(e.target.value),
                      })
                    }
                    placeholder="50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Hình ảnh */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Hình ảnh sản phẩm
              </h3>

              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setImageMethod("url")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    imageMethod === "url"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Nhập URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageMethod("file")}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    imageMethod === "file"
                      ? "bg-amber-100 text-amber-800 border border-amber-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload File</span>
                </button>
              </div>

              {imageMethod === "url" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    URL hình ảnh
                  </label>
                  <Input
                    value={formData.imageUrl || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        imageUrl: e.target.value,
                        imageFile: undefined,
                      })
                    }
                    placeholder="https://example.com/anh_cu.jpg"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Chọn file ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setFormData({
                        ...formData,
                        imageFile: file,
                        imageUrl: undefined,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Thông số kỹ thuật */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông số kỹ thuật
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Xuất xứ
                  </label>
                  <Input
                    value={formData.specifications.xuatXu || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          xuatXu: e.target.value,
                        },
                      })
                    }
                    placeholder="Việt Nam"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bảo quản
                  </label>
                  <Input
                    value={formData.specifications.baoQuan || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          baoQuan: e.target.value,
                        },
                      })
                    }
                    placeholder="Nơi khô ráo, thoáng mát"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Hạn sử dụng
                  </label>
                  <Input
                    value={formData.specifications.hanSuDung || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specifications: {
                          ...formData.specifications,
                          hanSuDung: e.target.value,
                        },
                      })
                    }
                    placeholder="3-5 ngày"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                className="bg-[#C99F4D] hover:bg-[#B8904A] flex-1"
              >
                {product ? "Cập Nhật" : "Thêm Mới"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopDashboard;
