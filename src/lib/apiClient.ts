import axios from "axios";

// Use production backend URL - ensure no trailing slash
const baseURL = import.meta.env.VITE_API_URL || "https://connectx-backend-p1n4.onrender.com/api";

// Remove trailing slash if present
const cleanBaseURL = baseURL.replace(/\/+$/, "");

// Debug: Log the base URL
console.log("🔍 API Base URL:", cleanBaseURL);

const api = axios.create({
  baseURL: cleanBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Handle network errors
    if (!error.response) {
      console.error("Network error - Backend may be unreachable");
      return Promise.reject(new Error("Cannot connect to server. Please check your connection."));
    }

    // Handle 401 Unauthorized (but not on login/signup pages)
    if (error.response?.status === 401) {
      const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/signup";
      
      if (!isAuthPage) {
        // Clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export { api };

