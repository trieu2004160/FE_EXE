import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWishlist } from "@/contexts/WishlistContext";

import logoIcon from "@/assets/z7048679417409_951f2312b6a4acf2cd06da22ec333170-removebg-preview.png";

const Header = () => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");

    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const handleUserAction = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100/80 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </Button>
            <Link to="/" className="flex items-center -space-x-5 space-y-2">
              <img src={logoIcon} alt="Logo" className="w-28 h-24" />
              <span className="text-xl lg:text-2xl font-bold text-[#C99F4D]">
                NOVA
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="flex items-center bg-gray-50/80 rounded-full px-2 py-1 space-x-1">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Sản phẩm
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Về chúng tôi
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Liên hệ
              </Link>
            </div>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="hidden sm:flex relative">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pr-10 w-56 lg:w-64 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-amber-300 transition-all duration-200"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-amber-100"
              >
                <Search className="h-4 w-4 text-gray-500" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 hover:bg-red-50 hover:scale-105 transition-all duration-200 group"
                onClick={() => navigate("/wishlist")}
              >
                <Heart className="h-5 w-5 text-gray-600 group-hover:text-red-500" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 hover:bg-amber-50 hover:scale-105 transition-all duration-200 group"
                onClick={() => navigate("/cart")}
              >
                <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:text-amber-600" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  3
                </span>
              </Button>

              {/* User/Login Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-blue-50 hover:scale-105 transition-all duration-200 group"
                onClick={handleUserAction}
                title={
                  isLoggedIn
                    ? userRole === "admin"
                      ? "Admin Panel"
                      : "Trang cá nhân"
                    : "Đăng nhập"
                }
              >
                {isLoggedIn ? (
                  userRole === "admin" ? (
                    <Settings className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                  )
                ) : (
                  <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                )}
              </Button>

              {/* Logout Button - Only show when logged in */}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-red-50 hover:scale-105 transition-all duration-200 group"
                  onClick={handleLogout}
                  title="Đăng xuất"
                >
                  <LogOut className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
                </Button>
              )}
            </div>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden h-10 w-10 hover:bg-gray-100"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
