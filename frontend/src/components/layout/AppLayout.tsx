import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import WavyFooter from "./WavyFooter";

const AppLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background relative">
      <AppHeader />
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-[600px] px-4">
          <Outlet />
        </div>
      </main>
      <WavyFooter />
    </div>
  );
};

export default AppLayout;
