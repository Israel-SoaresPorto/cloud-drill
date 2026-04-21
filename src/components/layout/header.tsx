import { Moon, SunMedium } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { Link } from "react-router"
import Logo from "@/assets/logo.svg"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="flex items-center justify-between border-b border-accent/20 px-4 py-4 md:px-8 lg:px-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
      >
        <img
          src={Logo}
          alt="CloudDrill Logo"
          className="size-8 rounded-sm object-cover"
        />
        <span className="text-lg font-medium text-foreground">
          Cloud<strong className="text-accent-orange">Drill</strong>
        </span>
      </Link>

      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className="bg-muted/5 dark:bg-muted/5 rounded-full p-0 hover:bg-muted/25"
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
