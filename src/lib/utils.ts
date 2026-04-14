import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimerLabel(totalSeconds: number | null | undefined) {
  if (typeof totalSeconds !== "number" || Number.isNaN(totalSeconds)) {
    return "--:--"
  }

  const clamped = Math.max(totalSeconds, 0)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}
