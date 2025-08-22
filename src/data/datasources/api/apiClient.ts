import axios from "axios";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://drtyui.ru/api",
    headers: {
        "Content-Type": "application/json",
    }
})

apiClient.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initData;
  if (initData) {
    config.headers["X-Init-Data"] = initData;
  }

  return config;
});

export default apiClient;