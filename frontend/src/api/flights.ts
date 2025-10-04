import { api } from "./client"

type RawFlight = Record<string, any>

export type Flight = {
  id: number
  company_code?: string
  flight_no?: string | number
  origin: string
  destination: string
  departure_at: string
  arrival_at: string
  base_price?: number | string
  seats_available?: number
  status?: string
}

const CANDIDATE_PATHS = [
  "/api/flights/",
  "/api/airlines/flights/",
  "/api/airlines/flight/",
  "/api/v1/flights/",
  "/api/v1/airlines/flight/",
]

let RESOLVED_BASE: string | null = null

function isPaginated(obj: any): obj is { results: RawFlight[]; next: string | null } {
  return obj && typeof obj === "object" && Array.isArray(obj.results)
}

function normalize(f: RawFlight): Flight | null {
  if (!f) return null
  const id = f.id ?? f.pk
  const origin = f.origin ?? f.from ?? f.source ?? f.departure_city
  const destination = f.destination ?? f.to ?? f.target ?? f.arrival_city
  const departure_at = f.departure_at ?? f.departureAt ?? f.departure_time ?? f.departure_datetime
  const arrival_at = f.arrival_at ?? f.arrivalAt ?? f.arrival_time ?? f.arrival_datetime
  if (id == null || !origin || !destination || !departure_at || !arrival_at) return null
  return {
    id: Number(id),
    company_code: f.company_code ?? f.companyCode ?? f.company ?? f.airline_code,
    flight_no: f.flight_no ?? f.flightNo ?? f.number ?? f.code,
    origin: String(origin),
    destination: String(destination),
    departure_at: String(departure_at),
    arrival_at: String(arrival_at),
    base_price: f.base_price ?? f.price ?? f.basePrice,
    seats_available: f.seats_available ?? f.seats ?? f.available_seats,
    status: f.status ?? f.state,
  }
}

async function readListOnce(url: string, params?: Record<string, any>) {
  const { data } = await api.get(url, { params })
  if (Array.isArray(data)) return data as RawFlight[]
  if (isPaginated(data)) return data.results as RawFlight[]
  if (Array.isArray((data as any)?.data)) return (data as any).data as RawFlight[]
  if (Array.isArray((data as any)?.items)) return (data as any).items as RawFlight[]
  return []
}

export async function fetchFlights(params?: Record<string, any>) {
  if (RESOLVED_BASE) {
    const raws = await readListOnce(RESOLVED_BASE, params)
    return raws.map(normalize).filter(Boolean) as Flight[]
  }
  for (const base of CANDIDATE_PATHS) {
    try {
      const raws = await readListOnce(base, params)
      const list = raws.map(normalize).filter(Boolean) as Flight[]
      RESOLVED_BASE = base
      if (import.meta.env.DEV) console.info("[flights] using", base, `(${list.length})`)
      return list
    } catch { /* try next */ }
  }
  throw new Error("Не удалось получить список рейсов: ни один из известных URL не отвечает.")
}

export async function getFlight(id: number) {
  const bases = RESOLVED_BASE ? [RESOLVED_BASE, ...CANDIDATE_PATHS] : CANDIDATE_PATHS
  const patterns = [(b: string) => `${b}${id}/`, (b: string) => `${b}${id}`]
  for (const b of bases) {
    for (const build of patterns) {
      try {
        const { data } = await api.get(build(b))
        const f = normalize(data)
        if (f) { RESOLVED_BASE ||= b; return f }
      } catch { /* next */ }
    }
  }
  throw new Error(`Не удалось получить рейс id=${id}`)
}
