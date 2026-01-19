import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Heart,
  Search as SearchIcon,
  Menu,
  User,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { apiService } from "@/services/apiService";
import Search from "@/components/Search";

import logoIcon from "@/assets/z7048679417409_951f2312b6a4acf2cd06da22ec333170-removebg-preview.png";

const Header = () => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch cart count from API
  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token || token === "authenticated") {
        setCartItemCount(0);
        return;
      }

      const cart = await apiService.getCart();
      // Calculate total quantity from all shops
      const totalCount = cart.shops.reduce((total, shop) => {
        return total + shop.items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0);
      setCartItemCount(totalCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartItemCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");

    setIsLoggedIn(!!token);
    setUserRole(role);

    // Fetch cart count if logged in
    if (token && token !== "authenticated") {
      fetchCartCount();
    }
  }, []);

  // Listen for cart updates from custom event
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    // Listen for custom event when cart is updated
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Also poll periodically to keep count updated
    const interval = setInterval(() => {
      const token = localStorage.getItem("userToken");
      if (token && token !== "authenticated") {
        fetchCartCount();
      }
    }, 10000); // Poll every 10 seconds

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  // Handle click outside search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserRole(null);
    setCartItemCount(0);
    navigate("/");
  };

  const handleLoginOrLogout = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    handleLogout();
  };

  const handleUserAction = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (userRole === "admin") {
      navigate("/admin");
    } else if (userRole === "shop") {
      navigate("/shop-dashboard?tab=settings");
    } else {
      navigate("/settings");
    }
  };

  const handleShopAction = () => {
    if (isLoggedIn && userRole === "shop") {
      navigate("/shop-dashboard");
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
            {/* Search Button & Dropdown */}
            <div className="relative" ref={searchRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-gray-50 hover:scale-105 transition-all duration-200"
                onClick={() => setShowSearch(!showSearch)}
                title="Tìm kiếm"
              >
                <SearchIcon className="h-5 w-5 text-gray-600" />
              </Button>

              {/* Search Dropdown */}
              {showSearch && (
                <div className="absolute right-0 mt-2 w-96 z-50">
                  <Search onClose={() => setShowSearch(false)} />
                </div>
              )}
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
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              {/* Admin Dashboard Button - Only show when user has admin role */}
              {isLoggedIn && userRole === "admin" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-purple-50 hover:scale-105 transition-all duration-200 group"
                  onClick={() => navigate("/admin")}
                  title="Admin Dashboard"
                >
                  <Settings className="h-5 w-5 text-gray-600 group-hover:text-purple-600" />
                </Button>
              )}

              {/* Shop Button - Only show when user has shop role */}
              {isLoggedIn && userRole === "shop" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-green-50 hover:scale-105 transition-all duration-200 group"
                  onClick={handleShopAction}
                  title="Quản lý cửa hàng"
                >
                  <Store className="h-5 w-5 text-gray-600 group-hover:text-green-600" />
                </Button>
              )}

              {/* User/Login Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 hover:bg-blue-50 hover:scale-105 transition-all duration-200 group"
                onClick={handleUserAction}
                title={
                  isLoggedIn
                    ? userRole === "admin"
                      ? "Thông tin admin"
                      : userRole === "shop"
                      ? "Cài đặt cửa hàng"
                      : "Cài đặt tài khoản"
                    : "Đăng nhập"
                }
              >
                {isLoggedIn ? (
                  userRole === "admin" ? (
                    <User className="h-5 w-5 text-gray-600 " />
                  ) : (
                    <User className="h-5 w-5 text-gray-600 " />
                  )
                ) : (
                  <User className="h-5 w-5 text-gray-600 " />
                )}
              </Button>

              {/* Explicit Login/Logout button */}
              <Button
                variant={isLoggedIn ? "destructive" : "default"}
                className={
                  isLoggedIn
                    ? "h-10 px-4"
                    : "h-10 px-4 bg-[#C99F4D] hover:bg-[#B8904A]"
                }
                onClick={handleLoginOrLogout}
              >
                {isLoggedIn ? "Logout" : "Login"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
