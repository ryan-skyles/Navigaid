import { Outlet } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopNavBar />
      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-12">
          <Outlet />
        </div>
      </main>
      <Footer className="border-t border-slate-200/15" />
    </div>
  );
};

export default DashboardLayout;
