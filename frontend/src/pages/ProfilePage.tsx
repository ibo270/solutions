import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useTheme } from "../store/ThemeContext";
import { getMyTickets, type Ticket } from "../api/tickets";

type RoleMap = Record<string, { label: string; cls: string }>;

const ROLE_MAP: RoleMap = {
  ADMIN: {
    label: "ADMIN",
    cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/20 dark:text-emerald-200",
  },
  COMPANY_MANAGER: {
    label: "USER",
    cls: "bg-amber-500/15 text-amber-700 border-amber-500/20 dark:text-amber-200",
  },
  MANAGER: {
    label: "MANAGER",
    cls: "bg-amber-500/15 text-amber-700 border-amber-500/20 dark:text-amber-200",
  },
  USER: {
    label: "USER",
    cls: "bg-slate-500/15 text-slate-700 border-slate-500/20 dark:text-slate-200",
  },
};

function Badge({
  children,
  cls = "",
}: {
  children: React.ReactNode;
  cls?: string;
}) {
  return (
    <span
      className={
        "px-2 py-0.5 rounded-full text-xs font-semibold border " + cls
      }
    >
      {children}
    </span>
  );
}

export default function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const { theme, toggle } = useTheme();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const roleInfo = useMemo(() => {
    const r = (user?.role ?? "USER").toUpperCase();
    return ROLE_MAP[r] ?? ROLE_MAP.USER;
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyTickets();
        setTickets(Array.isArray(data) ? data : []);
      } catch {
        setErr("Не удалось загрузить билеты");
        setTickets([]);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      {/* Герой-плашка */}
      <div
        className="
          rounded-3xl p-6 md:p-7
          bg-white border border-black/10
          dark:bg-white/5 dark:border-white/10
          shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 grid place-items-center rounded-2xl
                          bg-gradient-to-tr from-blue-500 to-indigo-500 text-white text-2xl font-bold select-none">
            {String(user?.username ?? "u").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                {user?.username ?? "—"}
              </h1>
              <Badge cls={roleInfo.cls}>{roleInfo.label}</Badge>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-white/70">
              ID: {user?.id ?? "—"} • {user?.email || "email не указан"}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggle}
              className="h-9 px-3 rounded-xl border
                         border-black/10 bg-white hover:bg-slate-50
                         text-slate-800
                         dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
            >
              {theme === "dark" ? "☀️ Тёмная" : "🌙 Тёмная"}
            </button>
            <button
              onClick={() => refreshMe()}
              className="h-9 px-3 rounded-xl border
                         border-black/10 bg-white hover:bg-slate-50
                         text-slate-800
                         dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              ⟳ Обновить
            </button>
          </div>
        </div>
      </div>

      {/* 3 колонки */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Аккаунт */}
        <div className="rounded-2xl p-5 bg-white border border-black/10 dark:bg-white/5 dark:border-white/10">
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-white/60 uppercase mb-3">
            Аккаунт
          </div>
          <Row label="Email" value={user?.email || "—"} />
          <Row label="Username" value={user?.username || "—"} />
        </div>

        {/* Профиль */}
        <div className="rounded-2xl p-5 bg-white border border-black/10 dark:bg-white/5 dark:border-white/10">
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-white/60 uppercase mb-3">
            Профиль
          </div>
          <Row label="Имя" value={user?.first_name || "—"} />
          <Row label="Фамилия" value={user?.last_name || "—"} />
          <Row label="Роль" value={(user?.role ?? "USER").toUpperCase()} />
          <Row
            label="Права"
            value={user?.is_superuser ? "Суперпользователь" : user?.is_staff ? "Персонал" : "Стандартный"}
          />
        </div>

        {/* Предпочтения */}
        <div className="rounded-2xl p-5 bg-white border border-black/10 dark:bg-white/5 dark:border-white/10">
          <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-white/60 uppercase mb-3">
            Предпочтения
          </div>
          <Row label="Тема интерфейса" value={theme === "dark" ? "Тёмная" : "Светлая"} />
          <div className="mt-2">
            <button
              onClick={toggle}
              className="rounded-xl bg-blue-600 text-white px-3 py-2 hover:bg-blue-500"
            >
              Переключить
            </button>
          </div>
          <div className="mt-3 text-sm text-slate-600 dark:text-white/60">
            Выбор темы сохраняется локально и подстраивается под системные
            настройки.
          </div>
        </div>
      </div>

      {/* Билеты */}
      <section className="rounded-2xl p-5 bg-white border border-black/10 dark:bg-white/5 dark:border-white/10">
        <h2 className="text-lg font-bold mb-3">Мои билеты</h2>

        {err && <div className="text-rose-600 dark:text-rose-300">{err}</div>}

        {!err && (!tickets || tickets.length === 0) && (
          <div className="text-slate-600 dark:text-white/60">
            Пока нет билетов
          </div>
        )}

        {!err && tickets && tickets.length > 0 && (
          <div className="grid gap-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="rounded-xl p-4 border border-black/10 bg-white dark:bg-white/5 dark:border-white/10"
              >
                <div className="text-sm text-slate-600 dark:text-white/60 break-all">
                  {t.confirmation_id}
                </div>
                <div className="font-semibold mt-1">
                  {t.flight.origin} <span className="text-slate-500 dark:text-white/60">→</span>{" "}
                  {t.flight.destination}
                </div>
                <div className="text-sm text-slate-600 dark:text-white/60">
                  Статус: {t.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-center py-1.5">
      <div className="text-xs text-slate-500 dark:text-white/60">{label}</div>
      <div className="text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
