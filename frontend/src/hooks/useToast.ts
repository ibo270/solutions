import { create } from 'zustand'
export type Toast = { id: string; title?: string; description?: string; type?: 'success'|'error'|'info' }
type S = { items: Toast[]; push: (t: Omit<Toast,'id'>) => void; remove: (id:string)=>void }

export const useToast = create<S>((set)=> ({
  items: [],
  push: (t) => set(s => ({ items: [...s.items, { id: crypto.randomUUID?.() || String(Date.now()+Math.random()), ...t }] })),
  remove: (id) => set(s => ({ items: s.items.filter(x => x.id !== id) }))
}))
