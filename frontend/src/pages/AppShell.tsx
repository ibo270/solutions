import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function AppShell(){
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-slate-600 dark:text-white/50 py-8">
        © {new Date().getFullYear()} Aurora Air
      </footer>
    </div>
  );
}
