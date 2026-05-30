import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  fullScreen?: boolean
}

export default function LoadingOverlay({
  isVisible,
  message = "Carregando...",
  fullScreen = true,
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300",
        fullScreen
          ? "fixed inset-0 z-50"
          : "absolute inset-0 rounded-lg",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2
          className="h-8 w-8 animate-spin text-accent-cyan"
          aria-hidden="true"
        />
        <p className="text-base font-medium text-white">{message}</p>
      </div>
    </div>
  )
}
