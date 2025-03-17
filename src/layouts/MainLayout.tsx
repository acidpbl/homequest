import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col text-white">
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
