"use client"

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

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full border border-border bg-card/80 backdrop-blur-md px-2 py-2 shadow-lg shadow-black/10 dark:shadow-black/40"
      style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 0.5rem)` }}
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
    </nav>
  );
};

export default BottomNav;