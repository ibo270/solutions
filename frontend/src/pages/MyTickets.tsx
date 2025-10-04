// src/pages/MyTickets.tsx
import { useEffect, useMemo, useState } from "react";
import { getMyTickets, cancelTicket, type Ticket } from "../api/tickets";

type StatusInfo = {
  label: string;
  cls: string;       // классы для Badge (light + dark)
  canCancel: boolean;
};

const STATUS: Record<string, StatusInfo> = {
  paid:      { label: "Оплачен",  cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/25 dark:text-emerald-200", canCancel: true  },
  booked:    { label: "Бронь",    cls: "bg-blue-500/15 text-blue-700 border-blue-500/25 dark:text-blue-200",             canCancel: true  },
  issued:    { label: "Выдан",    cls: "bg-indigo-500/15 text-indigo-700 border-indigo-500/25 dark:text-indigo-200",     canCancel: true  },
  refunded:  { label: "Возврат",  cls: "bg-slate-500/15 text-slate-700 border-slate-500/25 dark:text-slate-200",         canCancel: false },
  cancelled: { label: "Отменён",  cls: "bg-rose-500/15 text-rose-700 border-rose-500/25 dark:text-rose-200",             canCancel: false },
  canceled:  { label: "Отменён",  cls: "bg-rose-500/15 text-rose-700 border-rose-500/25 dark:text-rose-200",             canCancel: false },
  pending:   { label: "Ожидает",  cls: "bg-amber-500/15 text-amber-700 border-amber-500/25 dark:text-amber-200",         canCancel: true  },
};

function Badge({ children, cls = "" }: { children: React.ReactNode; cls?: string }) {
  return (
    <span className={"px-2 py-0.5 rounded-full text-xs font-semibold border " + cls}>
      {children}
    </span>
  );
}

export default function MyTickets() {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const data = await getMyTickets();
        setTickets(Array.isArray(data) ? data : []);
      } catch {
        setErr("Не удалось загрузить билеты");
        setTickets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const list = Array.isArray(tickets) ? tickets : [];
    if (!q.trim()) return list;
    const needle = q.trim().toLowerCase();
    return list.filter((t) => t.confirmation_id?.toLowerCase?.().includes(needle));
  }, [tickets, q]);

  async function onCancel(id: number) {
    const ok = window.confirm("Точно отменить билет?");
    if (!ok) return;
    try {
      await cancelTicket(id);
      // локально отметим как отменённый
      setTickets((prev) =>
        (prev || []).map((t) => (t.id === id ? { ...t, status: "cancelled" as any } : t))
      );
    } catch {
      alert("Не удалось отменить билет");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Мои билеты</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по № подтверждения…"
          className="w-full sm:w-80 rounded-xl border px-3 py-2 text-sm
                     bg-white text-slate-900 border-black/10 placeholder:text-slate-400
                     dark:bg-white/5 dark:text-white dark:border-white/10 dark:placeholder:text-white/40
                     focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
      </header>

      {loading && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-white border border-black/10 dark:bg-white/5 dark:border-white/10 animate-pulse"
            />
          ))}
        </div>
      )}

      {err && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 p-4
                        dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-200">
          {err}
        </div>
      )}

      {!loading && !err && (!tickets || tickets.length === 0) && (
        <div className="text-slate-600 dark:text-white/70">Пока у вас нет билетов.</div>
      )}

      {!loading && !err && tickets && tickets.length > 0 && (
        <div className="grid gap-5">
          {filtered.map((t) => (
            <TicketCard key={t.id} t={t} onCancel={onCancel} />
          ))}
          {filtered.length === 0 && (
            <div className="text-slate-600 dark:text-white/60">По запросу ничего не найдено.</div>
          )}
        </div>
      )}
    </div>
  );
}

function TicketCard({ t, onCancel }: { t: Ticket; onCancel: (id: number) => void }) {
  const info = STATUS[(t.status || "").toLowerCase()] ?? STATUS.pending;
  const f = t.flight ?? ({} as any);

  const dep = f.departure_at ? new Date(f.departure_at) : null;
  const arr = f.arrival_at ? new Date(f.arrival_at) : null;

  const btnBase = "rounded-xl px-3 py-2 text-sm transition-colors";
  const btnActive = "bg-rose-600 text-white hover:bg-rose-500";
  const btnDisabled =
    "bg-slate-200/70 text-slate-500 dark:bg-white/10 dark:text-white/40 cursor-not-allowed";

  return (
    <article
      className="rounded-3xl p-5 md:p-6 border
                 bg-white border-black/10 shadow-sm
                 dark:bg-white/5 dark:border-white/10"
    >
      {/* верхняя строка */}
      <div className="flex items-start gap-3">
        <div className="text-xs text-slate-500 dark:text-white/60 break-all">
          {t.confirmation_id}
        </div>
        <div className="ml-auto">
          <Badge cls={info.cls}>{info.label}</Badge>
        </div>
      </div>

      {/* основной блок */}
      <div className="mt-3 grid md:grid-cols-[1fr_auto_1fr] items-start gap-4">
        {/* Из */}
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            Из
          </div>
          <div className="text-lg font-semibold truncate">{f.origin ?? "—"}</div>

          <div className="mt-2 text-sm text-slate-600 dark:text-white/70">Вылет</div>
          <div className="text-sm">{dep ? dep.toLocaleString() : "—"}</div>
        </div>

        {/* Центр */}
        <div className="hidden md:flex flex-col items-center justify-center px-6">
          <div className="w-36 h-px bg-black/10 dark:bg-white/10" />
          <div className="mt-2 text-2xl">✈️</div>
          <div className="mt-2 w-36 h-px bg-black/10 dark:bg-white/10" />
          <div className="mt-3 text-sm text-slate-600 dark:text-white/70">Рейс</div>
          <div className="text-sm font-semibold">{f.flight_no ?? "—"}</div>
        </div>

        {/* В */}
        <div className="min-w-0 text-right md:text-left">
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-white/60">
            В
          </div>
          <div className="text-lg font-semibold truncate">{f.destination ?? "—"}</div>

          <div className="mt-2 text-sm text-slate-600 dark:text-white/70">Прилет</div>
          <div className="text-sm">{arr ? arr.toLocaleString() : "—"}</div>
        </div>
      </div>

      {/* подвал карточки */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-500 dark:text-white/60">Статус: {t.status}</div>

        <button
          className={btnBase + " " + (info.canCancel ? btnActive : btnDisabled)}
          onClick={() => info.canCancel && onCancel(t.id)}
          disabled={!info.canCancel}
        >
          Отменить
        </button>
      </div>
    </article>
  );
}
