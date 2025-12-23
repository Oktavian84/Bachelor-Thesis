"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  inverted?: boolean;
}

export function ThemeToggle({ inverted = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const bgClass = inverted
    ? isLight
      ? "bg-white hover:bg-white focus:ring-black/50 border border-black/20 shadow-md"
      : "bg-white hover:bg-white focus:ring-black/50 border-2 border-black shadow-lg"
    : isLight
      ? "bg-white/10 hover:bg-white/20 focus:ring-white/50"
      : "bg-black/10 hover:bg-black/20 focus:ring-black/50";

  const iconColor = inverted
    ? isLight
      ? "text-black" 
      : "text-black"
    : isLight
      ? "text-white"
      : "text-black";

  return (
    <button
      onClick={toggleTheme}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 backdrop-blur-sm ${bgClass}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg
          className={`w-4 h-4 ${iconColor}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        
        <svg
          className={`w-4 h-4 ${iconColor}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )}
    </button>
  );
}

