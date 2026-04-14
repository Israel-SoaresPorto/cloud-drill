import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type QuizHeaderProps = {
  certificationLabel: string
  currentQuestion: number
  totalQuestions: number
  timerLabel: string
  onFinish: () => void
  onExit: () => void
}

export default function QuizHeader({
  certificationLabel,
  currentQuestion,
  totalQuestions,
  timerLabel,
  onFinish,
  onExit,
}: QuizHeaderProps) {
  return (
    <header className="flex place-content-center border-b border-secondary bg-card px-6 py-6 md:px-8 lg:px-12">
      <div className="flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-6">
        <Badge
          variant="outline"
          className="border-accent-orange bg-accent-orange/10 px-4 py-2 text-sm text-accent-orange"
        >
          {certificationLabel}
        </Badge>

        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Questão <span className="font-bold">{currentQuestion}</span> de{" "}
            <span className="font-bold">{totalQuestions}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-idle bg-option px-3 py-1.5 text-sm text-primary-tx">
            <span
              className="size-1.5 rounded-full bg-accent-cyan"
              aria-hidden="true"
            />
            <span>{timerLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-idle bg-transparent text-secondary-tx hover:bg-option hover:text-primary-tx"
              onClick={onExit}
            >
              Sair
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-accent-orange text-[#0e0c1a] hover:bg-accent-orange/90"
              onClick={onFinish}
            >
              Finalizar
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
