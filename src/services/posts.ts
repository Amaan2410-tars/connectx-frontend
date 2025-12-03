import { api } from "@/lib/apiClient";

export interface CreatePostData {
  caption?: string;
  image?: File | string;
}

export interface Post {
  id: string;
  userId: string;
  caption?: string;
  image?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  _count: {
    likes: number;
    comments: number;
  };
}

export interface FeedResponse {
  success: boolean;
  data: {
    posts: Post[];
    nextCursor?: string;
    hasMore: boolean;
  };
}

// POST /posts/create
export const createPost = async (data: CreatePostData) => {
  const formData = new FormData();
  if (data.caption) formData.append("caption", data.caption);
  if (data.image instanceof File) {
    formData.append("postImage", data.image);
  } else if (data.image) {
    formData.append("image", data.image);
  }
  
  const response = await api.post("/student/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// GET /posts/feed
export const getFeed = async (limit: number = 20, cursor?: string): Promise<FeedResponse> => {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  if (cursor) params.append("cursor", cursor);
  
  const response = await api.get(`/student/posts/feed?${params.toString()}`);
  return response.data;
};

// POST /posts/like
export const likePost = async (postId: string) => {
  const response = await api.post(`/student/posts/${postId}/like`);
  return response.data;
};

// POST /posts/comment
export const commentOnPost = async (postId: string, text: string) => {
  const response = await api.post(`/student/posts/${postId}/comments`, { text });
  return response.data;
};

// GET /posts/:id/comments
export const getPostComments = async (postId: string, limit: number = 20) => {
  const response = await api.get(`/student/posts/${postId}/comments?limit=${limit}`);
  return response.data;
};

// Unlike post
export const unlikePost = async (postId: string) => {
  const response = await api.delete(`/student/posts/${postId}/like`);
  return response.data;
};

