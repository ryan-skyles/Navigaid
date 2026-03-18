import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import WavyFooter from "./WavyFooter";

const AppLayout = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-background relative overflow-hidden">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center pt-20 overflow-y-auto">
        <div className="w-full max-w-[600px] px-4">
          <Outlet />
        </div>
        <WavyFooter />
      </main>
    </div>
  );
};

export default AppLayout;
