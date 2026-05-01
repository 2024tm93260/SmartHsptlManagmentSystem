import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/doctor",
  withCredentials: true, 
  timeout: 10000,
});

const hasDoctorSession = () => {
  try {
    return localStorage.getItem("doctorSession") === "true";
  } catch {
    return false;
  }
};

const isPublicRoute = (url = "") => {
  return [
    "/login",
    "/register",
    "/forgot-password/send-otp",
    "/forgot-password/verify-otp",
    "/forgot-password/update-password",
  ].some((route) => url.includes(route));
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      !originalRequest ||
      originalRequest.url.includes("renew-access-token") ||
      isPublicRoute(originalRequest.url) ||
      !hasDoctorSession()
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/renew-access-token");

      processQueue(null);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      isRefreshing = false;

      return Promise.reject(refreshError);
    }
  }
);
export default api;
