// src/components/Core/Navbar.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Dumbbell, LogIn, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const buttonVariants = {
  initial: {
    gap: 0,
  },
  animate: (isSelected) => ({
    gap: isSelected ? 6 : 0,
  }),
};

const labelVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.05, type: "spring", bounce: 0, duration: 0.35 };

export function OrangeNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => authService.getCurrentUser());
  const isLoggedIn = !!user;

  const [activeTab, setActiveTab] = useState("Home");
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/plans")) setActiveTab("Plans");
    else if (location.pathname.startsWith("/how-to-use")) setActiveTab("How");
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

  const avatarUrl = user?.avatarUrl;

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
      <div className="flex items-center gap-3 rounded-full border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-2 py-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.8)]">
        {/* Left nav items */}
        <div className="flex items-center gap-1.5">
          <NavTab
            name="Home"
            icon={Home}
            isActive={activeTab === "Home"}
            onClick={() => handleNavClick("Home", "/")}
          />
          <NavTab
            name="Plans"
            icon={Dumbbell}
            isActive={activeTab === "Plans"}
            onClick={() => handleNavClick("Plans", "/plans")}
          />
          <NavTab
            name="How"
            icon={HelpCircle}
            isActive={activeTab === "How"}
            onClick={() => handleNavClick("How", "/how-to-use")}
          />
        </div>

        {/* Divider */}
        <span className="mx-1.5 h-5 w-px bg-slate-800/80" />

        {/* Right side */}
        <div className="relative flex items-center gap-1.5">
          {!isLoggedIn ? (
            <NavTab
              name="Login"
              icon={LogIn}
              isActive={activeTab === "Login"}
              onClick={() => handleNavClick("Login", "/login")}
            />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setOpenMenu((v) => !v)}
                className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center shadow-sm"
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

              <AnimatePresence>
                {openMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-11 w-40 rounded-2xl bg-slate-950/95 border border-slate-800 shadow-xl backdrop-blur-2xl overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={handleDashboard}
                      className="w-full text-left px-3 py-2 text-xs text-slate-100 hover:bg-slate-900"
                    >
                      Dashboard
                    </button>
                    <div className="h-px bg-slate-800" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-xs text-red-300 hover:bg-red-500/10"
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

function NavTab({ name, icon: Icon, isActive, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={buttonVariants}
      initial="initial"
      animate="animate"
      custom={isActive}
      transition={transition}
      className={cn(
        "relative flex items-center rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-colors",
        "text-slate-300 hover:text-white",
        "hover:bg-slate-800/70",
        isActive && "bg-slate-900 text-white"
      )}
    >
      <Icon size={18} strokeWidth={2.4} />
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.span
            variants={labelVariants}
            className="ml-2 overflow-hidden"
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
          >
            {name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
