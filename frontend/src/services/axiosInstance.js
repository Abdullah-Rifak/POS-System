import axios from "axios";
import Logger from "./logger";
import swal from "sweetalert2";

// Get API base URL - works for both dev and production Tauri builds
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds for slower connections and initial backend startup
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    Logger.info(
      `[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`,
    );
    return config;
  },
  (error) => {
    Logger.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    const licenseWarning = response?.headers?.["x-license-warning"];
    if (
      licenseWarning &&
      sessionStorage.getItem("license_warning_shown") !== "true"
    ) {
      sessionStorage.setItem("license_warning_shown", "true");
      swal.fire({
        icon: "warning",
        title: "License Warning",
        text: licenseWarning,
      });
    }

    Logger.info(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Network error";
    Logger.error(
      `[API Error] ${error.response?.status || "Unknown"} - ${message}`,
    );

    const errorCode = error.response?.data?.code;
    if (
      error.response?.status === 403 &&
      (errorCode === "LICENSE_BLOCKED" ||
        errorCode === "LICENSE_MISSING" ||
        errorCode === "LICENSE_INVALID" ||
        errorCode === "LICENSE_INVALID_SIGNATURE" ||
        errorCode === "LICENSE_INVALID_EXPIRY")
    ) {
      if (sessionStorage.getItem("license_blocked_shown") !== "true") {
        sessionStorage.setItem("license_blocked_shown", "true");
        swal.fire({
          icon: "error",
          title: "License Required",
          text:
            error.response?.data?.message ||
            "System is blocked until the license is renewed.",
        });
      }
    }

    // Handle 401 Unauthorized - redirect to login (avoid reload if already on login)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      try {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      } catch (e) {
        // ignore navigation errors in non-browser contexts
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
export { API_BASE_URL };
