import { lazy, Suspense, useEffect, type ComponentType, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
const Studio = lazy(() => import("./pages/Studio"));
const Service = lazy(() => import("./pages/Service"));
const PortfolioAudiovisual = lazy(() => import("./pages/PortfolioAudiovisual"));
const Explore = lazy(() => import("./pages/Explore"));
const Post = lazy(() => import("./pages/Post"));
const Profile = lazy(() => import("./pages/Profile"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Editor = lazy(() => import("./pages/Editor"));
const MediaLibrary = lazy(() => import("./pages/MediaLibrary"));
const Users = lazy(() => import("./pages/Users"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Links = lazy(() => import("./pages/Links"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = ({ Router = BrowserRouter }: { Router?: ComponentType<{ children?: ReactNode }> }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <Suspense fallback={<div className="min-h-screen bg-background" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/nosso-estudio" element={<Studio />} />
            <Route path="/links" element={<Links />} />
            <Route path="/servicos/:slug" element={<Service />} />
            <Route path="/portfolio/audiovisual" element={<PortfolioAudiovisual />} />
            <Route path="/portfolio/producao-audiovisual" element={<Navigate to="/portfolio/audiovisual" replace />} />
            <Route path="/portfolio" element={<Navigate to="/portfolio/audiovisual" replace />} />
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
          </Suspense>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
