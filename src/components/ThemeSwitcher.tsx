"use client";

import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { PALETTE_PRESETS, PalettePreset } from "@/lib/theme";

export default function ThemeSwitcher() {
  const { theme, setMode, setPalette, toggleMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
        title="Theme Settings"
      >
        {/* Sun/Moon Icon */}
        {theme.mode === "light" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
        <span className="text-sm font-medium hidden sm:inline">Theme</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="absolute right-0 mt-2 w-72 rounded-xl border shadow-xl z-50 overflow-hidden"
            style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Theme Settings
              </h3>
            </div>

            {/* Mode Toggle */}
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border-color)" }}>
              <p
                className="text-xs font-medium mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                MODE
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("light")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    theme.mode === "light"
                      ? "border-[var(--accent-primary)]"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor:
                      theme.mode === "light"
                        ? "var(--accent-primary)"
                        : "var(--bg-tertiary)",
                    color:
                      theme.mode === "light" ? "var(--bg-primary)" : "var(--text-primary)",
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                    Light
                  </span>
                </button>
                <button
                  onClick={() => setMode("dark")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    theme.mode === "dark"
                      ? "border-[var(--accent-primary)]"
                      : "border-transparent opacity-60 hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor:
                      theme.mode === "dark"
                        ? "var(--accent-primary)"
                        : "var(--bg-tertiary)",
                    color:
                      theme.mode === "dark" ? "var(--bg-primary)" : "var(--text-primary)",
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    Dark
                  </span>
                </button>
              </div>
            </div>

            {/* Palette Selection */}
            <div className="px-4 py-3">
              <p
                className="text-xs font-medium mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                COLOR PALETTE
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PALETTE_PRESETS) as PalettePreset[]).map(
                  (preset) => {
                    const isActive = theme.palette === preset;
                    return (
                      <button
                        key={preset}
                        onClick={() => setPalette(preset)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                          isActive
                            ? "border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: "var(--bg-tertiary)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {PALETTE_PRESETS[preset].label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
