// src/components/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Dumbbell,
  Home,
  BarChart2,
  Users,
  MessageCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  User as UserIcon,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../../services/authService";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const sidebarItems = {
  user: [
    { label: "Overview", path: "/user-dashboard", icon: Home },
    { label: "My Plans", path: "/user-dashboard/plans", icon: Dumbbell },
    {
      label: "Subscriptions",
      path: "/user-dashboard/subscriptions",
      icon: Dumbbell,
    },
    { label: "Progress", path: "/user-dashboard/progress", icon: BarChart2 },
    {
      label: "Trainers",
      path: "/user-dashboard/trainers",
      icon: Users,
    },
    {
      label: "Community",
      path: "/user-dashboard/community",
      icon: MessageCircle,
    },
    { label: "Profile", path: "/dashboard/profile", icon: UserIcon },
    {
      label: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
    },
  ],
  trainer: [
    { label: "Overview", path: "/trainer-dashboard", icon: Home },
    { label: "My Plans", path: "/trainer-dashboard/plans", icon: Dumbbell },
    { label: "Clients", path: "/trainer-dashboard/clients", icon: Users },
    { label: "Progress", path: "/trainer-dashboard/progress", icon: BarChart2 },
    {
      label: "Community",
      path: "/trainer-dashboard/community",
      icon: MessageCircle,
    },
    { label: "Profile", path: "/dashboard/profile", icon: UserIcon },
    {
      label: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
    },
  ],
};

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const [expanded, setExpanded] = useState(true); // desktop width
  const [mobileOpen, setMobileOpen] = useState(false); // mobile drawer

  if (!user) {
    navigate("/login");
    return null;
  }

  const role = user.role === "trainer" ? "trainer" : "user";
  const items = sidebarItems[role];

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const SidebarContent = (
    <>
      {/* Brand & toggle row */}
      <div className="flex items-center justify-between gap-2 px-4 py-4 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="brand-text"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap"
              >
                <p className="text-sm font-semibold tracking-tight text-slate-900">
                  FitPlanHub
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-orange-500">
                  {role === "trainer" ? "Trainer Dashboard" : "User Dashboard"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse/expand button (desktop only) */}
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <motion.span
            key={expanded ? "chevron-left" : "chevron-right"}
            initial={{ opacity: 0, x: expanded ? 6 : -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: expanded ? -6 : 6 }}
            transition={{ duration: 0.15 }}
          >
            {expanded ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </motion.span>
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={cn(
                "group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "text-slate-600 hover:text-slate-900 hover:bg-orange-50",
                isActive &&
                  "bg-orange-100 text-orange-700 border border-orange-300"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.16 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-3 border-t border-orange-100 bg-orange-50/60 flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-xs font-semibold text-white shadow">
          {initials}
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="user-info"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.16 }}
              className="min-w-0 flex-1"
            >
              <p className="text-xs font-semibold truncate text-slate-900">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user.email}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={handleLogout}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-orange-100 text-slate-500 hover:text-orange-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-orange-50 text-slate-900">
      {/* Sidebar desktop */}
      <motion.aside
        animate={{ width: expanded ? 260 : 80 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="hidden md:flex flex-col border-r border-orange-100 bg-white/90 backdrop-blur-xl shadow-sm"
      >
        {SidebarContent}
      </motion.aside>

      {/* Sidebar mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-orange-100 bg-white shadow-lg md:hidden"
          >
            {SidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile sidebar */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar on mobile with menu button */}
        <header className="md:hidden px-4 py-3 flex items-center justify-between border-b border-orange-100 bg-white/90 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-500"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  FitPlanHub
                </p>
                <p className="text-[10px] text-orange-500 uppercase tracking-[0.16em]">
                  {role === "trainer" ? "Trainer" : "User"}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-orange-500 text-white shadow-sm"
          >
            Logout
          </button>
        </header>

        <div className="flex-1 bg-gradient-to-br from-orange-50 via-white to-orange-100/60">
          <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
