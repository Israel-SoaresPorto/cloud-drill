import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimerLabel(totalSeconds: number | null | undefined) {
  if (typeof totalSeconds !== "number" || Number.isNaN(totalSeconds)) {
    return "00s"
  }

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const hoursLabel = hours > 0 ? `${hours}h` : ""
  const minutesLabel = minutes > 0 ? `${minutes}m` : ""
  const secondsLabel = seconds > 0 ? `${seconds}s` : ""

  return `${hoursLabel} ${minutesLabel} ${secondsLabel}`
}
