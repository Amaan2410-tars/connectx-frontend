import { api } from "@/lib/apiClient";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  collegeId: string;
  createdBy: string;
  createdAt: string;
}

// GET /student/announcements - Get college announcements for students
export const getAnnouncements = async (): Promise<{ success: boolean; data: Announcement[] }> => {
  try {
    const response = await api.get("/student/announcements");
    return {
      success: response.data?.success !== false,
      data: Array.isArray(response.data?.data) ? response.data.data : [],
    };
  } catch (error: any) {
    console.error("Error fetching announcements:", error);
    return {
      success: false,
      data: [],
    };
  }
};

