import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Users,
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
}

interface ProductFormData {
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  inStock: boolean;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");
    if (!token || userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Sample data
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "Hoa Hồng Đỏ",
        category: "Hoa Tươi",
        price: 150000,
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd",
        description: "Hoa hồng đỏ tươi, biểu tượng của tình yêu",
        inStock: true,
      },
      {
        id: 2,
        name: "Xôi Nước Cốt Dừa",
        category: "Xôi Chè",
        price: 50000,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b",
        description: "Xôi nước cốt dừa thơm béo, vị ngọt đậm đà",
        inStock: true,
      },
      {
        id: 3,
        name: "Combo Tốt Nghiệp Cơ Bản",
        category: "Combo",
        price: 300000,
        image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
        description: "Gói cơ bản với hoa tươi, hương nến và bánh kẹo",
        inStock: true,
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

  const stats = [
    {
      title: "Tổng Sản Phẩm",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Đang Bán",
      value: products.filter((p) => p.inStock).length,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Hết Hàng",
      value: products.filter((p) => !p.inStock).length,
      icon: Heart,
      color: "bg-red-500",
    },
    {
      title: "Danh Mục",
      value: [...new Set(products.map((p) => p.category))].length,
      icon: Star,
      color: "bg-amber-500",
    },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Quản Lý Sản Phẩm", icon: Package },
    { id: "orders", label: "Đơn Hàng", icon: FileText },
    { id: "users", label: "Người Dùng", icon: Users },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-[#C99F4D]">Admin Panel</h1>
          <Badge className="mt-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800">
            Quản Trị Viên
          </Badge>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-amber-50 transition-colors ${
                  activeTab === item.id
                    ? "bg-amber-50 border-r-4 border-amber-500 text-amber-700"
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
            Quản lý và điều chỉnh toàn bộ hệ thống
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
                    <span className="text-sm text-gray-500">2 phút trước</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span>Đơn hàng mới #1234 được tạo</span>
                    </div>
                    <span className="text-sm text-gray-500">15 phút trước</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span>Admin đã đăng nhập vào hệ thống</span>
                    </div>
                    <span className="text-sm text-gray-500">30 phút trước</span>
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
                                src={product.image}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover mr-3"
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">{product.category}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.price.toLocaleString("vi-VN")}đ
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              className={
                                product.inStock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {product.inStock ? "Còn hàng" : "Hết hàng"}
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
                                onClick={() => handleDeleteProduct(product.id)}
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
        {["orders", "users", "settings"].includes(activeTab) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "orders" && "Quản Lý Đơn Hàng"}
                {activeTab === "users" && "Quản Lý Người Dùng"}
                {activeTab === "settings" && "Cài Đặt Hệ Thống"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Package className="h-16 w-16 mx-auto" />
                </div>
                <p className="text-gray-500">
                  Tính năng này đang được phát triển...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
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
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    image: product?.image || "",
    description: product?.description || "",
    inStock: product?.inStock ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const categories = ["Hoa Tươi", "Hương Nến", "Xôi Chè", "Bánh Kẹo", "Combo"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            {product ? "Chỉnh Sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên sản phẩm
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Danh mục
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  title="Chọn danh mục sản phẩm"
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Giá (VNĐ)
                </label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Trạng thái
                </label>
                <select
                  value={formData.inStock.toString()}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      inStock: e.target.value === "true",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  title="Chọn trạng thái sản phẩm"
                >
                  <option value="true">Còn hàng</option>
                  <option value="false">Hết hàng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                URL hình ảnh
              </label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mô tả</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
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

export default AdminDashboard;
