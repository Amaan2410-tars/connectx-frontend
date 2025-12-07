import { api } from "@/lib/apiClient";

export interface PremiumStatus {
  isPremium: boolean;
  planType?: "monthly" | "annual";
  premiumExpiry?: string;
  premiumBadge?: string;
  currentPeriodEnd?: string;
}

export interface SubscribeToPremiumData {
  planType: "monthly" | "annual";
}

export interface SubscriptionResponse {
  subscriptionId: string;
  razorpaySubscriptionId: string;
  planType: string;
  status: string;
  currentPeriodEnd: string;
}

// POST /premium/subscribe
export const subscribeToPremium = async (
  data: SubscribeToPremiumData
): Promise<{ success: boolean; message: string; data: SubscriptionResponse }> => {
  const response = await api.post("/premium/subscribe", data);
  return response.data;
};

// GET /premium/status
export const getPremiumStatus = async (): Promise<{ success: boolean; data: PremiumStatus }> => {
  try {
    const response = await api.get("/premium/status");
    return {
      success: response.data?.success !== false,
      data: response.data?.data || {
        isPremium: false,
      },
    };
  } catch (error: any) {
    console.error("Error fetching premium status:", error);
    return {
      success: false,
      data: {
        isPremium: false,
      },
    };
  }
};

// POST /premium/cancel
export const cancelPremium = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post("/premium/cancel");
  return response.data;
};


