import { Navigate, Outlet } from "react-router-dom";

function useAuth() {
  const stored = localStorage.getItem("sia-investor-session");
  if (!stored) return { isAuthenticated: false, role: null };
  try {
    const session = JSON.parse(stored);
    // Require a token (from Google OAuth or Mujarrad)
    if (!session.token) return { isAuthenticated: false, role: null };
    return { isAuthenticated: true, role: session.role as string };
  } catch {
    return { isAuthenticated: false, role: null };
  }
}

export function ProtectedRoute({ requiredRole }: { requiredRole: string }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || role !== requiredRole) {
    return <Navigate to="/investor/login" replace />;
  }

  return <Outlet />;
}
