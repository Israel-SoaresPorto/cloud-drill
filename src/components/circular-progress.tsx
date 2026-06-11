import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
  renderLabel?: (
    percent?: number,
    value?: number,
    max?: number
  ) => React.ReactNode
}

export function CircularProgress({
  value,
  max = 100,
  size = "lg",
  className,
  renderLabel,
}: CircularProgressProps) {
  const sizeMap = {
    sm: 100,
    md: 120,
    lg: 150,
  }

  const strokeWidth = {
    sm: 4,
    md: 6,
    lg: 8,
  }

  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const svgSize = sizeMap[size]
  const radius = (svgSize - strokeWidth[size]) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const getColor = (percent: number) => {
    if (percent >= 70) return "#22c55e" // green/correct
    if (percent >= 40) return "#eab308" // yellow/tolerable
    return "#ef4444" // red/wrong
  }

  return (
    <div className={cn("relative", className)}>
      <svg
        width={svgSize}
        height={svgSize}
        className="-rotate-90 transform"
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          className="text-muted/50"
        />

        {/* Progress circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth[size]}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>

      {renderLabel && (
        <div className="absolute inset-0">
          {renderLabel(percentage, value, max)}
        </div>
      )}
    </div>
  )
}

export default CircularProgress
