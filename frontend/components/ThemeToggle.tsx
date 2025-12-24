"use client";

import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  inverted?: boolean;
}

export function ThemeToggle({ inverted = false }: ThemeToggleProps) {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={[
        "w-8 h-8 rounded-full flex items-center justify-center",
        "transition-all duration-300 hover:scale-110",
        "focus:outline-none focus:ring-2 backdrop-blur-sm",

        inverted
          ? [
              "bg-white border border-black/20 shadow-md",
              "hover:bg-white",
              "focus:ring-black/50",
              "text-black",
            ].join(" ")
          : [
              "bg-black/10 text-black",
              "dark:bg-white/10 dark:text-white",
              "hover:bg-black/20 dark:hover:bg-white/20",
              "focus:ring-black/50 dark:focus:ring-white/50",
            ].join(" "),
      ].join(" ")}
    >
      {/* Sun */}
      <svg
        className="w-4 h-4 block dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>

      {/* Moon */}
      <svg
        className="w-4 h-4 hidden dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
