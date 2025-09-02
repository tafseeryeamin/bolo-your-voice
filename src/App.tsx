import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Pricing from "./pages/Pricing";
import AgentConfig from "./pages/AgentConfig";
import CreateAgent from "./pages/CreateAgent";
import TestAgent from "./pages/TestAgent";
import DemoTesting from "./pages/DemoTesting";
import WidgetGenerator from "./pages/WidgetGenerator";
import ElevenPreview from "./pages/ElevenPreview";
import AdminWidgets from "./pages/AdminWidgets";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingElements from "./components/FloatingElements";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FloatingElements />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-in/pricing" element={<Pricing />} />
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
          <Route path="/test-agent" element={
            <ProtectedRoute>
              <TestAgent />
            </ProtectedRoute>
          } />
          <Route path="/agent-config" element={
            <ProtectedRoute>
              <AgentConfig />
            </ProtectedRoute>
          } />
          <Route path="/demo-testing" element={
            <ProtectedRoute>
              <DemoTesting />
            </ProtectedRoute>
          } />
          <Route path="/widget-generator" element={
            <ProtectedRoute>
              <WidgetGenerator />
            </ProtectedRoute>
          } />
          <Route path="/preview/eleven" element={
            <ProtectedRoute>
              <ElevenPreview />
            </ProtectedRoute>
          } />
          <Route path="/admin/widgets" element={
            <ProtectedRoute>
              <AdminWidgets />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
