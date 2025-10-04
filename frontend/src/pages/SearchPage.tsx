import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchFlights, type Flight } from "../api/flights";
import FilterBar from "../components/FilterBar";
import FlightCard from "../components/FlightCard";
import { buyTicket } from "../api/tickets";

export default function SearchPage() {
  const [sp] = useSearchParams();
  const [flights, setFlights] = useState<Flight[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const origin = sp.get("origin") ?? "";
  const destination = sp.get("destination") ?? "";

  const [price, setPrice] = useState<[number, number]>([0, 999999]);
  const [stops, setStops] = useState<number | null>(null); // на будущее
  const [airline, setAirline] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFlights({
          origin: origin || undefined,
          destination: destination || undefined,
        });
        setFlights(data);
      } catch (e: any) {
        setFlights([]);
        setError(e?.message || "Не удалось загрузить рейсы");
      } finally {
        setLoading(false);
      }
    })();
  }, [origin, destination]);

  const filtered = useMemo(() => {
    const list = Array.isArray(flights) ? flights : [];

    return list.filter((f) => {
      // цена
      const priceNum =
        typeof f.base_price === "string"
          ? Number(f.base_price)
          : Number(f.base_price ?? 0);

      if (Number.isFinite(price[0]) && priceNum < price[0]) return false;
      if (Number.isFinite(price[1]) && priceNum > price[1]) return false;

      // авиакомпания — используем company_code (в твоём типе Flight)
      if (
        airline &&
        !(f.company_code ?? "")
          .toString()
          .toLowerCase()
          .includes(airline.toLowerCase())
      ) {
        return false;
      }

      // фильтр по пересадкам — пока пропускаем
      // if (stops !== null) { ... }

      return true;
    });
  }, [flights, price, airline /*, stops*/]);

  async function onBuy(id: number) {
    const t = await buyTicket(id);
    alert(`Билет куплен! confirmation: ${t.confirmation_id}`);
  }

  return (
    <div className="space-y-4">
      <FilterBar
        price={price}
        setPrice={setPrice}
        stops={stops}
        setStops={setStops}
        airline={airline}
        setAirline={setAirline}
      />

      {loading && (
        <div className="text-slate-600 dark:text-white/70">Загрузка…</div>
      )}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-3">
          {filtered.map((f) => (
            <FlightCard key={f.id} f={f} onBuy={onBuy} />
          ))}
          {filtered.length === 0 && (
            <div className="text-slate-500 dark:text-white/60">
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}
