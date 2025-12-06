import { api } from "@/lib/apiClient";

export interface VerificationData {
  idCardImage: File | string;
  faceImage: File | string;
}

export interface VerificationStatus {
  id: string;
  userId: string;
  idCardImage: string;
  faceImage: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  matchScore?: number;
  faceMatchScore?: number;
  collegeMatch?: boolean;
  analysisRemarks?: string;
  createdAt: string;
}

export interface VerificationStatusResponse {
  user: {
    id: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    verifiedStatus: "pending" | "approved" | "rejected";
    bypassVerified: boolean;
  };
  verification: VerificationStatus | null;
  canRetry?: boolean;
  retryAfter?: string | null;
}

// POST /student/verify/id-upload
export const uploadIdCard = async (file: File) => {
  const formData = new FormData();
  formData.append("idCard", file);
  
  const response = await api.post("/student/verify/id-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// POST /student/verify/face-upload
export const uploadFaceImage = async (file: File) => {
  const formData = new FormData();
  formData.append("faceImage", file);
  
  const response = await api.post("/student/verify/face-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// POST /verify/submit (submit both images)
export const submitVerification = async (data: VerificationData) => {
  const formData = new FormData();
  
  if (data.idCardImage instanceof File) {
    formData.append("idCard", data.idCardImage);
  } else {
    formData.append("idCardImage", data.idCardImage);
  }
  
  if (data.faceImage instanceof File) {
    formData.append("faceImage", data.faceImage);
  } else {
    formData.append("faceImage", data.faceImage);
  }
  
  const response = await api.post("/student/verification", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// GET /student/verify/status
export const getVerificationStatus = async (): Promise<{ success: boolean; data: VerificationStatusResponse }> => {
  const response = await api.get("/student/verify/status");
  return response.data;
};

