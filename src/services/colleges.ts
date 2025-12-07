import { api } from "@/lib/apiClient";

export interface College {
  id: string;
  name: string;
  slug: string;
}

// GET /auth/colleges - Public endpoint for signup
export const getCollegesForSignup = async (): Promise<{ success: boolean; data: College[] }> => {
  try {
    const response = await api.get("/auth/colleges");
    return {
      success: response.data?.success !== false,
      data: Array.isArray(response.data?.data) ? response.data.data : [],
    };
  } catch (error: any) {
    console.error("Error fetching colleges:", error);
    return {
      success: false,
      data: [],
    };
  }
};


