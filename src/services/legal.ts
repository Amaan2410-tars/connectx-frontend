import { api } from "@/lib/apiClient";

export interface LegalPageData {
  title: string;
  lastUpdated?: string;
  content: string;
}

export interface LegalPageResponse {
  success: boolean;
  data: LegalPageData;
}

// Fetch Terms and Conditions
export const getTermsAndConditions = async (): Promise<LegalPageResponse> => {
  const response = await api.get<LegalPageResponse>("/legal/terms");
  return response.data;
};

// Fetch Privacy Policy
export const getPrivacyPolicy = async (): Promise<LegalPageResponse> => {
  const response = await api.get<LegalPageResponse>("/legal/privacy");
  return response.data;
};

// Fetch Shipping Policy
export const getShippingPolicy = async (): Promise<LegalPageResponse> => {
  const response = await api.get<LegalPageResponse>("/legal/shipping");
  return response.data;
};

// Fetch Contact Us
export const getContactUs = async (): Promise<LegalPageResponse> => {
  const response = await api.get<LegalPageResponse>("/legal/contact");
  return response.data;
};

// Fetch Cancellation and Refunds
export const getCancellationAndRefunds = async (): Promise<LegalPageResponse> => {
  const response = await api.get<LegalPageResponse>("/legal/refunds");
  return response.data;
};

