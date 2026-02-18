import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";

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

        <div className="relative flex flex-col items-center gap-6">
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

          <div className="relative flex flex-col items-center gap-1">
            <motion.div
              className="absolute"
              style={{ width: 340, height: 340 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase === "logo" ? 0 : 0.12,
                scale: phase === "logo" ? 0.5 : 1,
                rotate: 360,
              }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              }}
            >
              <Settings className="w-full h-full text-white" strokeWidth={1} />
            </motion.div>

            <motion.div
              className="absolute"
              style={{ width: 220, height: 220, top: 60, left: 60 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: phase === "logo" ? 0 : 0.08,
                scale: phase === "logo" ? 0.5 : 1,
                rotate: -360,
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 },
                scale: { duration: 0.5, delay: 0.2 },
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              }}
            >
              <Settings className="w-full h-full text-white" strokeWidth={1.5} />
            </motion.div>

            <motion.div
              className="absolute -top-16 -right-24"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase === "logo" ? 0 : 0.25,
                scale: phase === "logo" ? 0 : 1,
                rotate: 360,
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.3 },
                scale: { duration: 0.6, delay: 0.3, type: "spring" },
                rotate: { duration: 5, repeat: Infinity, ease: "linear" },
              }}
            >
              <Settings className="w-10 h-10 text-white" strokeWidth={2} />
            </motion.div>

            <motion.div
              className="absolute -top-12 -left-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase === "logo" ? 0 : 0.2,
                scale: phase === "logo" ? 0 : 1,
                rotate: -360,
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.5 },
                scale: { duration: 0.6, delay: 0.5, type: "spring" },
                rotate: { duration: 7, repeat: Infinity, ease: "linear" },
              }}
            >
              <Settings className="w-8 h-8 text-white" strokeWidth={2} />
            </motion.div>

            <motion.div
              className="absolute -bottom-10 -right-16"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase === "logo" ? 0 : 0.18,
                scale: phase === "logo" ? 0 : 1,
                rotate: 360,
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.4 },
                scale: { duration: 0.6, delay: 0.4, type: "spring" },
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              }}
            >
              <Settings className="w-7 h-7 text-white" strokeWidth={2} />
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -left-14"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase === "logo" ? 0 : 0.15,
                scale: phase === "logo" ? 0 : 1,
                rotate: -360,
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.6 },
                scale: { duration: 0.6, delay: 0.6, type: "spring" },
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              }}
            >
              <Settings className="w-6 h-6 text-white" strokeWidth={2} />
            </motion.div>

            <motion.h1
              className="relative z-10 text-white font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight"
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
              className="relative z-10 h-0.5 bg-white/40 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: phase === "logo" ? 0 : 200 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            />

            <motion.p
              className="relative z-10 text-white/60 text-sm sm:text-base tracking-widest uppercase mt-2"
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
      </motion.div>
    </AnimatePresence>
  );
}
