import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const mo = new MutationObserver(() =>
      setIsDark(root.classList.contains("dark"))
    );
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5
                 border border-black/10 bg-white text-slate-800 shadow-sm
                 hover:bg-slate-100
                 dark:border-white/20 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/20"
      title="Переключить тему"
    >
      <span>{isDark ? "🌙" : "☀️"}</span>
      <span className="text-sm">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
