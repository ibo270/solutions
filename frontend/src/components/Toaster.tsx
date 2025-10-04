import { useToast } from '../hooks/useToast'
import { motion, AnimatePresence } from 'framer-motion'

export default function Toaster(){
  const { items, remove } = useToast()
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {items.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: .2 }}
            className={`w-80 rounded-xl border p-3 backdrop-blur shadow
              ${t.type==='success' ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-50'
               : t.type==='error' ? 'bg-rose-500/20 border-rose-400/40 text-rose-50'
               : 'bg-white/10 border-white/20 text-white'}`}
            onClick={()=>remove(t.id)}
          >
            <div className="font-semibold">{t.title || (t.type==='success'?'Успешно':'Уведомление')}</div>
            {t.description && <div className="text-sm opacity-90">{t.description}</div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
