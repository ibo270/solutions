import { api } from "./client";

/** ===== Типы ===== */
export type Ticket = {
  id: number;
  confirmation_id: string;
  status: string;
  price?: number | string;
  flight: {
    id?: number;
    origin: string;
    destination: string;
    departure_at?: string;
    arrival_at?: string;
    flight_no?: string | number;
    company_code?: string;
  };
};

/** ===== Вспомогалки ===== */
type Raw = Record<string, any>;

function isArray(x: any): x is any[] {
  return Array.isArray(x);
}
function pickArray(data: any): Raw[] {
  if (isArray(data)) return data as Raw[];
  if (isArray(data?.results)) return data.results as Raw[];
  if (isArray(data?.items)) return data.items as Raw[];
  if (isArray(data?.data)) return data.data as Raw[];
  return [];
}
function n(v: any): number | undefined {
  const num = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(num) ? Number(num) : undefined;
}

/** Нормализация тикета в единую форму */
function normalizeTicket(x: Raw): Ticket | null {
  if (!x) return null;
  const id = x.id ?? x.pk;
  const confirmation =
    x.confirmation_id ??
    x.confirmationId ??
    x.code ??
    x.number ??
    x.uuid ??
    x.reference;
  const status =
    x.status ??
    x.state ??
    x.ticket_status ??
    x.payment_status ??
    "unknown";

  // flight может лежать целиком или быть «плоским» в полях тикета
  const f: Raw =
    x.flight ??
    x.flight_data ??
    x.flightInfo ??
    {
      id: x.flight_id ?? x.flightId,
      origin: x.origin ?? x.from ?? x.departure_city,
      destination: x.destination ?? x.to ?? x.arrival_city,
      departure_at:
        x.departure_at ?? x.departureAt ?? x.departure_time ?? x.departure_datetime,
      arrival_at:
        x.arrival_at ?? x.arrivalAt ?? x.arrival_time ?? x.arrival_datetime,
      flight_no: x.flight_no ?? x.flightNo ?? x.number,
      company_code: x.company_code ?? x.airline_code ?? x.company,
    };

  const origin = f.origin ?? f.from ?? f.departure_city;
  const destination = f.destination ?? f.to ?? f.arrival_city;

  if (id == null || !origin || !destination) return null;

  return {
    id: Number(id),
    confirmation_id: String(confirmation ?? id),
    status: String(status),
    price: x.price ?? x.total ?? x.amount ?? x.base_price,
    flight: {
      id: n(f.id),
      origin: String(origin),
      destination: String(destination),
      departure_at:
        f.departure_at ??
        f.departureAt ??
        f.departure_time ??
        f.departure_datetime,
      arrival_at:
        f.arrival_at ?? f.arrivalAt ?? f.arrival_time ?? f.arrival_datetime,
      flight_no: f.flight_no ?? f.flightNo ?? f.number,
      company_code: f.company_code ?? f.airline_code ?? f.company,
    },
  };
}

/** ===== Поисковые кандидаты путей ===== */
// список «моих билетов»
const TICKETS_ME = [
  "/api/tickets/my/",
  "/api/tickets/me/",
  "/api/user/tickets/",
  "/api/users/tickets/",
  "/api/airlines/tickets/my/",
  "/api/v1/tickets/my/",
  "/api/tickets/",
];

// покупка
const TICKETS_BUY = [
  "/api/tickets/buy/",
  "/api/airlines/tickets/buy/",
  "/api/v1/tickets/buy/",
  "/api/tickets/create/",
  "/api/tickets/",
];

// отмена
const TICKET_CANCEL_PATTERNS = [
  (id: number) => `/api/tickets/${id}/cancel/`,
  (id: number) => `/api/airlines/tickets/${id}/cancel/`,
  (id: number) => `/api/v1/tickets/${id}/cancel/`,
  (id: number) => `/api/tickets/${id}/`,
];

