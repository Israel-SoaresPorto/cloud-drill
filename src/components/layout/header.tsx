import { Home, Moon, SunMedium } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Link } from "react-router"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="flex items-center justify-between border-b border-accent/20 px-4 py-4 md:px-8 lg:px-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-xl border border-white/5 bg-card/80 text-accent shadow-sm">
          <Home className="size-4" />
        </span>
        <span className="text-lg font-semibold">CloudDrill</span>
      </Link>

      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="gap-2 rounded-xl border-white/10 bg-card/60 px-3 text-muted shadow-none hover:bg-card/80 hover:text-foreground"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={
          isDark ? "Alternar para tema claro" : "Alternar para tema escuro"
        }
      >
        {isDark ? (
          <SunMedium className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </Button>
    </header>
  )
}
