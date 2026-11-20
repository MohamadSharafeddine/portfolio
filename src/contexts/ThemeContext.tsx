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

const savedChoice = (): Theme | null => {
  try {
    const v = localStorage.getItem(CHOICE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
};

// The inline script in layout.tsx sets data-theme before paint. This provider mirrors it into React
// state, follows the device setting live while the visitor hasn't chosen, and saves explicit toggles.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dark" || current === "light") setTheme(current);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onDeviceChange = () => {
      if (savedChoice()) return;
      const next: Theme = mq.matches ? "dark" : "light";
      apply(next);
      setTheme(next);
    };
    mq.addEventListener("change", onDeviceChange);
    return () => mq.removeEventListener("change", onDeviceChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      apply(next);
      // Choosing the device's own mode means "follow my device" again, so nothing gets stuck
      const device: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      try {
        if (next === device) localStorage.removeItem(CHOICE_KEY);
        else localStorage.setItem(CHOICE_KEY, next);
      } catch {}
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
