import { api } from "@/lib/apiClient";

export interface UpdateUserData {
  name?: string;
  batch?: string;
  avatar?: string;
  banner?: string;
}

// GET /users/:id
export const getUserById = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// PUT /users/update
export const updateUser = async (data: UpdateUserData) => {
  const response = await api.put("/users/update", data);
  return response.data;
};

// Note: Using student profile endpoints
export const getProfile = async () => {
  const response = await api.get("/student/profile");
  return response.data;
};

export const updateProfile = async (data: UpdateUserData) => {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.batch) formData.append("batch", data.batch);
  if (data.avatar && typeof data.avatar === "string") {
    formData.append("avatar", data.avatar);
  }
  if (data.banner && typeof data.banner === "string") {
    formData.append("banner", data.banner);
  }
  
  const response = await api.put("/student/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

