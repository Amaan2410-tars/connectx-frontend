import { api } from "@/lib/apiClient";

export interface Reward {
  id: string;
  title: string;
  pointsRequired: number;
  image?: string;
  createdAt: string;
}

// GET /rewards
export const getRewards = async (): Promise<{ success: boolean; data: Reward[] }> => {
  const response = await api.get("/student/rewards");
  return response.data;
};

// GET /rewards/:id
export const getRewardById = async (id: string) => {
  const response = await api.get(`/student/rewards/${id}`);
  return response.data;
};

// POST /rewards/redeem
export const redeemReward = async (rewardId: string) => {
  const response = await api.post(`/student/rewards/${rewardId}/redeem`);
  return response.data;
};

