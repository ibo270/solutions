import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, onClose, title, children }:{
  open:boolean; onClose:()=>void; title?:string; children:React.ReactNode
}){
  useEffect(()=>{ const h=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose() }
    if(open) document.addEventListener('keydown', h)
    return ()=> document.removeEventListener('keydown', h)
  }, [open, onClose])

  const root = document.getElementById('modal-root') as HTMLElement
  if(!root) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ scale: .95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: .98, opacity: 0, y: -4 }}
            transition={{ duration: .2 }}
            className="absolute left-1/2 top-20 -translate-x-1/2 w-[min(640px,calc(100vw-2rem))] rounded-2xl border bg-white p-5 shadow-xl"
          >
            {title && <div className="text-lg font-semibold mb-2">{title}</div>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    root
  )
}
