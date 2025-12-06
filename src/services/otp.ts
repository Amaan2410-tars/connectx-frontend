import { api } from "@/lib/apiClient";

// Send email OTP
export const sendEmailOtp = async (email: string) => {
  const response = await api.post("/auth/send-email-otp", { email });
  return response.data;
};

// Send phone OTP
export const sendPhoneOtp = async (phone: string) => {
  const response = await api.post("/auth/send-phone-otp", { phone });
  return response.data;
};

// Verify email OTP
export const verifyEmailOtp = async (email: string, otp: string) => {
  const response = await api.post("/auth/verify-email-otp", { email, otp });
  return response.data;
};

// Verify phone OTP
export const verifyPhoneOtp = async (phone: string, otp: string) => {
  const response = await api.post("/auth/verify-phone-otp", { phone, otp });
  return response.data;
};

