import api from "./client";

// ===== Types =====
export type Flight = {
  id: number;
  company_code: string;
  flight_no: string;
  origin: string;
  destination: string;
  departure_at: string;
  arrival_at: string;
  base_price: string;
  seats_total: number;
  seats_available: number;
  status: "scheduled" | "completed" | "canceled";
};

export type FlightSearchParams = {
  origin?: string;
  destination?: string;
  company_code?: string;
  date_from?: string; // "2030-06-01"
  date_to?: string;   // "2030-06-02"
  price_gte?: number;
  price_lte?: number;
  ordering?: string;  // "-departure_at", "base_price"
  search?: string;    // flight_no
  page?: number;
};

// ===== API =====
export async function searchFlights(params: FlightSearchParams = {}) {
  const { data } = await api.get("/api/flights/", { params });
  // если включена пагинация DRF — data = {count, next, previous, results}
  return Array.isArray(data) ? data as Flight[] : (data.results as Flight[]);
}

export async function getFlight(id: number) {
  const { data } = await api.get<Flight>(`/api/flights/${id}/`);
  return data;
}

// Менеджер компании: создание/обновление
export type FlightPayload = {
  company_code: string;
  flight_no: string;
  origin: string;
  destination: string;
  departure_at: string; // ISO
  arrival_at: string;   // ISO
  base_price: number;
  seats_total: number;
  status?: "scheduled" | "completed" | "canceled";
};

export async function createCompanyFlight(payload: FlightPayload) {
  const { data } = await api.post(`/api/company/flights/`, payload);
  return data; // объект рейса
}

export async function updateCompanyFlight(id: number, payload: Partial<FlightPayload>) {
  const { data } = await api.patch(`/api/company/flights/${id}/`, payload);
  return data;
}

export async function getFlightPassengers(id: number) {
  const { data } = await api.get(`/api/company/flights/${id}/passengers/`);
  return data as any[]; // твой TicketSerializer
}
