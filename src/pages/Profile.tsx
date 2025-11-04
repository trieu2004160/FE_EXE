import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Settings,
  LogOut,
  Edit2,
  Camera,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiService, UserProfile, authUtils } from "@/services/apiService";
import { normalizeImageUrl } from "@/utils/imageUtils";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserProfile>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    introduction: "",
    avatarUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [originalAvatarPreview, setOriginalAvatarPreview] = useState<string>("");

  // Load user data from API
  useEffect(() => {
    const loadUserProfile = async () => {
      const userToken = localStorage.getItem("userToken");

      if (!userToken || userToken === "authenticated") {
        // Redirect to login if no token
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Try to fetch from API first
        const profileData = await apiService.getProfile();
        setUserInfo(profileData);
        
        // Load avatar từ backend (có thể là base64 data URL hoặc URL từ database)
        if (profileData.avatarUrl) {
          // normalizeImageUrl sẽ xử lý:
          // - Base64 data URL (data:image/...) -> trả về trực tiếp
          // - Absolute URL (http://...) -> trả về trực tiếp
          // - Relative path (/images/...) -> xử lý proxy/URL
          const normalizedUrl = normalizeImageUrl(profileData.avatarUrl);
          const avatarUrl = normalizedUrl || profileData.avatarUrl;
          setAvatarPreview(avatarUrl);
          setOriginalAvatarPreview(avatarUrl);
        } else {
          // Clear preview nếu không có avatar
          setAvatarPreview("");
          setOriginalAvatarPreview("");
        }
      } catch (apiError) {
        console.warn("API not available, using fallback data:", apiError);

        // Fallback to localStorage data
        const userData = localStorage.getItem("userData");
        if (userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            setUserInfo({
              fullName: parsedUserData.fullName || parsedUserData.name || "",
              email: parsedUserData.email || "",
              phoneNumber:
                parsedUserData.phoneNumber || parsedUserData.phone || "",
              address: parsedUserData.address || "",
              introduction:
                parsedUserData.introduction || parsedUserData.bio || "",
              avatarUrl: parsedUserData.avatarUrl || "",
            });
            
            // Load avatar từ parsed data (fallback từ localStorage)
            if (parsedUserData.avatarUrl) {
              // Normalize URL để đảm bảo consistency (hỗ trợ base64, URL, relative path)
              const normalizedUrl = normalizeImageUrl(parsedUserData.avatarUrl);
              const avatarUrl = normalizedUrl || parsedUserData.avatarUrl;
              setAvatarPreview(avatarUrl);
              setOriginalAvatarPreview(avatarUrl);
            } else {
              setAvatarPreview("");
              setOriginalAvatarPreview("");
            }
          } catch (error) {
            console.error("Error parsing user data:", error);
            setError("Không thể tải thông tin người dùng");
          }
        } else {
          setError("Không tìm thấy thông tin người dùng");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
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

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn file ảnh hợp lệ.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "Kích thước file không được vượt quá 5MB.",
          variant: "destructive",
        });
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes (CÓ gửi ảnh lên backend để lưu vào database)
  const saveProfile = async () => {
    try {
      // Validate required fields
      if (!userInfo.fullName || userInfo.fullName.trim() === '') {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập họ và tên.",
          variant: "destructive",
        });
        return;
      }

      // Chuẩn bị dữ liệu update - GỬI avatarFile nếu có
      const updateData: {
        fullName: string;
        phoneNumber?: string;
        introduction?: string;
        avatarFile?: File;
      } = {
        fullName: userInfo.fullName.trim(),
      };

      // Chỉ thêm phoneNumber nếu có giá trị
      const phoneNumber = userInfo.phoneNumber?.trim();
      if (phoneNumber && phoneNumber !== '') {
        updateData.phoneNumber = phoneNumber;
      }

      // Chỉ thêm introduction nếu có giá trị
      const introduction = userInfo.introduction?.trim();
      if (introduction && introduction !== '') {
        updateData.introduction = introduction;
      }

      // Gửi avatarFile lên backend nếu có ảnh mới được chọn
      if (avatarFile) {
        updateData.avatarFile = avatarFile;
      }

      // Gửi dữ liệu lên backend (bao gồm ảnh nếu có)
      await apiService.updateProfile(updateData);

      // Reload profile để lấy thông tin mới nhất từ backend (bao gồm avatarUrl mới)
      const updatedProfile = await apiService.getProfile();
      
      // Cập nhật state với dữ liệu từ backend
      setUserInfo(updatedProfile);

      // Cập nhật avatar preview từ backend (có thể là base64 data URL hoặc URL từ database)
      if (updatedProfile.avatarUrl) {
        // normalizeImageUrl xử lý base64 data URL, absolute URL, và relative path
        const normalizedUrl = normalizeImageUrl(updatedProfile.avatarUrl);
        setAvatarPreview(normalizedUrl || updatedProfile.avatarUrl);
        setOriginalAvatarPreview(normalizedUrl || updatedProfile.avatarUrl);
      } else {
        setAvatarPreview('');
        setOriginalAvatarPreview('');
      }

      // Clear file selection sau khi upload thành công
      setAvatarFile(null);

      // Xóa localStorage preview vì đã lưu vào backend
      localStorage.removeItem('userAvatarPreview');

      toast({
        title: "Cập nhật thành công!",
        description: "Thông tin cá nhân và ảnh đại diện đã được cập nhật.",
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      const errorMessage = error?.message || "Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.";
      
      toast({
        title: "Lỗi cập nhật",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

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
        fullName: userInfo.fullName,
        name: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phoneNumber,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
        bio: userInfo.introduction,
        introduction: userInfo.introduction,
        avatar: "",
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
    // Clear all auth data
    authUtils.removeToken();
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");

    // Redirect to home page
    navigate("/");

    // Show success message
    toast({
      title: "Đăng xuất thành công!",
      description: "Hẹn gặp lại bạn.",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin cá nhân...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

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
                      <AvatarImage src={avatarPreview || normalizeImageUrl(userInfo.avatarUrl) || ""} />
                      <AvatarFallback className="bg-[#C99F4D] text-white text-2xl">
                        {getInitials(userInfo.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload">
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={!isEditing}
                      />
                      <Button
                        type="button"
                        size="icon"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-[#C99F4D] hover:bg-[#B8904A] cursor-pointer"
                        disabled={!isEditing}
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {userInfo.fullName}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {userInfo.introduction}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="gap-1">
                        <Mail className="h-3 w-3" />
                        {userInfo.email}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Phone className="h-3 w-3" />
                        {userInfo.phoneNumber}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (isEditing) {
                          saveProfile();
                        } else {
                          // Lưu avatar hiện tại trước khi chỉnh sửa để có thể reset khi hủy
                          setOriginalAvatarPreview(avatarPreview);
                          setIsEditing(true);
                        }
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      {isEditing ? "Lưu" : "Chỉnh sửa"}
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
              <TabsList className="grid grid-cols-2 md:grid-cols-2 w-full">
                <TabsTrigger value="info">
                  <User className="h-4 w-4" />
                  Thông tin
                </TabsTrigger>

                <TabsTrigger value="settings">
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
                          value={userInfo.fullName}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              fullName: e.target.value,
                            })
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
                          disabled={true}
                          className="bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Email không thể thay đổi
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Số điện thoại
                        </label>
                        <Input
                          value={userInfo.phoneNumber || ""}
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              phoneNumber: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Ảnh đại diện
                        </label>
                        <div className="flex items-center gap-4">
                          {avatarPreview && (
                            <img
                              src={avatarPreview}
                              alt="Avatar preview"
                              className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                            />
                          )}
                          {isEditing && (
                            <label htmlFor="avatar-upload-form">
                              <input
                                id="avatar-upload-form"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('avatar-upload-form')?.click()}
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Chọn ảnh
                              </Button>
                            </label>
                          )}
                          {avatarFile && (
                            <span className="text-sm text-gray-600">
                              {avatarFile.name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Định dạng: JPG, PNG (tối đa 5MB)
                        </p>
                        <p className="text-xs text-green-600 mt-1 font-medium">
                          ✓ Ảnh sẽ được lưu vào database (dạng base64 hoặc URL) và hiển thị mỗi khi bạn đăng nhập
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Giới thiệu
                      </label>
                      <Textarea
                        value={userInfo.introduction}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            introduction: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={saveProfile}
                          className="bg-[#C99F4D] hover:bg-[#B8904A]"
                        >
                          Lưu thay đổi
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            // Reset avatar preview về trạng thái ban đầu khi bắt đầu chỉnh sửa
                            setAvatarFile(null);
                            setAvatarPreview(originalAvatarPreview);
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    )}
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
                          onClick={() => navigate("/settings")}
                        >
                          Đổi mật khẩu
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => navigate("/settings")}
                        >
                          Cài đặt bảo mật
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-red-600">
                        Vùng nguy hiểm
                      </h4>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => navigate("/settings")}
                      >
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
