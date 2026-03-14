import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Warehouses from "@/pages/Warehouses";
import Receipts from "@/pages/Receipts";
import Deliveries from "@/pages/Deliveries";
import Transfers from "@/pages/Transfers";
import Adjustments from "@/pages/Adjustments";
import MoveHistory from "@/pages/MoveHistory";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login"  element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/"       element={<Navigate to="/dashboard" replace />} />

            {/* Protected app */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard"   element={<Dashboard />} />
              <Route path="/products"    element={<Products />} />
              <Route path="/warehouses"  element={<Warehouses />} />
              <Route path="/receipts"    element={<Receipts />} />
              <Route path="/deliveries"  element={<Deliveries />} />
              <Route path="/transfers"   element={<Transfers />} />
              <Route path="/adjustments" element={<Adjustments />} />
              <Route path="/history"     element={<MoveHistory />} />
              <Route path="/settings"    element={<Settings />} />
              <Route path="/profile"     element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
