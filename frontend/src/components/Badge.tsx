export default function Badge({children,tone='glass'}:{children:React.ReactNode; tone?:'glass'|'green'|'blue'|'amber'}){
  const map:any = {
    glass:'bg-white/10 text-white border-white/20',
    green:'bg-emerald-100 text-emerald-700',
    blue:'bg-blue-100 text-blue-700',
    amber:'bg-amber-100 text-amber-700'
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${map[tone]}`}>{children}</span>
}
