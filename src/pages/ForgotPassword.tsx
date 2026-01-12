import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService } from "@/services/apiService";

type Step = "request" | "reset";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccessful, setResetSuccessful] = useState(false);

  useEffect(() => {
    if (!resetSuccessful) return;
    const timeoutId = window.setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1200);
    return () => window.clearTimeout(timeoutId);
  }, [navigate, resetSuccessful]);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Vui lòng nhập email.");
      return;
    }

    setLoading(true);
    try {
      await apiService.forgotPassword({ email: trimmedEmail });
      setMessage("Nếu email tồn tại, OTP đã được gửi. Vui lòng kiểm tra hộp thư.");
      setStep("reset");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp) {
      setError("Vui lòng nhập email và OTP.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      await apiService.resetPassword({
        email: trimmedEmail,
        otp: trimmedOtp,
        newPassword,
      });
      setMessage("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập.");
      setResetSuccessful(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Quên mật khẩu</h1>
        <p className="text-sm text-gray-300 mb-6">
          {step === "request"
            ? "Nhập email để nhận OTP đặt lại mật khẩu."
            : "Nhập OTP và mật khẩu mới."}
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {step === "request" ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-black text-white border-gray-700"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C99F4D] hover:bg-[#B8904A]"
            >
              {loading ? "Đang gửi..." : "Gửi OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-black text-white border-gray-700"
              disabled={resetSuccessful}
            />
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="bg-black text-white border-gray-700"
              disabled={resetSuccessful}
            />
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              className="bg-black text-white border-gray-700"
              disabled={resetSuccessful}
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              className="bg-black text-white border-gray-700"
              disabled={resetSuccessful}
            />
            <Button
              type="submit"
              disabled={loading || resetSuccessful}
              className="w-full bg-[#C99F4D] hover:bg-[#B8904A]"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={loading || resetSuccessful}
              onClick={() => setStep("request")}
              className="w-full"
            >
              Quay lại gửi OTP
            </Button>
          </form>
        )}

        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="text-[#C99F4D] underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
