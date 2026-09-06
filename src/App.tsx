import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Studio from "./pages/Studio";
import Service from "./pages/Service";
import Explore from "./pages/Explore";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import MediaLibrary from "./pages/MediaLibrary";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/nosso-estudio" element={<Studio />} />
            <Route path="/servicos/:slug" element={<Service />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute requireContributor><Dashboard /></ProtectedRoute>} />
            <Route path="/editor" element={<ProtectedRoute requireContributor><Editor /></ProtectedRoute>} />
            <Route path="/editor/:id" element={<ProtectedRoute requireContributor><Editor /></ProtectedRoute>} />
            <Route path="/media" element={<ProtectedRoute requireContributor><MediaLibrary /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute requireAdmin><Users /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
