import { api } from "@/lib/apiClient";

export interface CreateCollegeData {
  name: string;
  slug: string;
  logo?: string;
  city?: string;
  website?: string;
}

export interface UpdateCollegeData {
  name?: string;
  slug?: string;
  logo?: string;
  city?: string;
  website?: string;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  city?: string;
  website?: string;
  createdAt: string;
  _count?: {
    users: number;
    clubs: number;
    events: number;
  };
}

export interface CreateCollegeAdminData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  collegeId: string;
}

// POST /admin/colleges/add
export const createCollege = async (data: CreateCollegeData) => {
  const response = await api.post("/admin/colleges", data);
  return response.data;
};

// GET /admin/colleges
export const getColleges = async (): Promise<{ success: boolean; data: College[] }> => {
  const response = await api.get("/admin/colleges");
  return response.data;
};

// GET /admin/colleges/:id
export const getCollegeById = async (id: string) => {
  const response = await api.get(`/admin/colleges/${id}`);
  return response.data;
};

// PUT /admin/colleges/:id
export const updateCollege = async (id: string, data: UpdateCollegeData) => {
  const response = await api.put(`/admin/colleges/${id}`, data);
  return response.data;
};

// DELETE /admin/colleges/:id
export const deleteCollege = async (id: string) => {
  const response = await api.delete(`/admin/colleges/${id}`);
  return response.data;
};

// POST /admin/college-admin/create
export const createCollegeAdmin = async (data: CreateCollegeAdminData) => {
  const response = await api.post("/admin/college-admins", data);
  return response.data;
};

// GET /admin/analytics
export const getAdminAnalytics = async () => {
  const response = await api.get("/admin/analytics");
  return response.data;
};

// DELETE /admin/posts/:id
export const deletePost = async (postId: string) => {
  const response = await api.delete(`/admin/posts/${postId}`);
  return response.data;
};

// DELETE /admin/users/:id
export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

// GET /admin/verifications/pending (All colleges)
export const getAllPendingVerifications = async (): Promise<{ success: boolean; data: any[] }> => {
  const response = await api.get("/admin/verifications/pending");
  return response.data;
};

// PUT /admin/verifications/:id (Approve/Reject)
export const approveVerification = async (verificationId: string) => {
  const response = await api.put(`/admin/verifications/${verificationId}`, {
    status: "approved",
  });
  return response.data;
};

export const rejectVerification = async (verificationId: string) => {
  const response = await api.put(`/admin/verifications/${verificationId}`, {
    status: "rejected",
  });
  return response.data;
};

// POST /admin/verification/bypass
export const bypassVerification = async (userId: string) => {
  const response = await api.post("/admin/verification/bypass", {
    userId,
  });
  return response.data;
};

