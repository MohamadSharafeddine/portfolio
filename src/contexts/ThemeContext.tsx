"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Written only when the visitor toggles away from their device setting; otherwise the device decides. */
const CHOICE_KEY = "theme-choice";

const apply = (t: Theme) => document.documentElement.setAttribute("data-theme", t);

// Mirrors the saved choice for this page view, so a toggle still holds where localStorage is blocked
let memoryChoice: Theme | null = null;

const savedChoice = (): Theme | null => {
  try {
    const v = localStorage.getItem(CHOICE_KEY);
    if (v === "light" || v === "dark") return v;
  } catch {}
  return memoryChoice;
};

const deviceTheme = (): Theme => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const resolveTheme = (): Theme => savedChoice() ?? deviceTheme();

// The inline script in layout.tsx sets data-theme before first paint (no flash). This provider owns the
// theme after that: it re-applies the resolved theme on mount and restores it if anything strips or changes
// the <html> attribute. React 19 removes attributes it didn't render from <html> when it has to re-render the
// root (e.g. after a hydration mismatch), which left the deployed site on the light fallback.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const t = resolveTheme();
      if (root.getAttribute("data-theme") !== t) apply(t);
      setTheme(t);
    };
    sync();

    const guard = new MutationObserver(() => {
      if (root.getAttribute("data-theme") !== resolveTheme()) sync();
    });
    guard.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // Follow the device live while the visitor hasn't chosen
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", sync);
    return () => {
      guard.disconnect();
      mq.removeEventListener("change", sync);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      // Choosing the device's own mode means "follow my device" again, so nothing gets stuck.
      // Storage is written before the attribute changes, so the guard above agrees with it.
      memoryChoice = next === deviceTheme() ? null : next;
      try {
        if (memoryChoice) localStorage.setItem(CHOICE_KEY, memoryChoice);
        else localStorage.removeItem(CHOICE_KEY);
      } catch {}
      apply(next);
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return { theme: "dark" as Theme, toggleTheme: () => {} };
  }
  return context;
}
