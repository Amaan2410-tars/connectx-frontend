import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as loginApi, signup as signupApi, getMe } from "@/services/auth";
import { User } from "@/services/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isStudent: boolean;
  isCollegeAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("accessToken");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
      console.error("Auth check timeout - clearing tokens");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    }, 10000); // 10 second timeout

    try {
      const response = await getMe();
      clearTimeout(timeoutId);
      setUser(response.data);
    } catch (error) {
      clearTimeout(timeoutId);
      // Token might be invalid, clear it
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error: any) {
      console.error("Login error in AuthContext:", error);
      // Re-throw with a clearer message
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message ||
        error.message || 
        "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }
  };

  const signup = async (data: any) => {
    const response = await signupApi(data);
    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isStudent = user?.role === "student";
  const isCollegeAdmin = user?.role === "college_admin";
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated,
        isStudent,
        isCollegeAdmin,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

