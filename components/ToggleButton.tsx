"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getInitialTheme() {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function ToggleButton() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number; isDark: boolean }>
  >([]);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Get button position
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    // Toggle theme
    const htmlElement = document.documentElement;
    const willBeDark = !isDarkMode;

    if (isDarkMode) {
      htmlElement.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      htmlElement.classList.add("dark");
      setIsDarkMode(true);
    }

    // Add new ripple with unique ID
    const newRipple = {
      id: rippleIdRef.current++,
      x: position.x,
      y: position.y,
      isDark: willBeDark,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 1000);
  };

  return (
    <>
      <motion.button
        onClick={toggleTheme}
        className="relative z-50 flex h-9 w-9 items-center justify-center overflow-visible rounded-full border border-gray-300 bg-white transition-all hover:bg-gray-50 md:h-10 md:w-10 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Toggle theme"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDarkMode ? (
            <motion.svg
              key="sun"
              className="relative z-10 h-5 w-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              className="relative z-10 h-5 w-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ rotate: 90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Ripple Wave Animations - Multiple instances */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <React.Fragment key={ripple.id}>
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  background: ripple.isDark
                    ? "radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(59, 130, 246, 0.3) 30%, transparent 70%)"
                    : "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(252, 211, 77, 0.3) 30%, transparent 70%)",
                }}
                initial={{
                  width: 0,
                  height: 0,
                  x: "-50%",
                  y: "-50%",
                  opacity: 1,
                }}
                animate={{
                  width: "300vmax",
                  height: "300vmax",
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  background: ripple.isDark
                    ? "radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, rgba(59, 130, 246, 0.2) 30%, transparent 70%)"
                    : "radial-gradient(circle, rgba(252, 211, 77, 0.3) 0%, rgba(251, 191, 36, 0.2) 30%, transparent 70%)",
                }}
                initial={{
                  width: 0,
                  height: 0,
                  x: "-50%",
                  y: "-50%",
                  opacity: 0.8,
                }}
                animate={{
                  width: "300vmax",
                  height: "300vmax",
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.4, 0, 0.2, 1],
                  delay: 0.05,
                }}
              />
              <motion.div
                className="absolute rounded-full"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  background: ripple.isDark
                    ? "radial-gradient(circle, rgba(147, 197, 253, 0.25) 0%, rgba(59, 130, 246, 0.15) 30%, transparent 70%)"
                    : "radial-gradient(circle, rgba(253, 224, 71, 0.25) 0%, rgba(251, 191, 36, 0.15) 30%, transparent 70%)",
                }}
                initial={{
                  width: 0,
                  height: 0,
                  x: "-50%",
                  y: "-50%",
                  opacity: 0.6,
                }}
                animate={{
                  width: "300vmax",
                  height: "300vmax",
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
              />
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

export default ToggleButton;
