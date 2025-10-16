import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService } from "@/services/apiService";
import { offlineAuthService } from "@/services/offlineAuthService";
import { OfflineStatus } from "@/components/OfflineStatus";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // Validate phone (optional but if provided, must be valid)
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Try backend API registration first
      try {
        await apiService.register({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });

        setSuccessMessage(
          "Đăng ký thành công! Chuyển hướng đến trang đăng nhập..."
        );

        // Clear form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
        });

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      } catch (apiError: unknown) {
        const errorMessage =
          apiError instanceof Error ? apiError.message : "Unknown error";
        console.warn("Backend API not available:", errorMessage);

        // If backend shows email already exists, show the error
        if (
          errorMessage.includes("already exists") ||
          errorMessage.includes("Email already exists")
        ) {
          setErrors({ email: "Email này đã được đăng ký" });
          return;
        }
      }

      // Use enhanced offline registration service
      const offlineResult = await offlineAuthService.registerOffline({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      if (!offlineResult.success) {
        setErrors({ email: offlineResult.message });
        return;
      }

      // Also keep backward compatibility with old localStorage format
      const existingUsers: User[] = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );

      const newUser = {
        id: offlineResult.user?.id || Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: "user",
        createdAt: new Date().toISOString(),
        password: formData.password,
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

      setSuccessMessage(
        "Đăng ký thành công! Chuyển hướng đến trang đăng nhập..."
      );

      // Clear form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-stretch text-white">
      {/* Left side - Background Image */}
      <div
        className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80)",
        }}
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        <div className="w-full px-24 z-10">
          <h1 className="text-5xl font-bold text-left tracking-wide">
            Tham gia cùng chúng tôi
          </h1>
          <p className="text-3xl my-4">
            Tạo tài khoản mới để trải nghiệm mua sắm tại NOVA.
          </p>
        </div>
        <div className="bottom-0 absolute p-4 text-center right-0 left-0 flex justify-center space-x-4">
          <span className="hover:scale-110 transition-transform cursor-pointer">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </span>
          <span className="hover:scale-110 transition-transform cursor-pointer">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </span>
          <span className="hover:scale-110 transition-transform cursor-pointer">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style={{ backgroundColor: "#161616" }}
      >
        <div
          className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1577495508048-b635879837f1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80)",
          }}
        >
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>
        <div className="w-full py-6 z-20">
          <h1 className="my-6 text-2xl md:text-4xl font-bold">
            Đăng ký tài khoản
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            Tạo tài khoản mới để mua sắm tại NOVA
          </p>

          {/* Offline Status */}
          <OfflineStatus />

          {successMessage && (
            <Alert className="border-green-200 bg-green-50 mb-4 text-left max-w-md mx-auto">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {errors.general && (
            <Alert
              variant="destructive"
              className="mb-4 text-left max-w-md mx-auto"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
          >
            <div className="pb-2 pt-4">
              <Input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Họ và tên *"
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full p-4 text-lg rounded-sm bg-black text-white border-gray-600 focus:border-[#C99F4D]"
                required
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="pb-2 pt-4">
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full p-4 text-lg rounded-sm bg-black text-white border-gray-600 focus:border-[#C99F4D]"
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="pb-2 pt-4">
              <Input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleInputChange}
                className="block w-full p-4 text-lg rounded-sm bg-black text-white border-gray-600 focus:border-[#C99F4D]"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="pb-2 pt-4">
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Mật khẩu *"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full p-4 text-lg rounded-sm bg-black text-white border-gray-600 focus:border-[#C99F4D]"
                required
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="pb-2 pt-4">
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Xác nhận mật khẩu *"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full p-4 text-lg rounded-sm bg-black text-white border-gray-600 focus:border-[#C99F4D]"
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 text-left">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="px-4 pb-2 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="uppercase w-full p-4 text-lg rounded-full bg-[#C99F4D] hover:bg-[#B8904A] focus:outline-none transition-colors flex items-center justify-center"
              >
                {isLoading ? "Đang đăng ký..." : "ĐĂNG KÝ"}
              </Button>
            </div>

            {/* Login Link */}
            <div className="text-center mt-4 px-4">
              <p className="text-gray-400 text-sm">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-[#C99F4D] hover:text-[#B8904A] font-medium underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            {/* Mobile Social Icons */}
            <div className="p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden">
              <a
                href="#"
                className="hover:scale-110 transition-transform"
                title="Twitter"
              >
                <svg
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:scale-110 transition-transform"
                title="Facebook"
              >
                <svg
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a
                href="#"
                className="hover:scale-110 transition-transform"
                title="Instagram"
              >
                <svg
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
