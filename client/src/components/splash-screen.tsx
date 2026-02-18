import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function GearSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M100 10 L108 10 L112 30 Q120 32 127 36 L144 22 L150 28 L138 46 Q142 52 145 60 L166 56 L168 64 L148 72 Q149 80 149 84 L149 88 Q149 92 148 100 L168 106 L166 114 L146 110 Q143 118 138 125 L150 142 L144 148 L127 134 Q120 138 112 140 L108 160 L100 160 L96 140 Q88 138 80 134 L64 148 L58 142 L70 125 Q65 118 62 110 L42 114 L40 106 L60 100 Q59 92 59 88 L59 84 Q59 80 60 72 L40 64 L42 56 L62 60 Q65 52 70 46 L58 28 L64 22 L80 36 Q88 32 96 30 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      <circle cx="100" cy="85" r="35" stroke="currentColor" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "text" | "fade">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("fade"), 2800);
    const t3 = setTimeout(() => onComplete(), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(0 84% 32%) 0%, hsl(0 84% 45%) 40%, hsl(0 75% 38%) 70%, hsl(0 84% 28%) 100%)",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (phase === "fade") onComplete();
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: "rgba(255,255,255,0.15)",
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute text-white/20"
            style={{ width: 420, height: 420 }}
            initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
            animate={{
              opacity: phase === "logo" ? 0 : 1,
              scale: phase === "logo" ? 0.3 : 1,
              rotate: 360,
            }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 0.8, type: "spring", bounce: 0.3 },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          >
            <GearSVG className="w-full h-full" />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
            >
              <div className="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25 shadow-2xl">
                <span className="text-white font-bold text-5xl tracking-tight">A</span>
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/30"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </motion.div>

            <div className="flex flex-col items-center gap-1">
              <motion.h1
                className="text-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: phase === "logo" ? 0 : 1,
                  y: phase === "logo" ? 30 : 0,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                AMIR TECH GROUP
              </motion.h1>

              <motion.div
                className="h-0.5 bg-white/40 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: phase === "logo" ? 0 : 200 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />

              <motion.p
                className="text-white/60 text-sm sm:text-base tracking-widest uppercase mt-2"
                initial={{ opacity: 0, letterSpacing: "0.5em" }}
                animate={{
                  opacity: phase === "logo" ? 0 : 1,
                  letterSpacing: phase === "logo" ? "0.5em" : "0.2em",
                }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                ATG.TJ
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
