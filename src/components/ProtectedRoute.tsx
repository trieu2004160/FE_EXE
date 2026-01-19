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

  // Enforce first-login password change if flagged
  const mustChangePassword = localStorage.getItem("mustChangePassword") === "true";
  const isOnSettings = location.pathname === "/settings";
  const isOnShopDashboard = location.pathname === "/shop-dashboard";
  if (hasAnyAuth && mustChangePassword) {
    const role = (localStorage.getItem("userRole") || "").toLowerCase();
    if (role === "shop") {
      if (!isOnShopDashboard) {
        return (
          <Navigate
            to="/shop-dashboard?tab=settings"
            replace
            state={{ forcePasswordChange: true }}
          />
        );
      }
    } else if (!isOnSettings) {
      return <Navigate to="/settings" replace state={{ forcePasswordChange: true }} />;
    }
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
