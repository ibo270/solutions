import { calcDiscount, formatPrice } from '../utils/price'
export default function PriceTag({base,percent}:{base:number;percent?:number}){
  const { final, saved } = calcDiscount(base, percent)
  return (
    <div className="text-right">
      {percent ? (
        <div className="space-y-0.5">
          <div className="text-slate-400 line-through text-sm">{formatPrice(base)}</div>
          <div className="text-2xl font-bold">{formatPrice(final)}</div>
          <div className="text-xs text-emerald-500">−{percent}% · вы экономите {formatPrice(saved)}</div>
        </div>
      ) : (
        <div className="text-2xl font-bold">{formatPrice(base)}</div>
      )}
    </div>
  )
}
