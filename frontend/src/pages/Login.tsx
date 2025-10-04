import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get("next") || "/";

  const { login } = useAuth();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setErr(null); setLoading(true);
    try { await login(u, p); nav(next, { replace: true }); }
    catch (e: any) { setErr(e?.response?.data?.detail || e?.message || "Не удалось войти"); }
    finally { setLoading(false); }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && u && p && !loading) handle();
  };

  return (
    <div className="max-w-sm mx-auto p-6 space-y-3 text-white">
      <h2 className="text-2xl font-semibold">Войти</h2>
      {err && <div className="text-red-400 text-sm">{err}</div>}
      <input className="w-full border border-white/20 bg-white/80 text-slate-900 p-2 rounded"
             placeholder="Email / логин" value={u} onChange={e=>setU(e.target.value)} onKeyDown={onKey} autoFocus />
      <input className="w-full border border-white/20 bg-white/80 text-slate-900 p-2 rounded"
             type="password" placeholder="Пароль" value={p} onChange={e=>setP(e.target.value)} onKeyDown={onKey} />
      <button className="w-full bg-gradient-to-tr from-blue-600 to-indigo-500 rounded p-2 disabled:opacity-50"
              onClick={handle} disabled={!u || !p || loading}>
        {loading ? "Входим…" : "Войти"}
      </button>
      <div className="text-sm text-white/70">
        Нет аккаунта? <Link className="underline" to="/register">Регистрация</Link>
      </div>
    </div>
  );
}
