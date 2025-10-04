type Props = {
  price: [number,number],
  setPrice: (v:[number,number])=>void,
  stops: number|null,
  setStops: (n:number|null)=>void,
  airline: string,
  setAirline: (s:string)=>void
};
export default function FilterBar({price,setPrice,stops,setStops,airline,setAirline}:Props){
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 p-4 grid md:grid-cols-4 gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm dark:text-white/80">Цена:</span>
        <input type="number" className="w-20 rounded-lg border p-1 dark:bg-white/10 dark:border-white/15 dark:text-white" value={price[0]} onChange={e=>setPrice([+e.target.value,price[1]])}/>
        <span className="text-slate-500 dark:text-white/60">—</span>
        <input type="number" className="w-20 rounded-lg border p-1 dark:bg-white/10 dark:border-white/15 dark:text-white" value={price[1]} onChange={e=>setPrice([price[0],+e.target.value])}/>
      </div>
      <select className="rounded-lg border p-2 dark:bg-white/10 dark:border-white/15 dark:text-white" value={stops ?? ""} onChange={e=>setStops(e.target.value===""?null:+e.target.value)}>
        <option value="">Любые пересадки</option>
        <option value="0">Без пересадок</option>
        <option value="1">1 пересадка</option>
        <option value="2">2+ пересадки</option>
      </select>
      <input className="rounded-lg border p-2 dark:bg-white/10 dark:border-white/15 dark:text-white" placeholder="Авиакомпания" value={airline} onChange={e=>setAirline(e.target.value)} />
    </div>
  );
}
