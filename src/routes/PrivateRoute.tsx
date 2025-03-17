import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import Sidebar from "@/components/Sidebar";

const PrivateRoute = () => {
  const { user } = useAuth();

  return user ? (
    <div className="flex">
      <Sidebar />
      <main className="size-full">
        <Outlet />
      </main>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
