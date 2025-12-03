import { api } from "@/lib/apiClient";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  batch?: string;
  avatar?: string;
  verifiedStatus: "pending" | "approved" | "rejected";
  points: number;
  createdAt: string;
  _count?: {
    posts: number;
    eventsRSVP: number;
    clubs: number;
  };
}

export interface PendingVerification {
  id: string;
  userId: string;
  idCardImage: string;
  faceImage: string;
  status: "pending";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    batch?: string;
    college?: {
      name: string;
    };
  };
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  image?: File | string;
}

export interface CreateClubData {
  name: string;
  description?: string;
  adminId?: string;
}

export interface CreateAnnouncementData {
  title: string;
  message: string;
}

// GET /college/students
export const getStudents = async (): Promise<{ success: boolean; data: Student[] }> => {
  const response = await api.get("/college/students");
  return response.data;
};

// GET /college/students/stats
export const getStudentStats = async () => {
  const response = await api.get("/college/students/stats");
  return response.data;
};

// GET /college/verification/pending
export const getPendingVerifications = async (): Promise<{ success: boolean; data: PendingVerification[] }> => {
  const response = await api.get("/college/verifications/pending");
  return response.data;
};

// POST /college/verification/approve
export const approveVerification = async (verificationId: string) => {
  const response = await api.put(`/college/verifications/${verificationId}`, {
    status: "approved",
  });
  return response.data;
};

// POST /college/verification/reject
export const rejectVerification = async (verificationId: string) => {
  const response = await api.put(`/college/verifications/${verificationId}`, {
    status: "rejected",
  });
  return response.data;
};

// POST /college/events/create
export const createEvent = async (data: CreateEventData) => {
  const formData = new FormData();
  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  formData.append("date", data.date);
  if (data.image instanceof File) {
    formData.append("eventImage", data.image);
  } else if (data.image) {
    formData.append("image", data.image);
  }
  
  const response = await api.post("/college/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// GET /college/events
export const getCollegeEvents = async (): Promise<{ success: boolean; data: any[] }> => {
  const response = await api.get("/college/events");
  return response.data;
};

// POST /college/clubs/create
export const createClub = async (data: CreateClubData) => {
  const response = await api.post("/college/clubs", data);
  return response.data;
};

// GET /college/clubs
export const getCollegeClubs = async (): Promise<{ success: boolean; data: any[] }> => {
  const response = await api.get("/college/clubs");
  return response.data;
};

// GET /college/analytics
export const getCollegeAnalytics = async () => {
  const response = await api.get("/college/analytics");
  return response.data;
};

// POST /college/announcements
export const createAnnouncement = async (data: CreateAnnouncementData) => {
  const response = await api.post("/college/announcements", data);
  return response.data;
};

// GET /college/announcements
export const getAnnouncements = async () => {
  const response = await api.get("/college/announcements");
  return response.data;
};

