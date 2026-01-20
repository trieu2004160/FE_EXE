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
  Lock,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  apiService,
  UserProfile,
  authUtils,
  type ChangePasswordRequest,
} from "@/services/apiService";
import { normalizeImageUrl } from "@/utils/imageUtils";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mustChangePassword = localStorage.getItem("mustChangePassword") === "true";

  const [mainTab, setMainTab] = useState<"info" | "settings">("info");
  const [settingsTab, setSettingsTab] = useState<
    "notifications" | "security" | "danger"
  >(mustChangePassword ? "security" : "notifications");
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
  const [originalAvatarPreview, setOriginalAvatarPreview] =
    useState<string>("");

  // Notification settings (stored locally)
  const [notifyOrderEmail, setNotifyOrderEmail] = useState(true);
  const [notifyPromotions, setNotifyPromotions] = useState(true);
  const [notifyNewProducts, setNotifyNewProducts] = useState(false);

  // Security (change password)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Danger (delete account)
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Guard: this page is for regular users only
  useEffect(() => {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role === "shop") {
      navigate("/shop-dashboard?tab=settings", { replace: true });
      return;
    }
    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
  }, [navigate]);

  // If redirected here for forced password change, open Security
  useEffect(() => {
    const state = location.state as any;
    if (mustChangePassword || state?.forcePasswordChange) {
      setMainTab("settings");
      setSettingsTab("security");
    }
  }, [location.state, mustChangePassword]);

  // Load notification settings from localStorage
  useEffect(() => {
    const getBool = (key: string, fallback: boolean) => {
      const v = localStorage.getItem(key);
      if (v === null) return fallback;
      return v === "true";
    };
    setNotifyOrderEmail(getBool("notifyOrderEmail", true));
    setNotifyPromotions(getBool("notifyPromotions", true));
    setNotifyNewProducts(getBool("notifyNewProducts", false));
  }, []);

  useEffect(() => {
    localStorage.setItem("notifyOrderEmail", String(notifyOrderEmail));
  }, [notifyOrderEmail]);
  useEffect(() => {
    localStorage.setItem("notifyPromotions", String(notifyPromotions));
  }, [notifyPromotions]);
  useEffect(() => {
    localStorage.setItem("notifyNewProducts", String(notifyNewProducts));
  }, [notifyNewProducts]);

  // Load user data from API
  useEffect(() => {
    const loadUserProfile = async () => {
      const userToken = localStorage.getItem("userToken");

      const role = (localStorage.getItem("userRole") || "").toLowerCase();
      if (role === "shop") {
        navigate("/shop-dashboard?tab=settings", { replace: true });
        return;
      }
      if (role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

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
      if (!file.type.startsWith("image/")) {
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
      if (!userInfo.fullName || userInfo.fullName.trim() === "") {
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
      if (phoneNumber && phoneNumber !== "") {
        updateData.phoneNumber = phoneNumber;
      }

      // Chỉ thêm introduction nếu có giá trị
      const introduction = userInfo.introduction?.trim();
      if (introduction && introduction !== "") {
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
        setAvatarPreview("");
        setOriginalAvatarPreview("");
      }

      // Clear file selection sau khi upload thành công
      setAvatarFile(null);

      // Xóa localStorage preview vì đã lưu vào backend
      localStorage.removeItem("userAvatarPreview");

      toast({
        title: "Cập nhật thành công!",
        description: "Thông tin cá nhân và ảnh đại diện đã được cập nhật.",
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);

      // Hiển thị thông báo lỗi chi tiết hơn
      const errorMessage =
        error?.message ||
        "Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.";

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

  const validatePassword = (password: string) => {
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return null;
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        variant: "destructive",
      });
      return;
    }

    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      toast({
        title: "Lỗi",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const request: ChangePasswordRequest = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      };
      await apiService.changePassword(request);

      if (mustChangePassword) {
        localStorage.removeItem("mustChangePassword");
      }

      toast({
        title: "Thành công",
        description: "Mật khẩu đã được thay đổi thành công",
      });

      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswords({ old: false, new: false, confirm: false });
    } catch (err) {
      console.error("Error changing password:", err);
      toast({
        title: "Lỗi",
        description:
          "Không thể thay đổi mật khẩu. Vui lòng kiểm tra mật khẩu cũ và thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu để xác nhận",
        variant: "destructive",
      });
      return;
    }
    const ok = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác."
    );
    if (!ok) return;

    setIsDeletingAccount(true);
    try {
      await apiService.deleteAccount({ password: deletePassword });

      authUtils.removeToken();
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      localStorage.removeItem("mustChangePassword");

      toast({
        title: "Tài khoản đã được xóa",
        description: "Tài khoản của bạn đã được xóa thành công",
      });
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error deleting account:", err);
      toast({
        title: "Lỗi",
        description:
          "Không thể xóa tài khoản. Vui lòng kiểm tra mật khẩu và thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
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
                      <AvatarImage
                        src={
                          avatarPreview ||
                          normalizeImageUrl(userInfo.avatarUrl) ||
                          ""
                        }
                      />
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
                        onClick={() =>
                          document.getElementById("avatar-upload")?.click()
                        }
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      {userInfo.email}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {userInfo.fullName || ""}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="gap-1">
                        <Mail className="h-3 w-3" />
                        {userInfo.email}
                      </Badge>
                      {userInfo.phoneNumber ? (
                        <Badge variant="secondary" className="gap-1">
                          <Phone className="h-3 w-3" />
                          {userInfo.phoneNumber}
                        </Badge>
                      ) : null}
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
            <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as any)} className="space-y-6">
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
                {mustChangePassword && (
                  <Alert className="border-amber-200 bg-amber-50 mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Đây là lần đăng nhập đầu tiên với mật khẩu khởi tạo. Vui lòng đổi mật khẩu để tiếp tục.
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs value={settingsTab} onValueChange={(v) => setSettingsTab(v as any)} className="space-y-6">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="notifications">Thông báo</TabsTrigger>
                    <TabsTrigger value="security">Bảo mật</TabsTrigger>
                    <TabsTrigger value="danger">Xóa tài khoản</TabsTrigger>
                  </TabsList>

                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle>Cài Đặt Thông Báo</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <label className="flex items-center gap-3">
                          <Checkbox checked={notifyOrderEmail} onCheckedChange={(v) => setNotifyOrderEmail(Boolean(v))} />
                          <span className="text-sm">Nhận thông báo về đơn hàng qua email</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <Checkbox checked={notifyPromotions} onCheckedChange={(v) => setNotifyPromotions(Boolean(v))} />
                          <span className="text-sm">Nhận thông báo khuyến mại</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <Checkbox checked={notifyNewProducts} onCheckedChange={(v) => setNotifyNewProducts(Boolean(v))} />
                          <span className="text-sm">Nhận tin tức sản phẩm mới</span>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Các cài đặt này hiện được lưu trên trình duyệt của bạn.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Thay Đổi Mật Khẩu</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Mật khẩu hiện tại</label>
                          <div className="relative">
                            <Input
                              type={showPasswords.old ? "text" : "password"}
                              value={passwordData.oldPassword}
                              onChange={(e) => setPasswordData((p) => ({ ...p, oldPassword: e.target.value }))}
                              placeholder="Nhập mật khẩu hiện tại"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords((s) => ({ ...s, old: !s.old }))}
                            >
                              {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Mật khẩu mới</label>
                          <div className="relative">
                            <Input
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                              placeholder="Nhập mật khẩu mới"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords((s) => ({ ...s, new: !s.new }))}
                            >
                              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Xác nhận mật khẩu mới</label>
                          <div className="relative">
                            <Input
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                              placeholder="Nhập lại mật khẩu mới"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPasswords((s) => ({ ...s, confirm: !s.confirm }))}
                            >
                              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <Button
                            type="button"
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                            className="bg-[#C99F4D] hover:bg-[#B8904A]"
                          >
                            {isChangingPassword ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang đổi...
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Đổi mật khẩu
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="danger">
                    <Card className="border-red-200">
                      <CardHeader>
                        <CardTitle className="text-red-600">Vùng nguy hiểm</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Xóa tài khoản sẽ xóa vĩnh viễn dữ liệu của bạn và không thể hoàn tác.
                        </p>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Nhập mật khẩu để xác nhận</label>
                          <div className="relative">
                            <Input
                              type={showDeletePassword ? "text" : "password"}
                              value={deletePassword}
                              onChange={(e) => setDeletePassword(e.target.value)}
                              placeholder="Mật khẩu"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowDeletePassword((s) => !s)}
                            >
                              {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount}
                        >
                          {isDeletingAccount ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Đang xóa...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa tài khoản
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
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
