import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  useEffect(() => {
    const htmlEle = window.document.documentElement;

    const applyTheme = (mode: Theme) => {
      htmlEle.classList.remove("light", "dark");
      if (mode === "system") {
        const isSystemDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        htmlEle.classList.add(isSystemDark ? "dark" : "light");
      } else {
        htmlEle.classList.add(mode);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
