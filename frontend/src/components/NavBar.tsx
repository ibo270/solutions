import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LoginModal from "./LoginModal";
import { Button } from "./UI";
import { me } from "../api/accounts";
import { logout } from "../api/auth";
import { bootstrapTokensFromStorage } from "../api/client";
import { useTheme } from "../store/ThemeContext";
import { Sun, Moon } from "lucide-react"; // если пакета нет — см. комментарий ниже

type User = {
  id: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
};

export default function NavBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    bootstrapTokensFromStorage();
    (async () => {
      try {
        setLoading(true);
        const u = await me();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function doLogout() {
    logout();
    setUser(null);
    nav("/");
  }

  const canAdmin = useMemo(
    () =>
      !!user &&
      (user.is_superuser ||
        user.is_staff ||
        (user.role ?? "").toUpperCase() === "ADMIN"),
    [user]
  );

  const canManager = useMemo(
    () =>
      !!user &&
      (canAdmin ||
        ["COMPANY_MANAGER", "MANAGER"].includes(
          (user.role ?? "").toUpperCase()
        )),
    [user, canAdmin]
  );

  const displayName =
    user?.username ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    (user ? `user#${user.id}` : "");

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "px-3 py-1.5 rounded-lg transition-colors",
      // светлая тема — еле заметная подсветка
      isActive ? "bg-black/5" : "hover:bg-black/5",
      // тёмная тема — привычная белая вуаль
      isActive ? "dark:bg-white/10" : "dark:hover:bg-white/10",
    ].join(" ");

  return (
    <>
      {/* Шапка со светлой/тёмной палитрой */}
      <div
        className={[
          "sticky top-0 z-30 backdrop-blur border-b",
          // light
          "bg-white/70 text-slate-900 border-black/10",
          // dark
          "dark:bg-slate-900/60 dark:text-white dark:border-white/10",
        ].join(" ")}
      >
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 grid place-items-center rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 shadow">
              ✈️
            </div>
            <div className="leading-tight">
              <div className="font-semibold">Aurora Air</div>
              <div className="text-[10px] uppercase opacity-70">
                BEYOND COMFORT
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 md:gap-2">
            <NavLink to="/search" className={linkClass}>
              Поиск
            </NavLink>
            <NavLink to="/tickets" className={linkClass}>
              Мои билеты
            </NavLink>
            <NavLink to="/schedule" className={linkClass}>
              Расписания
            </NavLink>
            {canManager && (
              <NavLink to="/company" className={linkClass}>
                Компания
              </NavLink>
            )}
            {canAdmin && (
              <a
                href="/admin/"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                admin
              </a>
            )}

            {/* Переключатель темы */}
            <button
              aria-label="Toggle theme"
              onClick={toggle}
              title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
              className={[
                "ml-1 md:ml-2 h-9 w-9 grid place-items-center rounded-xl border transition-colors",
                // light
                "border-black/10 bg-white/60 text-slate-700 hover:bg-white/80",
                // dark
                "dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
              ].join(" ")}
            >
              {/*
                Если lucide-react не установлен,
                замените на {theme === "dark" ? "☀️" : "🌙"}
              */}
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {loading ? (
              <span className="ml-1 md:ml-2 text-sm text-black/60 dark:text-white/70">
                Загрузка…
              </span>
            ) : !user ? (
              <Button className="ml-1 md:ml-2"> {/* открывает модалку */}
                <span onClick={() => setShowLogin(true)}>Войти</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1.5 md:gap-2 ml-1 md:ml-2">
                <NavLink
                  to="/profile"
                  className="px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  {displayName}
                </NavLink>
                <Button variant="ghost" onClick={doLogout}>
                  Выйти
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSuccess={(u: User) => {
            setUser(u);
            setShowLogin(false);
          }}
        />
      )}
    </>
  );
}
