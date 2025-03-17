import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import Sidebar from "@/components/Sidebar";

const AdminRoute = () => {
  const { user } = useAuth();

  return user && user.isAdmin ? (
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

export default AdminRoute;
