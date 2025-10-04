import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export type Role = "ADMIN" | "COMPANY_MANAGER" | "MANAGER" | "USER";

const norm = (r?: string | null) => (r ? r.toUpperCase() : null);

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="p-6 text-slate-200">Загрузка…</div>;

  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

export function RoleRoute({
  roles,
  children,
}: {
  roles: Role[];
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div className="p-6 text-slate-200">Загрузка…</div>;

  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  const isAdmin =
    user.is_superuser === true ||
    user.is_staff === true ||
    norm(user.role) === "ADMIN";

  if (isAdmin) return children;

  const r = norm(user.role);
  if (!r || !roles.map(norm).includes(r)) return <Navigate to="/" replace />;

  return children;
}
