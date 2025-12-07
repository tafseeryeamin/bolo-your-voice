import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import AgentConfig from "./pages/AgentConfig";
import CreateAgent from "./pages/CreateAgent";
import Admin from "./pages/Admin";
import AdminWidgets from "./pages/AdminWidgets";
import AdminPortfolio from "./pages/AdminPortfolio";
import Demos from "./pages/Demos";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/demos" element={<Demos />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agent-config/:id"
                element={
                  <ProtectedRoute>
                    <AgentConfig />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-agent"
                element={
                  <ProtectedRoute>
                    <CreateAgent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/widgets"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminWidgets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/portfolio"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPortfolio />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;