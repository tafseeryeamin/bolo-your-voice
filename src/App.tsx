import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import AdminPortfolio from "./pages/AdminPortfolio";
import AgentConfig from "./pages/AgentConfig";
import CreateAgent from "./pages/CreateAgent";
import AdminWidgets from "./pages/AdminWidgets";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingElements from "./components/FloatingElements";

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <FloatingElements />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/sign-in" element={<SignIn />} />
            
            <Route path="/admin" element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agents" element={
              <ProtectedRoute>
                <CreateAgent />
              </ProtectedRoute>
            } />
            <Route path="/create-agent" element={
              <ProtectedRoute>
                <CreateAgent />
              </ProtectedRoute>
            } />
            <Route path="/agent-config" element={
              <ProtectedRoute>
                <AgentConfig />
              </ProtectedRoute>
            } />
            {/* Removed testing and embedding routes */}
            <Route path="/demo-testing" element={
              <ProtectedRoute>
                <AdminWidgets />
              </ProtectedRoute>
            } />
            <Route path="/widget-generator" element={
              <ProtectedRoute>
                <AdminWidgets />
              </ProtectedRoute>
            } />
            <Route path="/admin/widgets" element={
              <ProtectedRoute>
                <AdminWidgets />
              </ProtectedRoute>
            } />
            <Route path="/admin/portfolio" element={
              <ProtectedRoute>
                <AdminPortfolio />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
