import axios from "axios";

// Determine API Base URL dynamically (support local dev & production environment variables)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token & Idempotency Key automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If request is a mutation (POST/PUT/PATCH) and doesn't have an idempotency key, attach a UUID
    if (["post", "put", "patch"].includes(config.method?.toLowerCase() || "")) {
      if (!config.headers["X-Idempotency-Key"]) {
        const idempotencyKey =
          crypto.randomUUID ? crypto.randomUUID() : `idemp-${Date.now()}-${Math.random()}`;
        config.headers["X-Idempotency-Key"] = idempotencyKey;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors and handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on protected route, clean expired token
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan pada sistem";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
