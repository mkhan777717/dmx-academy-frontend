"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Leaf, Sparkles, ChevronDown } from "lucide-react";

const THEMES = [
  {
    id: "theme-light",
    label: "Light",
    icon: Sun,
    bg: "#faf9f6",
    accent: "#4f46e5",
    desc: "Clean & minimal",
  },
  {
    id: "theme-dark",
    label: "Dark",
    icon: Moon,
    bg: "#0b0f19",
    accent: "#818cf8",
    desc: "Sleek deep space",
  },
  {
    id: "theme-mint",
    label: "Mint",
    icon: Leaf,
    bg: "#f0fbf7",
    accent: "#10b981",
    desc: "Fresh sage green",
  },
  {
    id: "theme-violet",
    label: "Violet",
    icon: Sparkles,
    bg: "#0d0818",
    accent: "#d946ef",
    desc: "Midnight cyberpunk",
  },
];

export default function ThemeToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("theme-light");
  const dropdownRef = useRef(null);

  // On mount, read stored preference
  useEffect(() => {
    const stored = localStorage.getItem("academy_theme");
    if (stored && THEMES.find((t) => t.id === stored)) {
      setActiveTheme(stored);
    } else {
      // Detect what the inline script already applied
      const applied = THEMES.find((t) =>
        document.documentElement.classList.contains(t.id)
      );
      if (applied) setActiveTheme(applied.id);
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applyTheme = (themeId) => {
    // Remove all theme classes then apply the selected one
    THEMES.forEach((t) => document.documentElement.classList.remove(t.id));
    document.documentElement.classList.add(themeId);
    localStorage.setItem("academy_theme", themeId);
    setActiveTheme(themeId);
    setIsOpen(false);
  };

  const current = THEMES.find((t) => t.id === activeTheme) || THEMES[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-primary)",
          color: "var(--text-primary)",
        }}
        aria-label="Change theme"
        id="theme-toggle-btn"
      >
        {/* Colour swatch */}
        <span
          className="h-3 w-3 rounded-full border border-white/30 shadow-sm"
          style={{ backgroundColor: current.accent }}
        />
        <CurrentIcon size={13} style={{ color: current.accent }} />
        <span className="hidden sm:block">{current.label}</span>
        <ChevronDown
          size={12}
          className="transition-transform duration-200"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "var(--text-muted)",
          }}
        />
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full z-[200] mt-2 w-52 rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-primary)",
            }}
          >
            <div
              className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Choose Theme
            </div>

            <ul className="p-2 space-y-1">
              {THEMES.map((theme) => {
                const Icon = theme.icon;
                const isActive = theme.id === activeTheme;
                return (
                  <li key={theme.id}>
                    <button
                      onClick={() => applyTheme(theme.id)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150"
                      style={{
                        backgroundColor: isActive
                          ? `${theme.accent}20`
                          : "transparent",
                        border: isActive
                          ? `1px solid ${theme.accent}50`
                          : "1px solid transparent",
                      }}
                      id={`theme-option-${theme.id}`}
                    >
                      {/* Preview swatch */}
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm"
                        style={{ backgroundColor: theme.bg, border: `2px solid ${theme.accent}` }}
                      >
                        <Icon size={14} style={{ color: theme.accent }} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-xs font-bold"
                          style={{
                            color: isActive ? theme.accent : "var(--text-primary)",
                          }}
                        >
                          {theme.label}
                        </div>
                        <div
                          className="text-[10px]"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {theme.desc}
                        </div>
                      </div>
                      {/* Active dot */}
                      {isActive && (
                        <motion.span
                          layoutId="activeThemeDot"
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: theme.accent }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Footer hint */}
            <div
              className="border-t px-3 py-2 text-center text-[10px]"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-muted)",
              }}
            >
              Your preference is saved locally
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
