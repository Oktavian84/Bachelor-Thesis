"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  inverted?: boolean;
}

export function ThemeToggle({ inverted = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const bgClass = inverted
    ? "bg-white hover:bg-white focus:ring-black/50 border border-black/20 shadow-md text-black"
    : "bg-black/10 text-black hover:bg-black/20 focus:ring-black/50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:ring-white/50";

  return (
    <button
      type="button"
      onClick={() => {
        console.log("before", document.documentElement.className);
        toggleTheme();
        setTimeout(() => {
          console.log("after", document.documentElement.className);
        }, 0);
      }}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={[
        "w-8 h-8 rounded-full flex items-center justify-center",
        "transition-all duration-300 hover:scale-110",
        "focus:outline-none focus:ring-2 backdrop-blur-sm",
        bgClass,
      ].join(" ")}
    >
      {isLight ? (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
