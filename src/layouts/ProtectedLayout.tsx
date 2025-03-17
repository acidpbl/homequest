import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const ProtectedLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="size-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
