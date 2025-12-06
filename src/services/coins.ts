import { api } from "@/lib/apiClient";

export interface CoinBundle {
  id: number;
  amountINR: number;
  coins: number;
}

export interface CoinPurchase {
  id: number;
  userId: string;
  bundleId: number;
  coins: number;
  amountINR: number;
  status: string;
  orderId?: string;
  createdAt: string;
}

export interface CoinTransaction {
  id: number;
  fromUser?: string;
  toUser?: string;
  coins: number;
  type: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    username: string;
  };
  receiver?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
}

export interface GiftCoinsData {
  toUserId: string;
  coins: number;
}

// GET /coins/bundles
export const getCoinBundles = async (): Promise<{ success: boolean; data: CoinBundle[] }> => {
  try {
    const response = await api.get("/coins/bundles");
    return {
      success: response.data?.success !== false,
      data: Array.isArray(response.data?.data) ? response.data.data : [],
    };
  } catch (error: any) {
    console.error("Error fetching coin bundles:", error);
    return {
      success: false,
      data: [],
    };
  }
};

// POST /coins/create-order
export const createOrder = async (bundleId: number): Promise<{ success: boolean; data: CreateOrderResponse }> => {
  const response = await api.post("/coins/create-order", { bundleId });
  return response.data;
};

// POST /coins/verify
export const verifyPayment = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ success: boolean; message: string; data: CoinPurchase }> => {
  const response = await api.post("/coins/verify", {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  });
  return response.data;
};

// POST /coins/gift
export const giftCoins = async (data: GiftCoinsData): Promise<{ success: boolean; message: string }> => {
  const response = await api.post("/coins/gift", data);
  return response.data;
};

// GET /coins/history
export const getTransactionHistory = async (): Promise<{ success: boolean; data: CoinTransaction[] }> => {
  try {
    const response = await api.get("/coins/history");
    return {
      success: response.data?.success !== false,
      data: Array.isArray(response.data?.data) ? response.data.data : [],
    };
  } catch (error: any) {
    console.error("Error fetching transaction history:", error);
    return {
      success: false,
      data: [],
    };
  }
};

