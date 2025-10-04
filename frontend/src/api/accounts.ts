// src/api/accounts.ts

import { fetchMe } from "./auth";
import type { CurrentUser as Me, Role } from "./auth";

// Прокидываем наружу типы, если где-то используются
export type { Me, Role };

// Единственный экспорт функции me — реэкспорт из auth.ts
export const me = fetchMe;
