import { Button } from "@/components/ui/button"

type QuizNavigationProps = {
  canGoPrevious: boolean
  canGoNext: boolean
  canConfirm: boolean
  isAnswered: boolean
  isSimulatedMode: boolean
  onPrevious: () => void
  onNext: () => void
  onConfirm: () => void
}

export default function QuizNavigation({
  canGoPrevious,
  canGoNext,
  canConfirm,
  isAnswered,
  isSimulatedMode,
  onPrevious,
  onNext,
  onConfirm,
}: QuizNavigationProps) {
  const canConfirmAction = isAnswered ? !canGoNext : !canConfirm

  const confirmAction = isAnswered || isSimulatedMode ? onNext : onConfirm

  return (
    <div className="flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={!canGoPrevious}
        className="grow basis-40 border border-muted/25 xs:grow-0"
        onClick={onPrevious}
      >
        Anterior
      </Button>

      <Button
        type="button"
        size="lg"
        disabled={canConfirmAction || (isAnswered && isSimulatedMode)}
        className="grow basis-40 xs:grow-0"
        onClick={confirmAction}
        title={isAnswered ? "Próxima questão" : "Confirmar resposta"}
      >
        {isAnswered || isSimulatedMode ? "Próxima" : "Confirmar resposta"}
      </Button>
    </div>
  )
}
