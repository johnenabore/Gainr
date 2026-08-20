"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // render a placeholder identical on server & client
    return <button className="w-9 h-9 rounded-full" aria-hidden />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-neutral-300" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-300" />
      )}
    </button>
  );
}