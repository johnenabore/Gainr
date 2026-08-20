"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, LayoutGroup, motion, type Transition } from "motion/react";
import { Settings, LogOut, Sun, Moon } from "lucide-react";
import { getGreeting } from "@/lib/greetings";
import { formatHeaderDate } from "@/lib/formatDate";
import profile from "@/public/bald-eagle-550804_1280.jpg";

const AVATAR_SRC = profile.src;

const secondaryItems = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Logout", icon: LogOut, href: "/logout" },
];

const AVATAR_DURATION = 0.25;
const AVATAR_TRANSITION: Transition = { type: "spring", duration: AVATAR_DURATION, bounce: 0 };
const popTransition = (delay: number): Transition => ({
  duration: 0.2,
  delay,
  ease: [0.16, 1, 0.3, 1],
});

const CURRENT_STREAK = 4; // TODO: source from the same place getGreeting reads it

const Header = () => {
  const today = formatHeaderDate();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [greeting, setGreeting] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // theme is client-only, avoid hydration mismatch
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    setGreeting(
      getGreeting({
        lastWorkoutDate: new Date("2026-08-17"),
        isRestDay: true,
        currentStreak: CURRENT_STREAK,
      })
    );
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    firstItemRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function closeAndReturnFocus() {
    setMenuOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleNavigate(href: string) {
    closeAndReturnFocus();
    router.push(href);
  }

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-background overflow-visible">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{today}</span>
        <h1 className="text-xl font-bold text-foreground">{greeting ?? " "}</h1>
      </div>

      <LayoutGroup>
        <div ref={menuRef} className="relative flex items-center justify-end overflow-visible isolate">
          {!menuOpen && (
            <button
              ref={triggerRef}
              onClick={() => setMenuOpen(true)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="w-9 h-9 rounded-full overflow-hidden shrink-0 relative z-10 ring-2 ring-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9EE8]"
            >
              <motion.img
                layoutId="account-avatar"
                transition={AVATAR_TRANSITION}
                src={AVATAR_SRC}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            </button>
          )}

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                role="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-0 z-50 w-56 overflow-hidden rounded-2xl bg-popover/90 backdrop-blur-md py-1 dark:shadow-black/30 ring-1 ring-[#3B9EE8]/25"
              >
                <button
                  ref={firstItemRef}
                  role="menuitem"
                  onClick={() => handleNavigate("/profile")}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:bg-accent bg-[#3B9EE8]/6"
                >
                  <motion.img
                    layoutId="account-avatar"
                    transition={AVATAR_TRANSITION}
                    src={AVATAR_SRC}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={popTransition(AVATAR_DURATION)}
                    className="flex flex-col min-w-0"
                  >
                    <span className="text-sm font-semibold text-popover-foreground">Profile</span>
                    <span className="text-xs text-[#3B9EE8]">🔥 {CURRENT_STREAK}-day streak</span>
                  </motion.div>
                </button>

                <div className="my-1 h-px bg-border" />

                {secondaryItems.map(({ label, icon: Icon, href }, i) => (
                  <motion.button
                    key={label}
                    role="menuitem"
                    onClick={() => handleNavigate(href)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={popTransition(AVATAR_DURATION + (i + 1) * 0.06)}
                    className="group flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-popover-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:bg-accent"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-[#3B9EE8]" />
                    {label}
                  </motion.button>
                ))}

                {/* Theme toggle — same row treatment as Settings/Logout, own switch on the right */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={popTransition(AVATAR_DURATION + (secondaryItems.length + 1) * 0.06)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-popover-foreground"
                >
                  <span className="flex items-center gap-3">
                    {mounted && theme === "dark" ? (
                      <Moon className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Sun className="w-4 h-4 text-muted-foreground" />
                    )}
                    Theme
                  </span>
                  <button
                    role="switch"
                    aria-checked={mounted ? theme === "dark" : true}
                    aria-label="Toggle dark mode"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className={`relative h-5 w-9 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9EE8] ${
                      mounted && theme === "dark" ? "bg-[#3B9EE8]" : "bg-muted"
                    }`}
                  >
                    <motion.span
                      className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white"
                      animate={{ x: mounted && theme === "dark" ? 16 : 0 }}
                      transition={{ type: "spring", bounce: 0.3, duration: 0.25 }}
                    />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </header>
  );
};

export default Header;