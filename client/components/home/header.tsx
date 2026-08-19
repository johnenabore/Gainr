"use client"

import { useEffect, useState } from "react";
import { User } from "lucide-react";

import { getGreeting } from "@/lib/greetings";
import { formatHeaderDate } from "@/lib/formatDate";

const Header = () => {

    const [greeting, setGreeting] = useState("");

    const today = formatHeaderDate();

    useEffect(() => {
        const greeting = getGreeting({
            lastWorkoutDate: new Date("2026-08-17"),
            isRestDay: false,
            currentStreak: 4,
        });
        setGreeting(greeting);
    }, []);

    return (
        <header className="flex items-center justify-between px-4 py-4 bg-neutral-950">
            <div className="flex flex-col">
                <span className="text-sm text-neutral-400">{today}</span>
                <h1 className="text-xl font-bold text-white">{greeting}</h1>
            </div>

            <button className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-300" />
            </button>
        </header>
    )
}

export default Header