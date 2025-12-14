// src/pages/System/HowToUse.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Dumbbell,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.15 + i * 0.08 },
  }),
};

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100/70">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8 md:mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-orange-200/70 shadow-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[11px] tracking-[0.22em] uppercase text-orange-700">
              How to use FitPlanHub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            Two roles, one platform
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Choose how you want to use FitPlanHub – as a user following training
            plans, or as a trainer creating and managing them.
          </p>
        </motion.div>

        {/* Two big role cards */}
        <div className="grid gap-5 md:grid-cols-2 mb-10">
          {/* User card */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-5 md:p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-md">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  I&apos;m a user
                </h2>
                <p className="text-xs text-slate-500">
                  Follow plans, subscribe, and track your progress.
                </p>
              </div>
            </div>

            <ul className="mt-2 mb-5 space-y-1.5 text-sm text-slate-600">
              <li>Sign up or log in, then open your dashboard.</li>
              <li>Browse public plans and open details to see workouts.</li>
              <li>Subscribe to a plan, pay securely, and start training.</li>
              <li>
                See all your subscriptions and history in “My subscriptions”.
              </li>
              <li>Log your daily progress to stay accountable.</li>
            </ul>

            <div className="mt-auto flex flex-wrap gap-2">
              <Link
                to="/plans"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-4 py-1.75 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-orange-600 transition-colors"
              >
                Explore plans
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
              <Link
                to="/user-dashboard"
                className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white/80 px-4 py-1.75 text-xs md:text-sm font-medium text-orange-700 hover:border-orange-400 hover:text-orange-800 transition-colors"
              >
                Open user dashboard
              </Link>
            </div>
          </motion.div>

          {/* Trainer card */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.08)] p-5 md:p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                <Dumbbell className="w-5 h-5 text-orange-200" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  I&apos;m a trainer
                </h2>
                <p className="text-xs text-slate-500">
                  Build plans, manage clients, and grow your brand.
                </p>
              </div>
            </div>

            <ul className="mt-2 mb-5 space-y-1.5 text-sm text-slate-600">
              <li>Sign up as a trainer and complete your profile.</li>
              <li>Create structured plans with workouts and nutrition.</li>
              <li>Share your plans and let users subscribe.</li>
              <li>
                See all subscribers and client activity in your dashboard.
              </li>
              <li>Use community posts to keep your clients engaged.</li>
            </ul>

            <div className="mt-auto flex flex-wrap gap-2">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.75 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
              >
                Sign up as trainer
              </Link>
              <Link
                to="/trainer-dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-4 py-1.75 text-xs md:text-sm font-medium text-slate-800 hover:border-slate-500 transition-colors"
              >
                Open trainer dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
