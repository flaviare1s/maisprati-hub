import { Outlet } from "react-router-dom";
import { Calendar } from "../components/Calendar";
import { useAuth } from "../hooks/useAuth";

export const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:px-6 my-auto overflow-x-hidden">
      <div className="flex flex-col-reverse md:flex-row gap-6 justify-center items-start">
        <div className="w-full md:w-[240px] order-2 md:order-1">
          <Calendar />
        </div>

        <div className="w-full md:flex-1 rounded-lg p-6 shadow-lg order-1 md:order-2 bg-light">
          <h1 className="text-2xl font-bold mb-4 text-dark">
            {user?.type === "admin" ? "Dashboard (Administrador)" : "Dashboard"}
          </h1>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
