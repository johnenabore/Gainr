"use client"

import { User } from "lucide-react";
import { getGreeting } from "@/lib/greetings";
import { formatHeaderDate } from "@/lib/formatDate";

const Header = () => {
  const today = formatHeaderDate();

  const greeting = getGreeting({
    lastWorkoutDate: new Date("2026-08-17"),
    isRestDay: true,
    currentStreak: 4,
  });

  return (
    <header className="flex items-center justify-between px-4 py-4 bg-background">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">{today}</span>
        <h1 className="text-xl font-bold text-foreground">{greeting}</h1>
      </div>
      <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
        <User className="w-4 h-4 text-secondary-foreground" />
      </button>
    </header>
  );
};

export default Header;