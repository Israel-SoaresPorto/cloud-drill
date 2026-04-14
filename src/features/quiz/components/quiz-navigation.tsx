import { Button } from "@/components/ui/button"

type QuizNavigationProps = {
  canGoPrevious: boolean
  canGoNext: boolean
  canConfirm: boolean
  isAnswered: boolean
  onPrevious: () => void
  onNext: () => void
  onConfirm: () => void
}

export default function QuizNavigation({
  canGoPrevious,
  canGoNext,
  canConfirm,
  isAnswered,
  onPrevious,
  onNext,
  onConfirm,
}: QuizNavigationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        disabled={!canGoPrevious}
        className="grow basis-40 xs:grow-0"
        onClick={onPrevious}
      >
        Anterior
      </Button>

      <Button
        type="button"
        size="lg"
        disabled={isAnswered ? !canGoNext : !canConfirm}
        className="grow basis-40 xs:grow-0"
        onClick={isAnswered ? onNext : onConfirm}
      >
        {isAnswered ? "Próxima" : "Confirmar resposta"}
      </Button>
    </div>
  )
}
