import { useState } from "react";
import { login } from "../api/auth";       // только login из auth
import { me } from "../api/accounts";      // me из accounts
import { Button, Card } from "./UI";

type Props = {
  onClose: () => void;
  onSuccess: (u: any) => void;
};

export default function LoginModal({ onClose, onSuccess }: Props) {
  const [u, setU] = useState("");          // email/username
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(u, p);                    // получаем токены и кладём их в storage (внутри login)
      const profile = await me();           // тянем профиль
      if (!profile) throw new Error("Профиль не найден");
      onSuccess(profile);                   // поднимем в Navbar
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e?.message || "Неверные данные или сервер недоступен");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 grid place-items-center bg-black/40 z-50">
      <Card className="w-[92vw] max-w-md p-5">
        <h2 className="text-lg font-semibold mb-4 text-white">Вход</h2>

        {err && (
          <div className="mb-3 text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs text-white/70 mb-1">Email / логин</label>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              className="w-full rounded-lg bg-slate-800/60 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs text-white/70 mb-1">Пароль</label>
            <input
              value={p}
              onChange={(e) => setP(e.target.value)}
              type="password"
              className="w-full rounded-lg bg-slate-800/60 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading || !u || !p}>
              {loading ? "Входим…" : "Войти"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
