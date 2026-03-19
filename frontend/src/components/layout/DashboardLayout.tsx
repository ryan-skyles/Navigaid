import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import Footer from "./Footer";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <DashboardHeader onMenuToggle={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">
            <Outlet />
          </div>
        </main>
        <Footer className="border-t border-slate-200/15" />
      </div>
    </div>
  );
};

export default DashboardLayout;
