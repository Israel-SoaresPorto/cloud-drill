import { CircleX } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Question, QuestionAnswer } from "@/types/question"

type QuizExplanationProps = {
  question: Question
  answer: QuestionAnswer
}

export default function QuizExplanation({
  question,
  answer,
}: QuizExplanationProps) {
  const isCorrect = answer.isCorrect

  return (
    <section
      className={cn(
        "rounded-md border bg-card p-4",
        isCorrect ? "border-correct/70" : "border-wrong/80"
      )}
      aria-live="polite"
      aria-describedby="explanation-title"
    >
      <div className="mb-4 flex items-center gap-2">
        {!isCorrect && <CircleX className="size-5 text-wrong" />}
        <h3
          className={cn(
            "text-xl font-semibold",
            isCorrect ? "text-correct" : "text-wrong"
          )}
          id="explanation-title"
        >
          {isCorrect ? "Resposta Correta!" : "Resposta Incorreta!"}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-1 text-xs font-bold tracking-[0.08em] text-primary-tx uppercase">
            Explicação
          </p>
          <p className="text-sm leading-6 text-secondary-tx">
            {question.explanation.general}
          </p>
        </div>

        <div className="h-px w-full bg-idle" />

        <div className="space-y-2">
          <p className="text-sm font-semibold text-primary-tx">
            Por que as outras estão incorretas?
          </p>

          {(
            Object.entries(question.explanation.incorrects) as Array<
              [string, string]
            >
          ).map(([optionId, reason]) => (
            <p key={optionId} className="text-sm leading-6 text-secondary-tx">
              <span className="mr-1 font-semibold text-wrong uppercase">
                {optionId}:
              </span>
              {reason}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
