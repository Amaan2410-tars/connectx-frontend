import { api } from "@/lib/apiClient";

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  collegeId: string;
  batch: string;
  role?: "super_admin" | "college_admin" | "student";
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "super_admin" | "college_admin" | "student";
  collegeId: string;
  batch: string;
  avatar?: string;
  banner?: string;
  verifiedStatus: "pending" | "approved" | "rejected";
  points: number;
  coins?: number;
  isPremium?: boolean;
}

// POST /auth/signup
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

// POST /auth/login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// GET /auth/me
export const getMe = async (): Promise<{ success: boolean; data: User }> => {
  try {
    const response = await api.get("/auth/me");
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure");
    }
    return {
      success: response.data.success !== false,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("Error fetching user:", error);
    throw error; // Re-throw to let AuthContext handle it
  }
};

