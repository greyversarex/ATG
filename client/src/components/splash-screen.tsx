import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "text" | "fade">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("fade"), 2400);
    const t3 = setTimeout(() => onComplete(), 3200);
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

        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            bottom: 0,
            width: "150px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.1) 70%, transparent)",
            transform: "skewX(-20deg)",
            zIndex: 20,
          }}
          initial={{ left: "-15%" }}
          animate={{ left: "115%" }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />

        <div className="relative flex flex-col items-center justify-center">
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
          >
            <div className="w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] flex items-center justify-center">
              <img src="/images/atg-logo.png" alt="ATG" className="w-full h-full object-contain drop-shadow-2xl" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-white/20"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
            />
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
