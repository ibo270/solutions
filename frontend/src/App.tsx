import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import { AuthProvider } from "./store/AuthContext";
import { ThemeProvider } from "./store/ThemeContext"; // ⬅️ добавили провайдер темы
import { ProtectedRoute, RoleRoute } from "./routes/guards";

import Landing from "./pages/Landing";
import SearchPage from "./pages/SearchPage";
import SchedulePage from "./pages/SchedulePage";
import ProfilePage from "./pages/ProfilePage";
import MyTickets from "./pages/MyTickets";
import CompanyDashboard from "./pages/CompanyDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>    {/* ⬅️ тема для всего приложения */}
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <NavBar />

            <main className="mx-auto max-w-6xl px-4 py-10 flex-1 w-full">
              <Routes>
                {/* публичные */}
                <Route path="/" element={<Landing />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/login" element={<Login />} />

                {/* только авторизованным */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute>
                      <MyTickets />
                    </ProtectedRoute>
                  }
                />

                {/* менеджер/админ */}
                <Route
                  path="/company"
                  element={
                    <RoleRoute roles={["COMPANY_MANAGER", "MANAGER", "ADMIN"]}>
                      <CompanyDashboard />
                    </RoleRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <footer className="text-center text-xs text-slate-600 dark:text-white/50 py-8">
              © {new Date().getFullYear()} Aurora Air
            </footer>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
