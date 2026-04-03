import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Activity, Home, Star, TrendingUp } from "lucide-react";
import CrosswalksList from "./pages/CrosswalksList";
import CrosswalkDetails from "./pages/CrosswalkDetails";
import Statistics from "./pages/Statistics";
import WatchlistPage from "./pages/WatchlistPage";
import NotFound from "./pages/NotFound";
import { WatchlistProvider } from "./context/WatchlistContext";
import "./App.css";
import "./index.css";

function Navigation() {
  const location = useLocation();

  const navLinkClass = (active) =>
    `flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition text-xs sm:text-base ${
      active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg sm:gap-3"
            aria-label="Go to home page"
          >
            <div className="rounded-lg bg-blue-600 p-1.5 sm:p-2">
              <Activity className="text-white" size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-gray-900 sm:text-xl">
                Smart Crosswalk
              </h1>
              <p className="text-xs text-gray-500">
                Favorite crossings and incidents overview
              </p>
            </div>
            <h1 className="text-base font-bold text-gray-900 sm:hidden">
              Smart Crosswalk
            </h1>
          </Link>

          <div className="flex gap-1 sm:gap-2">
            <Link to="/" className={navLinkClass(location.pathname === "/")}>
              <Home size={18} className="sm:h-[18px] sm:w-[18px]" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              to="/watchlist"
              className={navLinkClass(location.pathname.startsWith("/watchlist"))}
            >
              <Star size={18} className="sm:h-[18px] sm:w-[18px]" />
              <span className="hidden sm:inline">Watchlist</span>
            </Link>
            <Link
              to="/statistics"
              className={navLinkClass(location.pathname.startsWith("/statistics"))}
            >
              <TrendingUp size={18} className="sm:h-[18px] sm:w-[18px]" />
              <span className="hidden sm:inline">Statistics</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const wrap = (element) => (
    <Motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {element}
    </Motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={wrap(<CrosswalksList />)} />
        <Route path="/watchlist" element={wrap(<WatchlistPage />)} />
        <Route path="/crosswalks" element={<Navigate to="/" replace />} />
        <Route path="/crosswalk/:id" element={wrap(<CrosswalkDetails />)} />
        <Route path="/statistics" element={wrap(<Statistics />)} />
        <Route path="*" element={wrap(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <WatchlistProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex min-h-[calc(100vh-4rem)] flex-col sm:min-h-[calc(100vh-4.5rem)]">
            <div className="flex-1">
              <AnimatedRoutes />
            </div>
            <footer className="border-t border-slate-200 bg-white/95">
              <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  to="/"
                  className="font-semibold text-slate-700 transition hover:text-blue-600"
                >
                  Smart Crosswalk
                </Link>
                <div className="flex flex-wrap items-center gap-4">
                  <Link to="/" className="transition hover:text-blue-600">
                    Home
                  </Link>
                  <Link to="/watchlist" className="transition hover:text-blue-600">
                    Watchlist
                  </Link>
                  <Link to="/statistics" className="transition hover:text-blue-600">
                    Statistics
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </WatchlistProvider>
    </Router>
  );
}

export default App;
