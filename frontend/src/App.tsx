import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

type AppProps = { children?: ReactNode };

const App = ({ children }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* Global UI providers that should wrap the whole app */}
      <Toaster />
      <Sonner />
      {/* 👇 Important: render nested content (router) */}
      {children}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;