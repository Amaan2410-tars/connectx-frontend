import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import CollegeAdmin from "./pages/CollegeAdmin";
import SuperAdmin from "./pages/SuperAdmin";
import { VerificationFlow } from "./components/screens/VerificationFlow";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";
import Refunds from "./pages/Refunds";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} 
      />
      
      {/* Public legal pages */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/refunds" element={<Refunds />} />
      
      {/* Protected routes - Student */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verify"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <VerificationFlow />
          </ProtectedRoute>
        }
      />
      
      {/* Protected routes - College Admin */}
      <Route
        path="/college"
        element={
          <ProtectedRoute allowedRoles={["college_admin"]}>
            <CollegeAdmin />
          </ProtectedRoute>
        }
      />
      
      {/* Protected routes - Super Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["super_admin"]}>
            <SuperAdmin />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
