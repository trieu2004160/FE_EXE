import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Heart,
  Star,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Chờ xử lý" | "Đang giao" | "Đã giao" | "Đã hủy";
  items: string[];
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "Người dùng",
    email: "user@nova.com",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    joinDate: "2024-01-15",
  });
  const [editData, setEditData] = useState<UserData>(userData);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");
    if (!token || userRole !== "user") {
      navigate("/login");
    }

    // Load user data from localStorage if available
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData((prev) => ({
        ...prev,
        name: parsedData.name || prev.name,
        email: parsedData.email || prev.email,
      }));
      setEditData((prev) => ({
        ...prev,
        name: parsedData.name || prev.name,
        email: parsedData.email || prev.email,
      }));
    }
  }, [navigate]);

  // Sample orders data
  const orders: Order[] = [
    {
      id: "ORD001",
      date: "2024-10-15",
      total: 450000,
      status: "Đã giao",
      items: ["Hoa Hồng Đỏ", "Bánh Kẹo"],
    },
    {
      id: "ORD002",
      date: "2024-10-10",
      total: 320000,
      status: "Đang giao",
      items: ["Combo Tết", "Trái Cây"],
    },
    {
      id: "ORD003",
      date: "2024-10-05",
      total: 180000,
      status: "Chờ xử lý",
      items: ["Hương Trầm"],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const handleSaveProfile = () => {
    setUserData(editData);
    // Update localStorage
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      const updatedData = { ...parsedData, ...editData };
      localStorage.setItem("userData", JSON.stringify(updatedData));
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-100 text-green-800";
      case "Đang giao":
        return "bg-blue-100 text-blue-800";
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Trang Cá Nhân</h1>
            <p className="text-gray-600 mt-2">
              Quản lý thông tin và đơn hàng của bạn
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#C99F4D] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{userData.name}</h3>
                  <p className="text-gray-600 text-sm">{userData.email}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "profile"
                        ? "bg-[#C99F4D] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "orders"
                        ? "bg-[#C99F4D] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Đơn hàng
                  </button>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "wishlist"
                        ? "bg-[#C99F4D] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                    Yêu thích
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === "settings"
                        ? "bg-[#C99F4D] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    Cài đặt
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Thông tin cá nhân</CardTitle>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="flex items-center gap-2 bg-[#C99F4D] hover:bg-[#B8904A]"
                      >
                        <Save className="h-4 w-4" />
                        Lưu
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          className="focus:border-[#C99F4D]"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-lg">
                          {userData.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="focus:border-[#C99F4D]"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-lg">
                          {userData.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Số điện thoại
                      </label>
                      {isEditing ? (
                        <Input
                          value={editData.phone}
                          onChange={(e) =>
                            setEditData({ ...editData, phone: e.target.value })
                          }
                          className="focus:border-[#C99F4D]"
                        />
                      ) : (
                        <p className="p-3 bg-gray-50 rounded-lg">
                          {userData.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Ngày tham gia
                      </label>
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {new Date(userData.joinDate).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <Input
                        value={editData.address}
                        onChange={(e) =>
                          setEditData({ ...editData, address: e.target.value })
                        }
                        className="focus:border-[#C99F4D]"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {userData.address}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Đơn hàng của tôi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">
                              Đơn hàng #{order.id}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {new Date(order.date).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            Sản phẩm:
                          </p>
                          <p>{order.items.join(", ")}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#C99F4D]">
                            {order.total.toLocaleString("vi-VN")} đ
                          </span>
                          <Button variant="outline" size="sm">
                            Xem chi tiết
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "wishlist" && (
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm yêu thích</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Bạn chưa có sản phẩm yêu thích nào
                    </p>
                    <Button
                      onClick={() => navigate("/products")}
                      className="mt-4 bg-[#C99F4D] hover:bg-[#B8904A]"
                    >
                      Khám phá sản phẩm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tài khoản</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Thông báo</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <span className="text-sm">
                            Nhận thông báo về đơn hàng
                          </span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <span className="text-sm">
                            Nhận thông báo khuyến mãi
                          </span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Nhận newsletter</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Bảo mật</h4>
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          Đổi mật khẩu
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          Xác thực hai bước
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border border-red-200 rounded-lg">
                      <h4 className="font-medium mb-2 text-red-600">
                        Nguy hiểm
                      </h4>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Xóa tài khoản
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
