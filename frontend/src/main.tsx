import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";

import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import SituationsPage from "./pages/SituationsPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/login.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <BrowserRouter>
        <Routes>
          {/* Public pages: top nav + footer */}
          <Route element={<PublicLayout />}>
            <Route index element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Dashboard pages: sidebar + header */}
          <Route element={<DashboardLayout />}>
            <Route path="/situations" element={<SituationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
<Route path="/results" element={<ResultsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </App>
  </StrictMode>
);
