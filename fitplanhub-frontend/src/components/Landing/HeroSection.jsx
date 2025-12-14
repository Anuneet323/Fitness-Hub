import React from "react";
import { motion } from "framer-motion";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-orange-300/20",
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -120,
        rotate: rotate - 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border border-orange-200/70",
            "shadow-[0_12px_40px_rgba(251,146,60,0.25)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.30),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function FitPlanHubHero() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.4 + i * 0.18,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-100/70">
      {/* soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 via-white to-amber-100/60" />

      {/* floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={10}
          gradient="from-orange-300/40"
          className="left-[-15%] md:left-[-8%] top-[12%] md:top-[18%]"
        />
        <ElegantShape
          delay={0.5}
          width={480}
          height={120}
          rotate={-15}
          gradient="from-amber-300/40"
          className="right-[-10%] md:right-[-4%] top-[65%] md:top-[70%]"
        />
        <ElegantShape
          delay={0.4}
          width={320}
          height={80}
          rotate={-6}
          gradient="from-orange-400/35"
          className="left-[4%] md:left-[10%] bottom-[8%]"
        />
        <ElegantShape
          delay={0.6}
          width={220}
          height={60}
          rotate={18}
          gradient="from-rose-300/35"
          className="right-[12%] md:right-[20%] top-[8%]"
        />
        <ElegantShape
          delay={0.7}
          width={160}
          height={44}
          rotate={-22}
          gradient="from-orange-200/45"
          className="left-[22%] md:left-[28%] top-[5%]"
        />
      </div>

      {/* content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
        {/* badge */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-orange-200/70 shadow-sm mb-8 md:mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.7)]" />
          <span className="text-xs sm:text-sm text-orange-700 tracking-[0.22em] uppercase">
            FitPlanHub
          </span>
        </motion.div>

        {/* title */}
        <motion.div
          custom={1}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-6 md:mb-8 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700">
              Transform your body,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400">
              one smart workout at a time
            </span>
          </h1>
        </motion.div>

        {/* subtext */}
        <motion.div
          custom={2}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
        >
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 md:mb-10 leading-relaxed font-light max-w-2xl mx-auto">
            Build personalized training plans, track your progress, and stay
            accountable with AI-powered insights designed for real results.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button className="px-8 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm sm:text-base shadow-[0_18px_45px_rgba(249,115,22,0.55)] transition-colors">
            Start your free plan
          </button>
          <button className="px-8 py-3 rounded-full border border-orange-200 text-orange-700 hover:border-orange-400 hover:text-orange-800 text-sm sm:text-base font-medium bg-white/80 backdrop-blur-sm shadow-sm transition-colors">
            I&apos;m a trainer
          </button>
        </motion.div>
      </div>

      {/* soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange-100/70 via-transparent to-white/80" />
    </div>
  );
}
