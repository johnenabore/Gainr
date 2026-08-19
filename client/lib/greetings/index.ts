import {
  newUserGreetings,
  restDayGreetings,
  backFromRestGreetings,
  skippedYesterdayGreetings, 
  streakGreetings,
  defaultGreetings,
} from "./data";

type GreetingContext = {
  lastWorkoutDate: Date | null; // null if no workouts logged yet
  isRestDay?: boolean;          // if today is a scheduled rest day
  currentStreak?: number;       // consecutive days trained
};

const daysBetween = (a: Date, b: Date) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utcB - utcA) / msPerDay);
};

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const getGreeting = ({
  lastWorkoutDate,
  isRestDay,
  currentStreak,
}: GreetingContext): string => {
  const today = new Date();

  if (isRestDay) {
    return pick(restDayGreetings);
  }

  if (!lastWorkoutDate) {
    return pick(newUserGreetings);
  }

  const gap = daysBetween(lastWorkoutDate, today);

  if (gap === 0) {
    // already trained today
    return "Already crushed today. Nice.";
  }

  if (gap === 1 && currentStreak && currentStreak >= 3) {
    return `${currentStreak} ${pick(streakGreetings)}`;
  }

  if (gap === 1) {
    return pick(backFromRestGreetings);
  }

  if (gap === 2) {
    return pick(skippedYesterdayGreetings);
  }

  if (gap >= 3) {
    return "It's been a while. Let's get back to it.";
  }

  return pick(defaultGreetings);
};