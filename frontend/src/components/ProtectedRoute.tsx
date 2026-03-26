import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { getStoredUser, clearStoredUser } from "@/utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/me?clientId=${user.clientId}`)
      .then((res) => {
        if (res.status === 404 || res.status === 400) {
          clearStoredUser();
          navigate("/login", { replace: true });
        } else {
          setReady(true);
        }
      })
      .catch(() => {
        // Server unreachable — allow access, individual pages will handle errors
        setReady(true);
      });
  }, [navigate]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
