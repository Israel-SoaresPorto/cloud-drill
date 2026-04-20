import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimerLabel(totalSeconds: number | null | undefined) {
  if (
    typeof totalSeconds !== "number" ||
    Number.isNaN(totalSeconds) ||
    totalSeconds < 0
  ) {
    return "00s"
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours === 0 && minutes === 0 && seconds === 0) {
    return "0s"
  }

  const hoursLabel = hours > 0 ? ` ${hours}h` : ""
  const minutesLabel = minutes > 0 ? ` ${minutes}m` : ""
  const secondsLabel = seconds > 0 ? ` ${seconds}s` : ""

  return `${hoursLabel}${minutesLabel}${secondsLabel}`.trim()
}
