import { Outlet } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <TopNavBar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
