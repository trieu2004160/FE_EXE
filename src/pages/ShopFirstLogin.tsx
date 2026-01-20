import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Eye, EyeOff, Loader2, Lock, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  apiService,
  authUtils,
  DeleteAccountRequest,
  ForceChangePasswordRequest,
} from "@/services/apiService";

const ShopFirstLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const mustChangePassword =
    localStorage.getItem("mustChangePassword") === "true";

  const userRole = useMemo(
    () => (localStorage.getItem("userRole") || "").toLowerCase(),
    []
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const validateNewPassword = (password: string) => {
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
    return null;
  };

  const handleForceChangePassword = async () => {
    if (!mustChangePassword || userRole !== "shop") {
      navigate("/shop-dashboard?tab=settings", { replace: true });
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
        variant: "destructive",
      });
      return;
    }

    const error = validateNewPassword(newPassword);
    if (error) {
      toast({
        title: "Lỗi",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const request: ForceChangePasswordRequest = { newPassword };
      const response = await apiService.forceChangePassword(request);

      if (response?.token) {
        authUtils.setToken(response.token);
      }

      localStorage.removeItem("mustChangePassword");

      toast({
        title: "Thành công",
        description: "Bạn đã đổi mật khẩu thành công. Đang chuyển đến Cài đặt Shop…",
      });

      navigate("/shop-dashboard?tab=settings", { replace: true });
    } catch (e) {
      console.error(e);
      toast({
        title: "Lỗi",
        description: "Không thể đổi mật khẩu. Vui lòng thử lại.",
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
        description: "Vui lòng nhập mật khẩu hiện tại để xác nhận.",
        variant: "destructive",
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      const request: DeleteAccountRequest = { password: deletePassword };
      await apiService.deleteAccount(request);

      toast({
        title: "Đã xóa tài khoản",
        description: "Tài khoản shop đã được xóa thành công.",
      });

      localStorage.clear();
      navigate("/", { replace: true });
    } catch (e) {
      console.error(e);
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Đổi mật khẩu lần đầu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Đây là lần đăng nhập đầu tiên bằng mật khẩu khởi tạo. Bạn cần đổi mật khẩu trước khi
                vào Shop Dashboard.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword((v) => !v)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleForceChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang đổi mật khẩu…
                  </>
                ) : (
                  "Đổi mật khẩu và tiếp tục"
                )}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="text-sm font-medium flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Xóa tài khoản (tùy chọn)
              </div>
              <div className="text-sm text-muted-foreground">
                Nếu bạn không yêu cầu tạo tài khoản này, bạn có thể xóa tài khoản ngay tại đây.
              </div>

              <div>
                <Label htmlFor="deletePassword">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Input
                    id="deletePassword"
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại để xác nhận"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowDeletePassword((v) => !v)}
                  >
                    {showDeletePassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
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
                    Đang xóa…
                  </>
                ) : (
                  "Xóa tài khoản"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopFirstLogin;
