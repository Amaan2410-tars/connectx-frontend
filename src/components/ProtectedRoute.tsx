import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student" | "college_admin" | "super_admin")[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "student") {
      return <Navigate to="/" replace />;
    } else if (user.role === "college_admin") {
      return <Navigate to="/college/dashboard" replace />;
    } else if (user.role === "super_admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

