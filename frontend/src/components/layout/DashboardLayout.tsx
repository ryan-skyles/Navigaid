import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <TopNavBar onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <div className="flex pt-20">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 lg:ml-64 flex flex-col min-h-[calc(100vh-5rem)]">
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">
              <Outlet />
            </div>
          </main>
          <Footer className="border-t border-slate-200/15" />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
