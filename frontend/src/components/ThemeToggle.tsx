import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // This code runs BEFORE the first render
    if (typeof window !== "undefined") {
      // Safety check for browser environment
      const storedTheme = localStorage.getItem("theme");
      return storedTheme === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        width: "2.8em",
        height: "1.6em",
        padding: "0.2em",
      }}
      className={cn(
        "relative flex items-center rounded-full p-1 cursor-pointer transition-all duration-300",
        "bg-slate-200 border border-slate-300 shadow-inner",
        "dark:bg-slate-800 dark:border-slate-700",
        "focus:outline-none",
      )}
      aria-label="Toggle theme"
    >
      <div
        style={{
          width: "1.2em",
          height: "1.2em",
        }}
        className={cn(
          "flex items-center justify-center rounded-full shadow-md transition-all duration-300 ease-in-out",
          isDarkMode
            ? "translate-x-[1.2em] bg-slate-950"
            : "translate-x-0 bg-white",
        )}
      >
        {isDarkMode ? (
          <Sun
            style={{ width: "0.8em", height: "0.8em" }}
            className="h-6 w-6 text-yellow-300"
          />
        ) : (
          <Moon
            style={{ width: "0.8em", height: "0.8em" }}
            className="h-6 w-6 text-blue-900"
          />
        )}
      </div>
    </button>
  );
};
