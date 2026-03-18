// frontend/src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.tsx";             // providers only
import "./index.css";

// Pages & layout
import AppLayout from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import SituationsPage from "./pages/SituationsPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/login.tsx";       // <— your new login page

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <BrowserRouter>
        <Routes>
          {/* Public route(s) */}
          <Route path="/login" element={<Login />} />

          {/* App routes wrapped by your layout */}
          <Route element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/situations" element={<SituationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Route>

          {/* Catch‑all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </App>
  </StrictMode>
);