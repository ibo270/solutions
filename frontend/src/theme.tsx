import { create } from 'zustand'
import { useEffect } from 'react'

type Theme = 'light'|'dark'
type S = { theme: Theme; toggle: ()=>void; set: (t:Theme)=>void }

export const useTheme = create<S>((set)=> ({
  theme: 'dark',
  toggle: ()=> set(s => ({ theme: s.theme==='dark' ? 'light' : 'dark' })),
  set: (t)=> set({ theme: t })
}))

export function ThemeEffect(){
  const { theme } = useTheme()
  useEffect(()=> {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', theme) } catch {}
  }, [theme])
  return null
}
