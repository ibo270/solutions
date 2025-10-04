// src/utils/roles.ts
export type Role = 'ADMIN' | 'COMPANY_MANAGER' | 'MANAGER' | 'USER';

export type CurrentUser = {
  id: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string | null;
  is_staff?: boolean;
  is_superuser?: boolean;
};

/** Нормализуем значение role из разных беков/форматов */
export function normalizeRole(user?: CurrentUser | null): Role {
  if (!user) return 'USER';
  if (user.is_superuser || user.is_staff) return 'ADMIN';

  const raw = (user.role || '').trim().toUpperCase();
  if (raw === 'ADMIN') return 'ADMIN';
  if (raw === 'COMPANY_MANAGER' || raw === 'COMPANY-MANAGER') return 'COMPANY_MANAGER';
  if (raw === 'MANAGER') return 'MANAGER';
  return 'USER';
}

/** Иерархия (если нужна логика "минимальной роли") */
export const ROLE_ORDER: Record<Role, number> = {
  USER: 1,
  MANAGER: 2,
  COMPANY_MANAGER: 2, // на одном уровне с MANAGER — при желании можно развести
  ADMIN: 3,
};

/** Пользователь >= минимальной роли? (с учётом, что ADMIN всегда >= всех) */
export function hasAtLeast(user: CurrentUser | null | undefined, min: Role): boolean {
  const r = normalizeRole(user);
  return ROLE_ORDER[r] >= ROLE_ORDER[min];
}

/** Разрешён ли доступ хотя бы одной из ролей. ADMIN — всегда true */
export function hasAnyRole(user: CurrentUser | null | undefined, allowed: Role[]): boolean {
  const r = normalizeRole(user);
  if (r === 'ADMIN') return true; // админ поверх всех
  const set = new Set(allowed.map((x) => x.toUpperCase()));
  return set.has(r);
}
