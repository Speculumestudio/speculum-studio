import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({
  children, requireAdmin = false, requireContributor = false,
}: { children: React.ReactNode; requireAdmin?: boolean; requireContributor?: boolean }) => {
  const { user, loading, isAdmin, isContributor } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireContributor && !isContributor) return <Navigate to="/" replace />;
  return <>{children}</>;
};
