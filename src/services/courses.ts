import { api } from "@/lib/apiClient";

export interface Course {
  id: string;
  name: string;
  code?: string;
}

// GET /auth/colleges/:collegeId/courses - Public endpoint to get courses by college
export const getCoursesByCollege = async (collegeId: string): Promise<{ success: boolean; data: Course[] }> => {
  try {
    const response = await api.get(`/auth/colleges/${collegeId}/courses`);
    return {
      success: response.data?.success !== false,
      data: Array.isArray(response.data?.data) ? response.data.data : [],
    };
  } catch (error: any) {
    console.error("Error fetching courses:", error);
    return {
      success: false,
      data: [],
    };
  }
};

