import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "@/config/api";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import TagManager from "react-gtm-module";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import BrowseTutors from "./pages/BrowseTutors";
import TutorProfile from "./pages/TutorProfile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AIFutureSkills from "./pages/AIFutureSkills";
import AIFullCourseEnrollment from "./pages/AIFullCourseEnrollment";
import AIAssessment from "./pages/AIAssessment";
import Terms from "./pages/Terms";
import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterTutor from "./pages/RegisterTutor";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TutorDashboard from "./pages/dashboard/TutorDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";
import ApproveBooking from "./pages/ApproveBooking";
import TutorWelcome from "./pages/TutorWelcome";

const queryClient = new QueryClient();

function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "page_view",
        page_path: location.pathname,
      },
    });
  }, [location]);

  return null;
}

const App = () => {
  const [showNetworkAlert, setShowNetworkAlert] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // 1. Initial health check
    const checkHealth = async () => {
      try {
        await axios.get(`${API_URL}/health`);
        setShowNetworkAlert(false);
      } catch (error) {
        setShowNetworkAlert(true);
      }
    };
    checkHealth();

    // 2. Response interceptor for network/server failures
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response || error.response.status >= 500) {
          setShowNetworkAlert(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleRetry = async () => {
    setIsChecking(true);
    try {
      await axios.get(`${API_URL}/health`);
      setShowNetworkAlert(false);
    } catch (error) {
      // Keep showing warning
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        themes={[
          "light",
          "dark-midnight",
          "dark-oled",
          "dark-forest",
          "dark-purple",
          "dark-sunset",
          "dark-ocean",
          "dark-nordic",
          "dark-neon",
          "dark-sakura",
          "dark-mocha",
          "dark-crimson",
          "dark-nebula",
          "light-blue",
          "light-rose",
          "light-amber",
          "light-lavender",
          "light-slate",
          "dark-gold",
          "dark-coral",
          "dark-mint",
          "dark-indigo",
          "dark-steel"
        ]}
        enableSystem={false}
      >
        <TooltipProvider>
          {showNetworkAlert && (
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-xl animate-in slide-in-from-top-4 duration-300">
              <div className="bg-red-500/10 dark:bg-red-950/30 backdrop-blur-md border border-red-500/30 text-zinc-900 dark:text-zinc-100 p-4 rounded-xl shadow-[0_8px_32px_rgba(239,68,68,0.08)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 p-2 bg-red-500/20 text-red-500 rounded-lg">
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-650 dark:text-red-400">Connection Issue</h4>
                    <p className="text-xs text-zinc-650 dark:text-zinc-405">
                      The website is temporarily facing network issues. Please try again.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleRetry}
                    disabled={isChecking}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-650 hover:bg-red-700 disabled:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all duration-200 cursor-pointer"
                  >
                    {isChecking ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3 w-3" />
                    )}
                    <span>Try Again</span>
                  </button>
                  <button
                    onClick={() => setShowNetworkAlert(false)}
                    className="p-1.5 hover:bg-red-500/10 dark:hover:bg-red-500/20 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TrackPageViews />
            <AuthProvider>
              <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tutors" element={<BrowseTutors />} />
            <Route path="/tutors/:id" element={<TutorProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ai-program" element={<Navigate to="/" replace />} />
            <Route 
              path="/ai-program/enroll" 
              element={<Navigate to="/" replace />} 
            />
            <Route 
              path="/ai-program/take-assessment/:paymentId" 
              element={<Navigate to="/" replace />} 
            />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/student" element={<RegisterStudent />} />
            <Route path="/register/tutor" element={<RegisterTutor />} />
            <Route
              path="/dashboard/student"
              element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/tutor"
              element={<ProtectedRoute allowedRoles={["tutor"]}><TutorDashboard /></ProtectedRoute>}
            />
            <Route
              path="/tutor/welcome"
              element={<ProtectedRoute allowedRoles={["tutor"]}><TutorWelcome /></ProtectedRoute>}
            />
            <Route
              path="/dashboard/admin"
              element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
            />
            <Route path="/approve-booking/:bookingId" element={<ApproveBooking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
