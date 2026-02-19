import axios from "axios";

const apiClient = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "/api",
  // baseURL: import.meta.env.VITE_API_URL || "https://api.whyy0u.ru/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData;
  if (initData) {
    config.headers["X-Init-Data"] = initData;
  }

  // Для тестирования в браузере (не в Telegram)
  const testUserId = localStorage.getItem("test_user_id");
  if (testUserId && !initData) {
    config.headers["X-User-Id"] = testUserId;
  }

  return config;
});

export default apiClient;
