import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
export default function Register(){
  const nav = useNavigate(); const { register } = useAuth()
  const [u,setU]=useState(''); const [p,setP]=useState(''); const [e,setE]=useState('')
  return (
    <div className="max-w-sm mx-auto p-6 space-y-3 text-white">
      <h2 className="text-2xl font-semibold">Регистрация</h2>
      <input className="w-full border border-white/20 bg-white/80 text-slate-900 p-2 rounded" placeholder="Имя пользователя" value={u} onChange={e=>setU(e.target.value)} />
      <input className="w-full border border-white/20 bg-white/80 text-slate-900 p-2 rounded" placeholder="Email (опц.)" value={e} onChange={e=>setE(e.target.value)} />
      <input className="w-full border border-white/20 bg-white/80 text-slate-900 p-2 rounded" type="password" placeholder="Пароль" value={p} onChange={e=>setP(e.target.value)} />
      <button className="w-full bg-gradient-to-tr from-blue-600 to-indigo-500 rounded p-2" onClick={async()=>{ await register(u,p,e); nav('/') }}>Создать</button>
    </div>
  )
}
