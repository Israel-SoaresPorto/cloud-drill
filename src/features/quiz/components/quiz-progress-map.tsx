import { Check, Flag } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QuizSession } from "@/types/quiz"

type QuizProgressMapProps = {
  session: QuizSession
  currentIndex: number
  onJumpToQuestion: (questionIndex: number) => void
  className?: string
}

function getQuestionButtonClassName({
  isCurrent,
  isAnswered,
  isReviewed,
}: {
  isCurrent: boolean
  isAnswered: boolean
  isReviewed: boolean
}) {
  return cn(
    "flex size-7 items-center justify-center rounded-lg border text-2xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
    isCurrent &&
      "border-accent-orange bg-accent-orange/15 text-primary-tx ring-2 ring-accent-orange/25",
    !isCurrent && isAnswered && "border-correct/35 bg-correct/10 text-correct",
    !isCurrent &&
      !isAnswered &&
      isReviewed &&
      "border-muted/45 bg-muted/10 text-muted",
    !isCurrent &&
      !isAnswered &&
      !isReviewed &&
      "border-idle bg-option text-secondary-tx hover:bg-option-hover"
  )
}

export default function QuizProgressMap({
  session,
  currentIndex,
  onJumpToQuestion,
  className,
}: QuizProgressMapProps) {
  const answeredCount = session.questions.filter((question) => {
    return !!session.answers[question.id]?.selectedOptionIds.length
  }).length
  const reviewedCount = Object.values(session.reviewFlags ?? {}).filter(
    Boolean
  ).length

  return (
    <section
      className={cn("@container/main space-y-4", className)}
      aria-label="Mapa das questões"
    >
      <div className="flex flex-col gap-4">
        <header className="w-full">
          <span className="flex flex-col gap-y-1 text-xs font-medium text-secondary-tx @3xs:flex-row @3xs:gap-x-4">
            <span>
              {answeredCount}/{session.questions.length} respondidas
            </span>
            <span>{reviewedCount} para revisão</span>
          </span>
        </header>

        <div className="space-y-4">
          <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(1.75rem,1fr))] justify-items-center gap-2">
            {session.questions.map((question, index) => {
              const isCurrent = index === currentIndex
              const isAnswered =
                !!session.answers[question.id]?.selectedOptionIds.length
              const isReviewed = session.reviewFlags?.[question.id] ?? false

              return (
                <button
                  key={question.id}
                  type="button"
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Questão ${index + 1}${isAnswered ? ", respondida" : ""}${isReviewed ? ", marcada para revisão" : ""}${isCurrent ? ", atual" : ""}`}
                  data-current={isCurrent}
                  data-answered={isAnswered}
                  data-reviewed={isReviewed}
                  className={getQuestionButtonClassName({
                    isCurrent,
                    isAnswered,
                    isReviewed,
                  })}
                  onClick={() => onJumpToQuestion(index)}
                >
                  {!isAnswered && !isReviewed && <span>{index + 1}</span>}
                  {isAnswered && (
                    <Check className="size-3" aria-hidden="true" />
                  )}
                  {isReviewed && !isAnswered && (
                    <Flag className="size-3" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap @xs:justify-between gap-3 text-xs text-secondary-tx">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accent-orange" />
              Atual
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accent-cyan" />
              Respondida
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-muted" />
              Revisão
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-idle" />
              Pendente
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
