import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: 0,
            bottom: 0,
            width: "200px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.08) 80%, transparent)",
            transform: "skewX(-20deg)",
            zIndex: 20,
          }}
          initial={{ left: "-20%" }}
          animate={{ left: "120%" }}
          transition={{ duration: 0.6, delay: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
        />

        <div className="relative flex flex-col items-center justify-center">
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          >
            <motion.div
              className="w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] flex items-center justify-center"
              animate={{
                filter: [
                  "drop-shadow(0 0 0px rgba(255,255,255,0))",
                  "drop-shadow(0 0 40px rgba(255,255,255,0.4))",
                  "drop-shadow(0 0 20px rgba(255,255,255,0.15))",
                ],
              }}
              transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
            >
              <img src="/images/atg-logo.png" alt="ATG" className="w-full h-full object-contain" />
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: "3px solid rgba(255,255,255,0.3)" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 2.5, opacity: [0, 0.6, 0] }}
              transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid rgba(255,255,255,0.2)" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 3, opacity: [0, 0.4, 0] }}
              transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
