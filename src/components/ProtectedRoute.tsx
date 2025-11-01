import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin" | "user" | "shop";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
      navigate("/login");
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Redirect based on user role
      if (userRole === "admin") {
        navigate("/");
      } else if (userRole === "shop") {
        navigate("/shop-dashboard");
      } else if (userRole === "user") {
        navigate("/profile");
      } else {
        navigate("/login");
      }
    }
  }, [navigate, requiredRole]);

  const token = localStorage.getItem("userToken");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return null; // or loading spinner
  }

  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
