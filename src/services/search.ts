import { api } from "@/lib/apiClient";

export interface SearchResult {
  users?: any[];
  posts?: any[];
  clubs?: any[];
  events?: any[];
  nextCursor?: string;
  hasMore?: boolean;
}

export interface SearchAllResult {
  users: any[];
  posts: any[];
  clubs: any[];
  events: any[];
}

// GET /search?q=query&type=users|posts|clubs|events|all
export const search = async (
  query: string,
  type: "users" | "posts" | "clubs" | "events" | "all" = "all",
  limit: number = 20,
  cursor?: string
): Promise<{ success: boolean; data: SearchResult | SearchAllResult }> => {
  try {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("type", type);
    params.append("limit", limit.toString());
    if (cursor) params.append("cursor", cursor);

    const response = await api.get(`/search?${params.toString()}`);
    return {
      success: response.data?.success !== false,
      data: response.data?.data || {},
    };
  } catch (error: any) {
    console.error("Error searching:", error);
    return {
      success: false,
      data: {},
    };
  }
};

