import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// global error handling (optional but useful)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    // you can centralize 401 logout later
    return Promise.reject(err);
  }
);

export default axiosInstance;