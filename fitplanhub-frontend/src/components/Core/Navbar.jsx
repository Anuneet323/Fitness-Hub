// src/components/Core/Navbar.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Dumbbell, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function OrangeNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => authService.getCurrentUser());
  const isLoggedIn = !!user;

  const [activeTab, setActiveTab] = useState("Home");
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/plans")) setActiveTab("Plans");
    else if (location.pathname.startsWith("/login")) setActiveTab("Login");
    else setActiveTab("Home");
  }, [location.pathname]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const avatarUrl = user?.avatarUrl; // adjust if your backend uses another field

  const handleNavClick = (name, url) => {
    setActiveTab(name);
    navigate(url);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setOpenMenu(false);
    navigate("/login");
  };

  const handleDashboard = () => {
    const role = user?.role === "trainer" ? "trainer" : "user";
    const path = role === "trainer" ? "/trainer-dashboard" : "/user-dashboard";
    setOpenMenu(false);
    navigate(path);
  };

  return (
    <div className="fixed bottom-4 sm:top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/70 backdrop-blur-lg py-1 px-1 rounded-full shadow-[0_18px_45px_rgba(15,23,42,0.8)]">
        {/* Left nav items */}
        <div className="flex items-center gap-2">
          <NavButton
            name="Home"
            icon={Home}
            isActive={activeTab === "Home"}
            onClick={() => handleNavClick("Home", "/")}
          />
          <NavButton
            name="Plans"
            icon={Dumbbell}
            isActive={activeTab === "Plans"}
            onClick={() => handleNavClick("Plans", "/plans")}
          />
        </div>

        {/* Divider dot */}
        <span className="w-1 h-1 rounded-full bg-slate-500/80" />

        {/* Right side */}
        <div className="relative flex items-center gap-2">
          {!isLoggedIn ? (
            <NavButton
              name="Login"
              icon={LogIn}
              isActive={activeTab === "Login"}
              onClick={() => handleNavClick("Login", "/login")}
            />
          ) : (
            <>
              {/* Avatar trigger */}
              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-600 bg-slate-800 flex items-center justify-center shadow-sm"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-semibold text-slate-100">
                    {initials}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {openMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-11 w-40 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-xl backdrop-blur-xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="w-full text-left px-3 py-2 text-xs text-slate-100 hover:bg-slate-800/80"
                    >
                      Dashboard
                    </button>
                    <div className="h-px bg-slate-700/70" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-300 hover:bg-red-500/15"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NavButton({ name, icon: Icon, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors",
        "text-slate-200/80 hover:text-white",
        isActive && "bg-orange-500 text-white shadow-md"
      )}
    >
      <span className="hidden md:inline">{name}</span>
      <span className="md:hidden">
        <Icon size={18} strokeWidth={2.5} />
      </span>

      {isActive && (
        <motion.div
          layoutId="lamp"
          className="absolute inset-0 w-full rounded-full -z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-orange-400 rounded-t-full">
            <div className="absolute w-12 h-6 bg-orange-400/30 rounded-full blur-md -top-2 -left-2" />
            <div className="absolute w-8 h-6 bg-orange-400/25 rounded-full blur-md -top-1" />
            <div className="absolute w-4 h-4 bg-orange-400/30 rounded-full blur-sm top-0 left-2" />
          </div>
        </motion.div>
      )}
    </button>
  );
}
