import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

/* ===================== baseURL ===================== */
const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL?.replace(/\/$/, "") || "";

/* ===================== axios instance =============== */
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* ===================== tokens store ================= */
let access: string | null = null;
let refresh: string | null = null;

export function setTokens(a: string | null, r: string | null) {
  access = a;
  refresh = r;
  if (a) localStorage.setItem("aa_access", a);
  else localStorage.removeItem("aa_access");
  if (r) localStorage.setItem("aa_refresh", r);
  else localStorage.removeItem("aa_refresh");
}

export function bootstrapTokensFromStorage() {
  access = localStorage.getItem("aa_access");
  refresh = localStorage.getItem("aa_refresh");
}

/* ================== attach Authorization ============ */
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  if (access) {
    if (!cfg.headers) cfg.headers = {} as any;
    (cfg.headers as any).Authorization = `Bearer ${access}`;
  }
  return cfg;
});

/* ================== 401 auto-refresh ================= */
const REFRESH_URLS = [
  "/api/auth/jwt/refresh/",
  "/api/token/refresh/",
  "/auth/jwt/refresh/",
];

async function tryRefresh(r: string) {
  for (const url of REFRESH_URLS) {
    try {
      const { data } = await api.post(url, { refresh: r, refresh_token: r });
      const newAccess =
        data?.access ?? data?.token ?? data?.auth_token ?? data?.key ?? null;
      if (newAccess) {
        access = newAccess;
        localStorage.setItem("aa_access", access);
        return access;
      }
    } catch {
      /* try next */
    }
  }
  throw new Error("REFRESH_FAILED");
}

let refreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (resp: AxiosResponse) => resp,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    if (status !== 401 || original._retry || !refresh) {
      throw error;
    }

    if (!refreshing) {
      refreshing = true;
      try {
        await tryRefresh(refresh);
        queue.forEach((fn) => fn());
      } catch {
        setTokens(null, null);
        queue = [];
        throw error;
      } finally {
        refreshing = false;
      }
    }

    await new Promise<void>((res) => queue.push(res));

    original._retry = true;
    if (!original.headers) original.headers = {} as any;
    (original.headers as any).Authorization = `Bearer ${access}`;
    return api.request(original);
  }
);

export default api;
export { api };
