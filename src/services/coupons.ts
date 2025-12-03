import { api } from "@/lib/apiClient";

export interface Coupon {
  id: string;
  vendor: string;
  value: string;
  expiry: string;
  qrCode: string;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

// GET /coupons
export const getCoupons = async (): Promise<{ success: boolean; data: Coupon[] }> => {
  const response = await api.get("/student/coupons");
  return response.data;
};

// GET /coupons/:id
export const getCouponById = async (id: string) => {
  const response = await api.get(`/student/coupons/${id}`);
  return response.data;
};

// POST /coupons/redeem
export const redeemCoupon = async (couponId: string) => {
  const response = await api.post(`/student/coupons/${couponId}/redeem`);
  return response.data;
};

