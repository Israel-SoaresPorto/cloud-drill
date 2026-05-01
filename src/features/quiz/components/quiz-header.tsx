import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import logo from "@/assets/logo.svg"
import { Grip } from "lucide-react"

type QuizHeaderProps = {
  certificationLabel: string
  currentQuestion: number
  totalQuestions: number
  timerLabel: string
  onFinish: () => void
  onExit: () => void
  onOpenProgressMap: () => void
}

export default function QuizHeader({
  certificationLabel,
  currentQuestion,
  totalQuestions,
  timerLabel,
  onFinish,
  onExit,
  onOpenProgressMap,
}: QuizHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex place-content-center border-b border-secondary bg-card px-4 py-4 md:px-8 lg:px-12">
      <div className="flex w-full max-w-screen-2xl items-center justify-between gap-x-4 gap-y-6">
        <div className="flex gap-4">
          <img src={logo} alt="Logo do Cloud Drill" className="w-8" />
          <Badge
            variant="outline"
            className="hidden border-accent-orange bg-accent-orange/10 px-4 py-2 text-xs text-accent-orange sm:block"
          >
            {certificationLabel}
          </Badge>
        </div>

        <div className="justify-self-end text-sm text-muted-foreground">
          <div className="hidden xs:inline">
            Questão <span className="font-bold">{currentQuestion}</span> de{" "}
            <span className="font-bold">{totalQuestions}</span>
          </div>
          <div className="inline xs:hidden">
            <span className="font-bold">
              {currentQuestion}/{totalQuestions}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div
            className="inline-flex items-center gap-2 rounded-md border border-idle bg-option px-3 py-1.5 text-sm text-primary-tx"
            role="timer"
            aria-live="polite"
          >
            <span
              className="size-1.5 rounded-full bg-accent-cyan"
              aria-hidden="true"
            />
            <span>{timerLabel}</span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-idle bg-transparent text-secondary-tx hover:bg-option hover:text-primary-tx"
              onClick={onExit}
            >
              Sair
            </Button>
            <Button type="button" size="sm" onClick={onFinish}>
              Finalizar
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Abrir mapa de questões"
            className="hover:bg-muted/10 lg:hidden"
            onClick={onOpenProgressMap}
          >
            <Grip className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
