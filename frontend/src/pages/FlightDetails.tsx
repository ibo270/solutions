import { useParams, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Badge from '../components/Badge'
import PriceTag from '../components/PriceTag'
import { PROMO_CODES, calcDiscount, inferAutoDiscount, formatPrice } from '../utils/price'
import Modal from '../components/Modal'
import { useToast } from '../hooks/useToast'

type Flight = { id:number; company:string; flight_no:string; origin:string; destination:string; departure_at:string; arrival_at:string; base_price:string; seats_available:number }
const getCachedFlights = ():Flight[] => JSON.parse(sessionStorage.getItem('flights_cache')||'[]')

export default function FlightDetails(){
  const { id } = useParams()
  const nav = useNavigate()
  const { push } = useToast()
  const flights = getCachedFlights()
  const flight = flights.find(f => String(f.id) === id)
  const [promo,setPromo] = useState('')
  const [openRules, setOpenRules] = useState(false)
  const promoPct = PROMO_CODES[promo.toUpperCase()] || 0
  const autoPct = inferAutoDiscount(flight?.seats_available || 0) || 0
  const base = flight ? parseFloat(flight.base_price) : 0
  const discountPct = Math.max(autoPct, promoPct)
  const { final } = calcDiscount(base, discountPct)

  const duration = useMemo(()=>{
    if(!flight) return ''
    const m = Math.max(0, Math.round((+new Date(flight.arrival_at) - +new Date(flight.departure_at))/60000))
    return `${Math.floor(m/60)}ч ${m%60}м`
  },[flight])

  if(!flight){
    return (
      <div className="p-6 text-white">
        <div className="p-4 rounded-xl border border-white/20 bg-white/10">Рейс не найден</div>
        <button className="mt-3 px-3 py-2 border rounded-xl text-white" onClick={()=>nav(-1)}>Назад</button>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{flight.origin} → {flight.destination} <span className="text-white/60 text-base">({flight.flight_no})</span></h1>
        <Badge tone={flight.seats_available<=3? 'amber':'blue'}>{flight.seats_available} мест</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-3xl border border-white/20 bg-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70">{flight.company} · {flight.flight_no}</div>
              <div className="text-lg font-semibold">{new Date(flight.departure_at).toLocaleString()} — {new Date(flight.arrival_at).toLocaleString()}</div>
              <div className="text-sm text-white/70">В пути {duration}</div>
            </div>
            <Badge tone="green">Багаж 1×23кг</Badge>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-white/10 border border-white/10"><div className="text-white/60">Самолёт</div><div className="font-medium">Airbus A321 (neo)</div></div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/10">
              <div className="text-white/60">Тариф</div>
              <div className="font-medium">Smart <button onClick={()=>setOpenRules(true)} className="underline">условия</button></div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/10"><div className="text-white/60">Wi-Fi</div><div className="font-medium">Безлимит мессенджеры</div></div>
            <div className="p-4 rounded-xl bg-white/10 border border-white/10"><div className="text-white/60">Питание</div><div className="font-medium">Chef Menu</div></div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-white/20 bg-white/10">
          <div className="mb-2 text-sm text-white/70">Стоимость</div>
          <PriceTag base={base} percent={discountPct||undefined} />

          <div className="mt-4">
            <label className="text-sm text-white/80">Промокод</label>
            <div className="mt-1 flex gap-2">
              <input className="flex-1 border border-white/20 rounded-xl px-3 py-2 bg-white/80 text-slate-900"
                     placeholder="AURORA15" value={promo} onChange={e=>setPromo(e.target.value)} />
              <button className="px-3 py-2 rounded-xl border border-white/20"
                      onClick={()=>setPromo(promo.toUpperCase().trim())}>Применить</button>
            </div>
            <div className="text-xs text-white/60 mt-1">AURORA15 (15%), SKY10 (10%), STUDENT7 (7%)</div>
          </div>

          <button className="mt-5 w-full bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl py-3 font-semibold"
            onClick={()=> push({ type:'success', title:'Оплата (демо)', description:`Списано ${formatPrice(final)}. Билет в разделе «Мои билеты».` }) }>
            Купить за {formatPrice(final)}
          </button>
        </div>
      </div>

      <Modal open={openRules} onClose={()=>setOpenRules(false)} title="Условия тарифа Smart">
        <ul className="list-disc pl-5 space-y-1 text-slate-700">
          <li>Перенос даты — 1 раз бесплатно при разнице класса/тарифа с доплатой.</li>
          <li>Возврат — до 24 часов до вылета с удержанием 20%.</li>
          <li>Места у аварийных выходов — по запросу, доплата 20$.</li>
          <li>Изменение имени — не допускается.</li>
        </ul>
        <div className="mt-4 flex justify-end">
          <button className="px-3 py-1.5 rounded-xl border" onClick={()=>setOpenRules(false)}>Понятно</button>
        </div>
      </Modal>
    </div>
  )
}
