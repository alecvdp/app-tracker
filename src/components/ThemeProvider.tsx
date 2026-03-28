"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  ThemeConfig,
  ThemeMode,
  PalettePreset,
  getPalette,
  DEFAULT_THEME,
} from "@/lib/theme";

interface ThemeContextType {
  theme: ThemeConfig;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: PalettePreset) => void;
  toggleMode: () => void;
  colors: ReturnType<typeof getPalette>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "app-tracker-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTheme(JSON.parse(stored));
      } catch {
        // Invalid JSON, use default
      }
    }
    setMounted(true);
  }, []);

  // Save theme to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    }
  }, [theme, mounted]);

  // Apply CSS variables to :root
  useEffect(() => {
    const colors = getPalette(theme.mode, theme.palette);
    const root = document.documentElement;

    root.style.setProperty("--bg-primary", colors.bg);
    root.style.setProperty("--bg-secondary", colors.bgSecondary);
    root.style.setProperty("--bg-tertiary", colors.bgTertiary);
    root.style.setProperty("--text-primary", colors.text);
    root.style.setProperty("--text-muted", colors.textMuted);
    root.style.setProperty("--text-faint", colors.textFaint);
    root.style.setProperty("--accent-primary", colors.accent);
    root.style.setProperty("--accent-secondary", colors.accentSecondary);
    root.style.setProperty("--accent-tertiary", colors.accentTertiary);
    root.style.setProperty("--border-color", colors.border);

    // Set data attribute for CSS selectors
    root.setAttribute("data-theme-mode", theme.mode);
    root.setAttribute("data-theme-palette", theme.palette);
  }, [theme, mounted]);

  const colors = getPalette(theme.mode, theme.palette);

  const setMode = (mode: ThemeMode) => {
    setTheme((prev) => ({ ...prev, mode }));
  };

  const setPalette = (palette: PalettePreset) => {
    setTheme((prev) => ({ ...prev, palette }));
  };

  const toggleMode = () => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setMode, setPalette, toggleMode, colors }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
