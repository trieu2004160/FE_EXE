import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Package,
  Settings,
  Heart,
  LogOut,
  Edit2,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    bio: "",
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const userToken = localStorage.getItem("userToken");

    if (!userToken) {
      // Redirect to login if no token
      navigate("/login");
      return;
    }

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUserInfo({
          name:
            parsedUserData.fullName || parsedUserData.name || "Chưa cập nhật",
          email: parsedUserData.email || "Chưa cập nhật",
          phone:
            parsedUserData.phone ||
            parsedUserData.phoneNumber ||
            "Chưa cập nhật",
          address: parsedUserData.address || "Chưa cập nhật",
          avatar: parsedUserData.avatar || "",
          bio:
            parsedUserData.bio ||
            parsedUserData.introduction ||
            "Chưa có thông tin giới thiệu",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Use default empty values if parsing fails
      }
    }
  }, [navigate]);

  // Get user initials from name
  const getInitials = (name: string) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Mock data for orders
  const orders = [
    {
      id: "DH001",
      date: "2024-03-15",
      status: "Đã giao",
      total: 850000,
      items: 3,
    },
    {
      id: "DH002",
      date: "2024-03-10",
      status: "Đang xử lý",
      total: 1200000,
      items: 5,
    },
    {
      id: "DH003",
      date: "2024-03-05",
      status: "Đã hủy",
      total: 450000,
      items: 2,
    },
  ];

  const handleSaveProfile = () => {
    try {
      // Update localStorage with new user data
      const currentUserData = localStorage.getItem("userData");
      let updatedUserData = {};

      if (currentUserData) {
        updatedUserData = JSON.parse(currentUserData);
      }

      // Update the user data with new information
      updatedUserData = {
        ...updatedUserData,
        fullName: userInfo.name,
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        phoneNumber: userInfo.phone,
        address: userInfo.address,
        bio: userInfo.bio,
        introduction: userInfo.bio,
        avatar: userInfo.avatar,
      };

      // Save back to localStorage
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setIsEditing(false);
      toast({
        title: "Cập nhật thành công!",
        description: "Thông tin cá nhân đã được lưu.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Lỗi!",
        description: "Không thể lưu thông tin. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    navigate("/");
    toast({
      title: "Đăng xuất thành công!",
      description: "Hẹn gặp lại bạn.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-500";
      case "Đang xử lý":
        return "bg-blue-500";
      case "Đã hủy":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Trang Cá Nhân
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quản lý thông tin cá nhân và theo dõi đơn hàng
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Profile Header */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={userInfo.avatar} />
                      <AvatarFallback className="bg-[#C99F4D] text-white text-2xl">
                        {getInitials(userInfo.name)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#C99F4D] hover:bg-[#B8904A]"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {userInfo.name}
                    </h2>
                    <p className="text-muted-foreground mb-4">{userInfo.bio}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="gap-1">
                        <Mail className="h-3 w-3" />
                        {userInfo.email}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Phone className="h-3 w-3" />
                        {userInfo.phone}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      {isEditing ? "Hủy" : "Chỉnh sửa"}
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info" className="gap-2">
                  <User className="h-4 w-4" />
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Package className="h-4 w-4" />
                  Đơn hàng
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Yêu thích
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Cài đặt
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông Tin Cá Nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Họ và tên
                        </label>
                        <Input
                          value={userInfo.name}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, name: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email
                        </label>
                        <Input
                          value={userInfo.email}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, email: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Số điện thoại
                        </label>
                        <Input
                          value={userInfo.phone}
                          onChange={(e) =>
                            setUserInfo({ ...userInfo, phone: e.target.value })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Địa chỉ
                        </label>
                        <Input
                          value={userInfo.address}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              address: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Giới thiệu
                      </label>
                      <Textarea
                        value={userInfo.bio}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, bio: e.target.value })
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-[#C99F4D] hover:bg-[#B8904A]"
                        >
                          Lưu thay đổi
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Hủy
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch Sử Đơn Hàng</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">
                                  Đơn hàng #{order.id}
                                </h3>
                                <Badge
                                  className={`text-white text-xs ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Ngày đặt:{" "}
                                {new Date(order.date).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.items} sản phẩm
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-semibold text-[#C99F4D]">
                                {order.total.toLocaleString("vi-VN")}đ
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                Xem chi tiết
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>Sản Phẩm Yêu Thích</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Xem danh sách yêu thích
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Quản lý các sản phẩm bạn đã lưu
                      </p>
                      <Button asChild>
                        <Link to="/wishlist">
                          <Heart className="h-4 w-4 mr-2" />
                          Đi đến danh sách yêu thích
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Cài Đặt Tài Khoản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Thông báo</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <span className="text-sm">
                            Nhận thông báo về đơn hàng qua email
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <span className="text-sm">
                            Nhận thông báo khuyến mại
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">
                            Nhận tin tức sản phẩm mới
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Bảo mật</h4>
                      <div className="space-y-2">
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
                          Xác thực hai yếu tố
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600">
                        Vùng nguy hiểm
                      </h4>
                      <Button variant="destructive" className="w-full">
                        Xóa tài khoản
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Profile;
