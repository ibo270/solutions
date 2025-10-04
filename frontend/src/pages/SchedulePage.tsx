import { useEffect, useMemo, useState } from "react";
import { fetchFlights, type Flight } from "../api/flights";
import { Button } from "../components/UI";

/* === helpers === */
function fmtDT(s?: string) {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "emerald" | "amber" | "indigo";
}) {
  const map: Record<string, string> = {
    slate:
      "bg-slate-500/15 text-slate-200 border border-slate-400/20 backdrop-blur",
    emerald:
      "bg-emerald-500/15 text-emerald-200 border border-emerald-400/20 backdrop-blur",
    amber:
      "bg-amber-500/15 text-amber-200 border border-amber-400/20 backdrop-blur",
    indigo:
      "bg-indigo-500/15 text-indigo-200 border border-indigo-400/20 backdrop-blur",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}

/* === fancy card for schedule === */
function ScheduleCard({ f }: { f: Flight }) {
  const tone =
    (f.status ?? "").toLowerCase() === "scheduled"
      ? "emerald"
      : (f.status ?? "").toLowerCase() === "delayed"
      ? "amber"
      : "slate";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 shadow-[0_8px_30px_rgba(0,0,0,.12)]">
      {/* подсветка */}
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(1000px_240px_at_10%_-10%,rgba(59,130,246,.18),transparent),radial-gradient(800px_240px_at_120%_120%,rgba(99,102,241,.18),transparent)]" />

      {/* верхняя строка */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Badge tone="indigo">
            {(f as any).company_code ?? (f as any).company ?? "—"}
          </Badge>
          <span className="opacity-70">•</span>
          <span className="font-medium">{String(f.flight_no ?? "—")}</span>
        </div>
        <Badge tone={tone as any}>Статус: {f.status ?? "—"}</Badge>
      </div>

      {/* таймлайн */}
      <div className="relative z-10 mt-4 grid md:grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="min-w-0">
          <div className="text-xs text-white/60">Вылет</div>
          <div className="font-semibold text-white">{f.origin}</div>
          <div className="text-sm text-white/70">{fmtDT(f.departure_at)}</div>
        </div>

        {/* линия + самолетик */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-40 h-px bg-white/15 rounded-full relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 select-none">
              ✈️
            </span>
          </div>
        </div>

        <div className="min-w-0 text-right">
          <div className="text-xs text-white/60">Прилет</div>
          <div className="font-semibold text-white">{f.destination}</div>
          <div className="text-sm text-white/70">{fmtDT(f.arrival_at)}</div>
        </div>
      </div>

      {/* нижняя строка */}
      <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-white/60">
          Мест: {Number.isFinite(f.seats_available) ? f.seats_available : "—"}
        </div>
        <div className="text-sm text-white/70">
          {(f as any).company_name ?? ""}
        </div>
      </div>
    </div>
  );
}

/* === page === */
export default function SchedulePage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // лёгкие фильтры
  const [qFrom, setQFrom] = useState("");
  const [qTo, setQTo] = useState("");
  const [status, setStatus] = useState<"" | "scheduled" | "delayed" | "cancelled">("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // если у тебя сервер умеет фильтры — можно передать { origin: qFrom, destination: qTo }
        const data = await fetchFlights();
        setFlights(data);
      } catch {
        setError("Не удалось загрузить расписание");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const list = Array.isArray(flights) ? flights : [];
    return list.filter((f) => {
      if (qFrom && !f.origin?.toLowerCase().includes(qFrom.toLowerCase())) return false;
      if (qTo && !f.destination?.toLowerCase().includes(qTo.toLowerCase())) return false;
      if (status && (f.status ?? "").toLowerCase() !== status) return false;
      return true;
    });
  }, [flights, qFrom, qTo, status]);

  return (
    <div className="space-y-6">
      {/* фильтры */}
      <div className="grid md:grid-cols-[1fr_1fr_220px_auto] gap-3">
        <input
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/50"
          placeholder="Откуда"
          value={qFrom}
          onChange={(e) => setQFrom(e.target.value)}
        />
        <input
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/50"
          placeholder="Куда"
          value={qTo}
          onChange={(e) => setQTo(e.target.value)}
        />
        <select
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="">Любой статус</option>
          <option value="scheduled">Запланирован</option>
          <option value="delayed">Задержан</option>
          <option value="cancelled">Отменён</option>
        </select>
        <Button
          className="rounded-xl px-4"
          onClick={() => {
            // если позже добавишь серверные фильтры — тут можно дергать fetchFlights({origin:qFrom,destination:qTo,status})
            // пока фильтруем на клиенте
          }}
        >
          Применить
        </Button>
      </div>

      {/* контент */}
      {loading && (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/10 animate-pulse" />
          ))}
        </div>
      )}

      {error && <div className="text-red-400">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
          Расписание пусто
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map((f) => (
            <ScheduleCard key={f.id} f={f} />
          ))}
        </div>
      )}
    </div>
  );
}
