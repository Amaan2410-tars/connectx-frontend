import { api } from "@/lib/apiClient";

export interface Club {
  id: string;
  name: string;
  description?: string;
  collegeId: string;
  adminId?: string;
  createdAt: string;
  college?: {
    id: string;
    name: string;
  };
  _count?: {
    members: number;
  };
}

// GET /clubs
export const getClubs = async (): Promise<{ success: boolean; data: Club[] }> => {
  const response = await api.get("/student/clubs");
  return response.data;
};

// GET /clubs/:id
export const getClubById = async (id: string) => {
  const response = await api.get(`/student/clubs/${id}`);
  return response.data;
};

// POST /clubs/join
export const joinClub = async (clubId: string) => {
  const response = await api.post(`/student/clubs/${clubId}/join`);
  return response.data;
};

// DELETE /clubs/:id/leave
export const leaveClub = async (clubId: string) => {
  const response = await api.delete(`/student/clubs/${clubId}/leave`);
  return response.data;
};

