// src/pages/System/HowToUse.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Dumbbell, ArrowRight, Play, Pause, X } from "lucide-react";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVideoType, setModalVideoType] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handleUserVideoClick = () => {
    setModalVideoType("user");
    setModalOpen(true);
    setVideoPlaying(false);
  };

  const handleTrainerVideoClick = () => {
    setModalVideoType("trainer");
    setModalOpen(true);
    setVideoPlaying(false);
  };

  const closeModal = () => {
    const video = document.getElementById("modal-video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setModalOpen(false);
    setVideoPlaying(false);
  };

  const toggleModalVideo = () => {
    const video = document.getElementById("modal-video");
    if (video) {
      if (videoPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100/70 pt-16">
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
                <User className="w-5 h-5 text-white" />
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

            {/* Video Demo */}
            <div
              onClick={handleUserVideoClick}
              className="relative rounded-xl overflow-hidden mb-4 bg-slate-100 group cursor-pointer"
            >
              <video className="w-full aspect-video object-cover pointer-events-none">
                <source src="/user.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <Play className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </div>

            <ul className="mt-2 mb-5 space-y-1.5 text-sm text-slate-600">
              <li>Sign up or log in, then open your dashboard.</li>
              <li>Browse public plans and open details to see workouts.</li>
              <li>Subscribe to a plan, pay securely, and start training.</li>
              <li>
                See all your subscriptions and history in "My subscriptions".
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

            {/* Video Demo */}
            <div
              onClick={handleTrainerVideoClick}
              className="relative rounded-xl overflow-hidden mb-4 bg-slate-100 group cursor-pointer"
            >
              <video className="w-full aspect-video object-cover pointer-events-none">
                <source src="/Trainer.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <Play className="w-12 h-12 text-white drop-shadow-lg" />
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
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video Container */}
              <div className="relative bg-black">
                <video
                  id="modal-video"
                  className="w-full aspect-video"
                  onEnded={() => setVideoPlaying(false)}
                  controls
                  autoPlay
                >
                  <source
                    src={
                      modalVideoType === "user" ? "/user.mov" : "/Trainer.mov"
                    }
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Play/Pause Overlay */}
                <button
                  onClick={toggleModalVideo}
                  className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/10 transition-colors group"
                >
                  {!videoPlaying && (
                    <Play className="w-16 h-16 text-white drop-shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              </div>

              {/* Video Info */}
              <div className="p-6 bg-slate-900">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {modalVideoType === "user" ? "User Guide" : "Trainer Guide"}
                </h3>
                <p className="text-sm text-slate-400">
                  {modalVideoType === "user"
                    ? "Learn how to browse plans, subscribe, and track your progress"
                    : "Learn how to create plans, manage clients, and grow your business"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
