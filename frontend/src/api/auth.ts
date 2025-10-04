import { api } from "./client";

export type Role = "ADMIN" | "COMPANY_MANAGER" | "MANAGER" | "USER" | string;

export type CurrentUser = {
  id: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: Role;
  is_staff?: boolean;
  is_superuser?: boolean;
};

const LOGIN_URLS = [
  "/api/auth/jwt/create/",
  "/api/token/",
  "/api/auth/login/",
  "/auth/jwt/create/",
  "/auth/login/",
  "/api/auth/token/login/",
];

const REFRESH_URLS = [
  "/api/auth/jwt/refresh/",
  "/api/token/refresh/",
  "/auth/jwt/refresh/",
];

const LOGOUT_URLS = [
  "/api/auth/logout/",
  "/api/auth/token/logout/",
  "/auth/logout/",
];

const ME_URLS = [
  "/api/auth/me/",
  "/api/accounts/me/",
  "/api/users/me/",
  "/api/user/me/",
  "/api/profile/",
  "/api/auth/user/",
  "/api/me/",
];

type Tokens = { access?: string | null; refresh?: string | null };

function extractTokens(d: any): Tokens {
  const access = d?.access ?? d?.token ?? d?.auth_token ?? d?.key ?? null;
  const refresh = d?.refresh ?? d?.refresh_token ?? null;
  return { access, refresh };
}

/** Логин по username/email + password. Подбирает URL и формат. */
export async function login(login: string, password: string): Promise<Tokens> {
  const payloads = [
    { username: login, password },
    { email: login, password },
    { login, password },
    { username_or_email: login, password },
  ];

  for (const url of LOGIN_URLS) {
    for (const body of payloads) {
      try {
        const { data } = await api.post(url, body);
        const tk = extractTokens(data);
        if (tk.access || tk.refresh) return tk;
      } catch {
        // try next
      }
    }
  }
  throw new Error("LOGIN_FAILED");
}

export async function refreshToken(refresh: string): Promise<string> {
  for (const url of REFRESH_URLS) {
    try {
      const { data } = await api.post(url, { refresh, refresh_token: refresh });
      const tk = extractTokens(data);
      if (tk.access) return tk.access!;
    } catch {
      /* next */
    }
  }
  throw new Error("REFRESH_FAILED");
}

export async function logout(): Promise<void> {
  for (const url of LOGOUT_URLS) {
    try {
      await api.post(url, {});
      break;
    } catch {
      /* try next */
    }
  }
}

export async function fetchMe(): Promise<CurrentUser> {
  for (const url of ME_URLS) {
    try {
      const { data } = await api.get(url);
      return data as CurrentUser;
    } catch {
      /* try next */
    }
  }
  throw new Error("ME_FAILED");
}
