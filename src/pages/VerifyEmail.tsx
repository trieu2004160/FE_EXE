import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService } from "@/services/apiService";

function useQueryParam(name: string): string {
  const { search } = useLocation();
  return useMemo(() => {
    const params = new URLSearchParams(search);
    return (params.get(name) || "").trim();
  }, [name, search]);
}

const VerifyEmail = () => {
  const navigate = useNavigate();
  const emailFromQuery = useQueryParam("email");

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();
    if (!trimmedEmail || !trimmedOtp) {
      setError("Vui lòng nhập email và OTP.");
      return;
    }

    setLoading(true);
    try {
      await apiService.verifyEmail({ email: trimmedEmail, otp: trimmedOtp });
      setMessage("Xác minh email thành công! Bạn có thể đăng nhập.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Có lỗi xảy ra";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Vui lòng nhập email.");
      return;
    }

    setLoading(true);
    try {
      await apiService.resendVerificationOtp({ email: trimmedEmail });
      setMessage("Đã gửi lại OTP (nếu email tồn tại). Vui lòng kiểm tra hộp thư.");
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
        <h1 className="text-2xl font-semibold mb-2">Xác minh email</h1>
        <p className="text-sm text-gray-300 mb-6">
          Nhập OTP đã được gửi đến email của bạn (hiệu lực 15 phút), nếu không nhận được mail vui lòng kiểm tra thư rác.
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

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-black text-white border-gray-700"
            />
          </div>
          <div>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="bg-black text-white border-gray-700"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C99F4D] hover:bg-[#B8904A]"
          >
            {loading ? "Đang xử lý..." : "Xác minh"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={loading}
            onClick={handleResend}
            className="w-full"
          >
            Gửi lại OTP
          </Button>
        </form>

        <div className="text-center mt-4 text-sm">
          <Link to="/login" className="text-[#C99F4D] underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
