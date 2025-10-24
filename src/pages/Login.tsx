import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { apiService, authUtils } from "@/services/apiService";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check demo admin account first (backward compatibility)
      if (email === "admin@nova.com" && password === "admin123") {
        localStorage.setItem("userToken", "authenticated");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: "admin@nova.com",
            name: "Admin",
            role: "admin",
          })
        );
        navigate("/admin");
        return;
      }

      // Check demo user account (backward compatibility)
      if (email === "user@nova.com" && password === "user123") {
        localStorage.setItem("userToken", "authenticated");
        localStorage.setItem("userRole", "user");
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: "user@nova.com",
            name: "User",
            role: "user",
          })
        );
        navigate("/profile");
        return;
      }

      // Try backend API login first
      try {
        const response = await apiService.login({ email, password });

        if (response.token) {
          // Store JWT token
          authUtils.setToken(response.token);
          localStorage.setItem("userRole", "user");
          localStorage.setItem(
            "userData",
            JSON.stringify({
              email: email,
              name: "User", // We'll get this from JWT or profile API later
              role: "user",
            })
          );

          navigate("/user/profile");
          return;
        }
      } catch (apiError) {
        console.warn(
          "Backend API not available, using offline mode:",
          apiError
        );
      }

      // Use enhanced offline authentication service
      const offlineResult = await offlineAuthService.loginOffline(
        email,
        password
      );

      if (offlineResult.success && offlineResult.user) {
        // Store offline user data
        localStorage.setItem(
          "userToken",
          offlineResult.token || "authenticated"
        );
        localStorage.setItem("userRole", offlineResult.user.role);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: offlineResult.user.email,
            name: offlineResult.user.fullName,
            role: offlineResult.user.role,
            isOffline: true,
          })
        );

        // Navigate based on role
        if (offlineResult.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
        return;
      }

      // Fallback to old localStorage users for backward compatibility
      const registeredUsers: User[] = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
      const user = registeredUsers.find(
        (u: User) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("userToken", "authenticated");
        localStorage.setItem("userRole", user.role);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            email: user.email,
            name: user.fullName,
            role: user.role,
            phone: user.phone,
          })
        );

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user/profile");
        }
      } else {
        setError("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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
            Chào mừng trở lại
          </h1>
          <p className="text-3xl my-4">
            Đăng nhập để truy cập vào hệ thống NOVA của bạn.
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

      {/* Right side - Login Form */}
      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style={{ backgroundColor: "#161616" }}
      >
        {/* Mobile background */}
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
          {/* Logo */}
          <h1 className="my-6">
            <div className="text-4xl font-bold text-[#C99F4D] mb-2">NOVA</div>
            <div className="text-sm text-gray-400">Hệ Thống Quản Lý</div>
          </h1>

          {/* Offline Status */}
          {/* <OfflineStatus /> */}

          {/* Social Login Buttons */}
          <div className="py-6 space-x-2">
            <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-black transition-colors cursor-pointer">
              f
            </span>
            <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-black transition-colors cursor-pointer">
              G+
            </span>
            <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-black transition-colors cursor-pointer">
              in
            </span>
          </div>

          <p className="text-gray-100 mb-6">hoặc sử dụng email của bạn</p>

          {/* Login Form */}
          <form
            onSubmit={handleLogin}
            className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto"
          >
            <div className="pb-2 pt-4">
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full p-4 text-lg rounded-sm bg-black text-white border-gray-600 focus:border-[#C99F4D]"
                required
              />
            </div>

            <div className="pb-2 pt-4 relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full p-4 text-lg rounded-sm bg-black text-white border-gray-600 focus:border-[#C99F4D] pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {error && (
              <div className="text-red-400 text-sm mt-2 mb-4">{error}</div>
            )}

            <div className="text-right text-gray-400 hover:underline hover:text-gray-100 mb-4">
              <a href="#" className="text-sm">
                Quên mật khẩu?
              </a>
            </div>

            <div className="px-4 pb-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="uppercase w-full p-4 text-lg rounded-full bg-[#C99F4D] hover:bg-[#B8904A] focus:outline-none transition-colors flex items-center justify-center"
              >
                {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center mt-4 px-4">
              <p className="text-gray-400 text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-[#C99F4D] hover:text-[#B8904A] font-medium underline"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            {/* <div className="mt-6 p-4 bg-gray-800 rounded-lg text-left">
              <p className="text-sm font-medium text-gray-300 mb-3">
                Tài khoản demo:
              </p>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>
                    <strong>Admin:</strong>
                  </span>
                  <span>admin@nova.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span>
                    <strong>User:</strong>
                  </span>
                  <span>user@nova.com / user123</span>
                </div>
              </div>
            </div> */}

            {/* Mobile Social Icons */}
            <div className="p-4 text-center right-0 left-0 flex justify-center space-x-4 mt-16 lg:hidden">
              <a href="#" className="hover:scale-110 transition-transform">
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
              <a href="#" className="hover:scale-110 transition-transform">
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
              <a href="#" className="hover:scale-110 transition-transform">
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

export default Login;