/** Кеш найденных удачных путей, чтобы не перебором каждый раз */
let RESOLVED_LIST: string | null = null;
let RESOLVED_BUY: string | null = null;
let RESOLVED_CANCEL: ((id: number) => string) | null = null;

/** ===== API ===== */

/** Список моих билетов (пытается определить корректный URL) */
export async function getMyTickets(): Promise<Ticket[]> {
  // если уже нашли подходящий базовый — используем его
  if (RESOLVED_LIST) {
    const { data } = await api.get(RESOLVED_LIST);
    return pickArray(data).map(normalizeTicket).filter(Boolean) as Ticket[];
  }

  // Иначе идём по списку кандидатов
  for (const url of TICKETS_ME) {
    try {
      const { data } = await api.get(url);
      const arr = pickArray(data).map(normalizeTicket).filter(Boolean) as Ticket[];
      if (arr) {
        RESOLVED_LIST = url;
        if (import.meta.env.DEV) console.info("[tickets] using", url, `(${arr.length})`);
        return arr;
      }
    } catch {
      // try next
    }
  }
  throw new Error("Не удалось получить список билетов: ни один из известных URL не отвечает.");
}

/** Купить билет по id рейса */
export async function buyTicket(flightId: number) {
  const payloads = [
    { flight_id: flightId },
    { flight: flightId },
    { flightId },
  ];

  async function tryBuy(url: string) {
    for (const p of payloads) {
      try {
        const { data } = await api.post(url, p);
        return data;
      } catch {
        // try another payload
      }
    }
    // некоторые backends принимают body пустым и flightId в query
    try {
      const { data } = await api.post(url + `?flight_id=${flightId}`);
      return data;
    } catch {
      /* ignore */
    }
    throw new Error("buy failed");
  }

  // если уже знаем удачный путь — пробуем сначала его
  if (RESOLVED_BUY) {
    return tryBuy(RESOLVED_BUY);
  }

  for (const url of TICKETS_BUY) {
    try {
      const res = await tryBuy(url);
      RESOLVED_BUY = url;
      if (import.meta.env.DEV) console.info("[tickets.buy] using", url);
      return res;
    } catch {
      // try next
    }
  }
  throw new Error("Не удалось купить билет: ни один из известных URL не принял запрос.");
}

/** Отмена билета */
export async function cancelTicket(id: number) {
  // Уже обнаруженный удачный паттерн:
  if (RESOLVED_CANCEL) {
    try {
      const url = RESOLVED_CANCEL(id);
      // чаще всего POST; но встречаются PATCH с {status:'cancelled'} и DELETE
      try {
        const { data } = await api.post(url, {});
        return data;
      } catch {
        try {
          const { data } = await api.patch(url, { status: "cancelled" });
          return data;
        } catch {
          const { data } = await api.delete(url);
          return data;
        }
      }
    } catch {
      // сбросим и попробуем подобрать заново
      RESOLVED_CANCEL = null;
    }
  }

  // Подбираем паттерн
  for (const build of TICKET_CANCEL_PATTERNS) {
    const url = build(id);
    try {
      try {
        const { data } = await api.post(url, {});
        RESOLVED_CANCEL = build;
        if (import.meta.env.DEV) console.info("[tickets.cancel] using POST", url.replace(String(id), ":id"));
        return data;
      } catch {
        try {
          const { data } = await api.patch(url, { status: "cancelled" });
          RESOLVED_CANCEL = build;
          if (import.meta.env.DEV) console.info("[tickets.cancel] using PATCH", url.replace(String(id), ":id"));
          return data;
        } catch {
          const { data } = await api.delete(url);
          RESOLVED_CANCEL = build;
          if (import.meta.env.DEV) console.info("[tickets.cancel] using DELETE", url.replace(String(id), ":id"));
          return data;
        }
      }
    } catch {
      // try next pattern
    }
  }

  throw new Error(`Не удалось отменить билет id=${id}`);
}
