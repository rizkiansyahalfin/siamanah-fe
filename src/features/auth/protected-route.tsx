import { Navigate } from "react-router-dom";
import { useMe } from "./auth.hooks";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
