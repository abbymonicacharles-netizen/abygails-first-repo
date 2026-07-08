"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  TEXT_SIZE_KEY,
  THEME_KEY,
  type TextSize,
  type Theme,
} from "@/data/content";

interface SettingsContextValue {
  theme: Theme;
  textSize: TextSize;
  setTheme: (theme: Theme) => void;
  setTextSize: (size: TextSize) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applySettings(theme: Theme, textSize: TextSize) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-text-size", textSize);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [textSize, setTextSizeState] = useState<TextSize>("md");

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const storedSize = localStorage.getItem(TEXT_SIZE_KEY) as TextSize | null;
    const nextTheme = storedTheme === "dark" ? "dark" : "light";
    const nextSize =
      storedSize === "sm" || storedSize === "lg" ? storedSize : "md";

    setThemeState(nextTheme);
    setTextSizeState(nextSize);
    applySettings(nextTheme, nextSize);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem(THEME_KEY, next);
    applySettings(next, textSize);
  };

  const setTextSize = (next: TextSize) => {
    setTextSizeState(next);
    localStorage.setItem(TEXT_SIZE_KEY, next);
    applySettings(theme, next);
  };

  return (
    <SettingsContext.Provider value={{ theme, textSize, setTheme, setTextSize }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
