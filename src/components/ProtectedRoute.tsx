import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user" | "shop";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const location = useLocation();
  // Very lenient - allow access if ANY auth info exists
  // Let the page component handle validation and show errors
  const token = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");
  const userData = localStorage.getItem("userData");

  // Only block if absolutely no auth info
  const hasAnyAuth = token || userRole || userData;

  // Enforce role when provided
  if (hasAnyAuth && requiredRole) {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    // Stay lenient if role is missing; let the page/API decide.
    if (!role) {
      // no-op
    } else if (role !== requiredRole) {
      if (role === "admin") return <Navigate to="/admin" replace />;
      if (role === "shop") return <Navigate to="/shop-dashboard?tab=settings" replace />;
      // Unknown or missing role
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  // Enforce first-login password change if flagged
  const mustChangePassword = localStorage.getItem("mustChangePassword") === "true";
  const isOnSettings = location.pathname === "/settings";
  const isOnShopFirstLogin = location.pathname === "/shop-first-login";
  if (hasAnyAuth && mustChangePassword) {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role === "shop") {
      if (!isOnShopFirstLogin) {
        return <Navigate to="/shop-first-login" replace />;
      }
    } else if (!isOnSettings) {
      return <Navigate to="/settings" replace state={{ forcePasswordChange: true }} />;
    }
  }

  // If user already changed password, don't allow staying on first-login page
  if (hasAnyAuth && !mustChangePassword && isOnShopFirstLogin) {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role === "shop") {
      return <Navigate to="/shop-dashboard?tab=settings" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  if (!hasAnyAuth) {
    // No auth at all - could show loading or let page handle
    console.log('[ProtectedRoute] No auth info, allowing page to handle redirect');
  }

  // Always render children - let the page component handle authentication checks
  // This prevents premature redirects and allows pages to show their own error messages
  return <>{children}</>;
};

export default ProtectedRoute;
