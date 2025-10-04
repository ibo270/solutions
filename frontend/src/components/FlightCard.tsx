import { Button } from "./UI";
import type { Flight } from "../api/flights";

function fmtPrice(v?: number | string) {
  const num =
    typeof v === "string" ? Number(v) : typeof v === "number" ? v : undefined;
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num as number);
}

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

export default function FlightCard({
  f,
  onBuy,
}: {
  f: Flight;
  onBuy: (id: number) => void;
}) {
  const soldOut = (f.seats_available ?? 0) <= 0;
  const price = fmtPrice(f.base_price);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-4 md:p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      {/* подсветка при ховере */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(1200px_300px_at_20%_-20%,rgba(59,130,246,.20),transparent),radial-gradient(800px_200px_at_120%_120%,rgba(99,102,241,.18),transparent)]" />

      {/* верхняя строка: компания/номер – цена/места */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Badge tone="indigo">
            {(f as any).company_code ?? (f as any).company ?? "—"}
          </Badge>
          <span className="opacity-70">•</span>
          <span className="font-medium">{String(f.flight_no ?? "—")}</span>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold tracking-tight text-white">
            {price}
            <span className="text-sm opacity-70 ml-1">₸</span>
          </div>
          <div className="text-xs text-white/60">
            {soldOut ? "Нет мест" : `${f.seats_available} мест`}
          </div>
        </div>
      </div>

      {/* маршрут */}
      <div className="relative z-10 mt-3 md:mt-4 grid md:grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="min-w-0 text-white font-semibold text-lg md:text-xl truncate">
          {f.origin}
        </div>

        <div className="flex items-center justify-center">
          {/* стрелка-«лайнер» */}
          <div className="mx-2 flex items-center gap-2 text-white/60">
            <span className="hidden md:inline-block w-12 h-px bg-white/20 rounded-full" />
            <span className="select-none">✈️</span>
            <span className="hidden md:inline-block w-12 h-px bg-white/20 rounded-full" />
          </div>
        </div>

        <div className="min-w-0 text-white font-semibold text-lg md:text-xl text-right truncate">
          {f.destination}
        </div>
      </div>

      {/* времена + статус */}
      <div className="relative z-10 mt-2 md:mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-white/70">
          <span className="mr-2">{fmtDT(f.departure_at)}</span>
          <span className="opacity-50">—</span>
          <span className="ml-2">{fmtDT(f.arrival_at)}</span>
        </div>

        <Badge tone={f.status === "scheduled" ? "emerald" : "slate"}>
          Статус: {f.status ?? "—"}
        </Badge>
      </div>

      {/* действие */}
      <div className="relative z-10 mt-3 flex justify-end">
        <Button
          className="rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
          disabled={soldOut}
          onClick={() => onBuy(f.id)}
        >
          {soldOut ? "Нет мест" : "Купить"}
        </Button>
      </div>
    </div>
  );
}
