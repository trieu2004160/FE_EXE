import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  apiService,
  ChangePasswordRequest,
  DeleteAccountRequest,
  type UserProfile,
} from "@/services/apiService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { normalizeImageUrl } from "@/utils/imageUtils";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const mustChangePassword = localStorage.getItem("mustChangePassword") === "true";
  const userRole = (localStorage.getItem("userRole") || "user").toLowerCase();
  const isShop = userRole === "shop";

  // Personal profile (AppUser) - shown for non-shop accounts
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileForm, setProfileForm] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    introduction: string;
    avatarFile?: File;
  }>({
    fullName: "",
    email: "",
    phoneNumber: "",
    introduction: "",
    avatarFile: undefined,
  });
  const [profileAvatarPreviewUrl, setProfileAvatarPreviewUrl] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password change state
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

  // Account deletion state
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isShop) return;

    const load = async () => {
      try {
        const me = await apiService.getProfile();
        setProfile(me);
        setProfileForm({
          fullName: me.fullName || "",
          email: me.email || "",
          phoneNumber: me.phoneNumber || "",
          introduction: me.introduction || "",
          avatarFile: undefined,
        });
      } catch (e) {
        console.error("Failed to load profile:", e);
      }
    };

    load();
  }, [isShop]);

  useEffect(() => {
    if (!profileForm.avatarFile) {
      setProfileAvatarPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(profileForm.avatarFile);
    setProfileAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profileForm.avatarFile]);

  const handleSaveProfile = async () => {
    if (isShop) {
      navigate("/shop-dashboard?tab=settings", { replace: true });
      return;
    }

    const fullName = (profileForm.fullName || "").trim();
    if (!fullName) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập họ tên.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      await apiService.updateProfile({
        fullName,
        phoneNumber: profileForm.phoneNumber?.trim() || undefined,
        introduction: profileForm.introduction?.trim() || undefined,
        avatarFile: profileForm.avatarFile,
      });

      const refreshed = await apiService.getProfile();
      setProfile(refreshed);
      setProfileForm((prev) => ({
        ...prev,
        email: refreshed.email || prev.email,
        avatarFile: undefined,
      }));
      setProfileAvatarPreviewUrl(null);

      toast({
        title: "Thành công",
        description: "Cập nhật thông tin cá nhân thành công.",
      });
    } catch (e) {
      console.error("Error saving profile:", e);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin cá nhân. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = (
    field: keyof typeof passwordData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return null;
  };

  const handleChangePassword = async () => {
    // Validation
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
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
        title: "Thành công!",
        description: "Mật khẩu đã được thay đổi thành công",
      });

      // Reset form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // If this was a forced change, route user back to their role home
      if (mustChangePassword) {
        const role = (localStorage.getItem("userRole") || "user").toLowerCase();
        if (role === "admin") navigate("/admin", { replace: true });
        else if (role === "shop") navigate("/shop-dashboard", { replace: true });
        else navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error changing password:", error);
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

    setIsDeletingAccount(true);

    try {
      const request: DeleteAccountRequest = {
        password: deletePassword,
      };

      await apiService.deleteAccount(request);

      toast({
        title: "Tài khoản đã được xóa",
        description: "Tài khoản của bạn đã được xóa thành công",
      });

      // Clear all data and redirect to home
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cài Đặt Tài Khoản
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quản lý bảo mật và cài đặt tài khoản của bạn
          </p>
        </div>
      </section>

      {/* Settings Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {mustChangePassword && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Đây là lần đăng nhập đầu tiên với mật khẩu khởi tạo. Vui lòng đổi mật khẩu để tiếp tục.
                </AlertDescription>
              </Alert>
            )}

            {isShop ? (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-start justify-between gap-4">
                  <span>
                    Tài khoản Shop không dùng trang Profile riêng. Vui lòng quản lý thông tin cá nhân trong
                    phần <strong>Cài đặt Shop</strong>.
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/shop-dashboard?tab=settings")}
                  >
                    Đi tới Cài đặt Shop
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông Tin Cá Nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label>Ảnh đại diện</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            avatarFile: e.target.files?.[0],
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Xem trước</Label>
                      <div className="rounded-lg border bg-white p-3 flex items-center justify-center min-h-32">
                        {profileAvatarPreviewUrl ? (
                          <img
                            src={profileAvatarPreviewUrl}
                            alt="avatar preview"
                            className="max-h-28 rounded-md object-contain"
                          />
                        ) : profile?.avatarUrl ? (
                          <img
                            src={normalizeImageUrl(profile.avatarUrl)}
                            alt="avatar"
                            className="max-h-28 rounded-md object-contain"
                          />
                        ) : (
                          <div className="text-sm text-gray-500">Chưa có ảnh</div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        value={profileForm.fullName}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profileForm.email} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Số điện thoại</Label>
                      <Input
                        id="phoneNumber"
                        value={profileForm.phoneNumber}
                        onChange={(e) =>
                          setProfileForm((p) => ({
                            ...p,
                            phoneNumber: e.target.value,
                          }))
                        }
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="introduction">Giới thiệu</Label>
                    <Textarea
                      id="introduction"
                      value={profileForm.introduction}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          introduction: e.target.value,
                        }))
                      }
                      placeholder="Giới thiệu ngắn về bạn"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button type="button" onClick={handleSaveProfile} disabled={isSavingProfile}>
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Change Password Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Thay Đổi Mật Khẩu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showPasswords.old ? "text" : "password"}
                        value={passwordData.oldPassword}
                        onChange={(e) =>
                          handlePasswordChange("oldPassword", e.target.value)
                        }
                        placeholder="Nhập mật khẩu hiện tại"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("old")}
                      >
                        {showPasswords.old ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        placeholder="Nhập mật khẩu mới"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPasswords.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordData.newPassword &&
                      validatePassword(passwordData.newPassword) && (
                        <p className="text-sm text-red-500 mt-1">
                          {validatePassword(passwordData.newPassword)}
                        </p>
                      )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Xác nhận mật khẩu mới
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        placeholder="Nhập lại mật khẩu mới"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPasswords.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordData.confirmPassword &&
                      passwordData.newPassword !==
                        passwordData.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">
                          Mật khẩu không khớp
                        </p>
                      )}
                  </div>
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={
                    isChangingPassword ||
                    !passwordData.oldPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                  className="w-full"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang thay đổi...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Thay Đổi Mật Khẩu
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Delete Account Card */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Xóa Tài Khoản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác.
                    Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                  </AlertDescription>
                </Alert>

                {!showDeleteConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa Tài Khoản
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="deletePassword">
                        Nhập mật khẩu để xác nhận
                      </Label>
                      <div className="relative">
                        <Input
                          id="deletePassword"
                          type={showDeletePassword ? "text" : "password"}
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Nhập mật khẩu của bạn"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowDeletePassword(!showDeletePassword)
                          }
                        >
                          {showDeletePassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount || !deletePassword}
                        className="flex-1"
                      >
                        {isDeletingAccount ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Đang xóa...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xác Nhận Xóa
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeletePassword("");
                        }}
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="h-5 w-5" />
                  Mẹo Bảo Mật
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Sử dụng mật khẩu mạnh với ít nhất 8 ký tự</li>
                  <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                  <li>• Không sử dụng thông tin cá nhân trong mật khẩu</li>
                  <li>• Thay đổi mật khẩu định kỳ</li>
                  <li>• Không chia sẻ mật khẩu với người khác</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Settings;

