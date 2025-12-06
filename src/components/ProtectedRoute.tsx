import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVerificationStatus } from "@/services/verification";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("student" | "college_admin" | "super_admin")[];
  requireVerification?: boolean;
}

export const ProtectedRoute = ({ children, allowedRoles, requireVerification = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Check verification status for students
  const { data: verificationData, isLoading: verificationLoading } = useQuery({
    queryKey: ["verification-status"],
    queryFn: getVerificationStatus,
    enabled: isAuthenticated && user?.role === "student" && requireVerification,
    retry: false,
  });

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setTimeoutReached(true);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (loading || (requireVerification && verificationLoading)) {
    if (timeoutReached) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-muted-foreground">Loading is taking longer than expected.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check verification for students
  if (user?.role === "student" && requireVerification) {
    const userStatus = verificationData?.data?.user;
    const isVerified = 
      userStatus?.emailVerified && 
      userStatus?.phoneVerified && 
      (userStatus?.verifiedStatus === "approved" || userStatus?.bypassVerified);
    
    if (!isVerified) {
      return <Navigate to="/verify" replace />;
    }
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "student") {
      return <Navigate to="/" replace />;
    } else if (user.role === "college_admin") {
      return <Navigate to="/college" replace />;
    } else if (user.role === "super_admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};

