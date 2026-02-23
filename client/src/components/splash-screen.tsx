import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<"logo" | "hold" | "fade">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 800);
    const t2 = setTimeout(() => setPhase("fade"), 2200);
    const t3 = setTimeout(() => onComplete(), 3000);
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
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 2,
                height: Math.random() * 3 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: "rgba(255,255,255,0.12)",
              }}
              animate={{ y: [0, -30, 0], opacity: [0, 0.5, 0] }}
              transition={{
                duration: Math.random() * 2 + 2.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center justify-center">
          <motion.div
            className="w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] flex items-center justify-center"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img src="/images/atg-logo.png" alt="ATG" className="w-full h-full object-contain drop-shadow-2xl" />
          </motion.div>

          <motion.div
            className="absolute w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 2.2, opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          />

          <motion.div
            className="absolute w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] rounded-full border border-white/20"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
