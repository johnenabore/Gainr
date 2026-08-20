"use client"

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Home, Dumbbell, TrendingUp, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/log", label: "Log", icon: Dumbbell },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/coach", label: "Coach", icon: Sparkles },
];

const SCROLL_THRESHOLD = 4;

const BottomNav = () => {
  const pathname = usePathname();
  const [shrink, setShrink] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y <= 0) {
        setShrink(false);
      } else if (delta > SCROLL_THRESHOLD) {
        setShrink(true);
      } else if (delta < -SCROLL_THRESHOLD) {
        setShrink(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      animate={{ scale: shrink ? 0.92 : 1 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
      style={{
        x: "-50%",
        paddingBottom: `calc(env(safe-area-inset-bottom) + 0.5rem)`,
      }}
      className="fixed bottom-4 left-1/2 z-50 flex items-center gap-1 rounded-full border border-border bg-card/80 backdrop-blur-md px-2 py-2 shadow-lg shadow-black/10 dark:shadow-black/40"
    >
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} className="relative">
            <motion.div
              whileTap={{ scale: 0.9 }}
              animate={{ scale: isActive ? 1.06 : 1 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.3 }}
              className="relative flex w-16 flex-col items-center gap-0.5 rounded-full px-4 py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-accent -z-10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                />
              )}

              <Icon
                className={`w-5 h-5 ${isActive ? "text-[#3B9EE8]" : "text-muted-foreground"}`}
                strokeWidth={isActive ? 2.25 : 2}
              />

              <span
                className={`text-xs transition-colors duration-200 ${
                  isActive ? "text-[#3B9EE8]" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </motion.div>
          </Link>
        );
      })}
    </motion.nav>
  );
};

export default BottomNav;