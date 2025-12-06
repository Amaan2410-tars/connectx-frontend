import { api } from "@/lib/apiClient";

export interface UpdateUserData {
  name?: string;
  batch?: string;
  avatar?: File | string;
  banner?: File | string;
}

// Note: Using student profile endpoints
export const getProfile = async () => {
  const response = await api.get("/student/profile");
  return response.data;
};

export const updateProfile = async (data: UpdateUserData) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.batch) formData.append("batch", data.batch);
  
  // Handle avatar - send File if it's a File, otherwise skip (backend will use existing)
  if (data.avatar instanceof File) {
    formData.append("avatar", data.avatar);
  } else if (data.avatar && typeof data.avatar === "string") {
    // If it's a string URL, backend should handle it, but we can skip for now
    // Backend expects file upload or will use existing
  }
  
  // Handle banner - send File if it's a File, otherwise skip
  if (data.banner instanceof File) {
    formData.append("banner", data.banner);
  } else if (data.banner && typeof data.banner === "string") {
    // If it's a string URL, backend should handle it, but we can skip for now
    // Backend expects file upload or will use existing
  }
  
  const response = await api.put("/student/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

