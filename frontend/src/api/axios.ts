import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API });

api.interceptors.request.use((config) => {
  const tokens = JSON.parse(localStorage.getItem("tokens") || "null");
  if (tokens?.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original: any = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const tokens = JSON.parse(localStorage.getItem("tokens") || "null");
      if (tokens?.refresh) {
        const { data } = await axios.post(`${import.meta.env.VITE_API}/auth/token/refresh`, { refresh: tokens.refresh });
        localStorage.setItem("tokens", JSON.stringify({ ...tokens, access: data.access }));
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      }
      localStorage.removeItem("tokens");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
