import { cn } from "@/lib/utils"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import type { QuestionAnswerDetail } from "@/types/quiz"
import { Check, X, type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QuestionReviewItemIndicatorProps {
  correct: boolean
  className?: string
}

export function QuestionReviewItemIndicator({
  correct,
  className,
}: QuestionReviewItemIndicatorProps) {
  const Icon: LucideIcon = correct ? Check : X

  return <Icon role="img" className={cn("size-3 stroke-4", className)} />
}

interface QuestionReviewItemProps {
  detail: QuestionAnswerDetail
  questionNumber: number
  onToggle?: (id: string) => void
}

export function QuestionReviewItem({
  detail,
  questionNumber,
  onToggle,
}: QuestionReviewItemProps) {
  // Determine the status indicator and colors
  const isCorrect = detail.isCorrect

  return (
    <AccordionItem
      value={detail.id}
      data-answer-correct={isCorrect}
      className="group border-0 bg-card"
      onOpenChange={() => {
        onToggle?.(detail.id)
      }}
    >
      <AccordionTrigger className="flex items-start gap-3 rounded-none px-4 py-3 transition-colors hover:no-underline group-answer-correct:hover:bg-correct/10 group-answer-incorrect:hover:bg-wrong/20">
        {/* Indicator badge */}
        <div
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white group-answer-correct:bg-correct group-answer-incorrect:bg-wrong"
          )}
        >
          <QuestionReviewItemIndicator correct={isCorrect} />
        </div>

        {/* Question info */}
        <div className="flex flex-1 flex-col items-start gap-1 text-left">
          <div className="flex gap-2 text-sm font-semibold text-primary-tx">
            <span>{questionNumber}</span>
            <span>•</span>
            <span>{detail.domain}</span>
          </div>
          <p className="line-clamp-2 text-xs text-muted-tx data-[open='true']:line-clamp-none">
            {detail.questionText}
          </p>
        </div>
      </AccordionTrigger>

      <AccordionContent className="space-y-4 px-4 py-4">
        {/* Options Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary-tx">Opções</h4>
          <div className="space-y-2">
            {detail.options.map((option) => {
              const isCorrectAnswer = detail.correctAnswers.includes(option.id)
              const isUserSelected = detail.selectedOptionIds.includes(
                option.id
              )

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-start justify-between gap-2 rounded-lg border-2 border-idle bg-option p-3 transition-colors data-[answer-correct='true']:border-correct data-[answer-correct='true']:bg-correct/10 data-[answer-wrong='true']:border-wrong data-[answer-wrong='true']:bg-wrong/10",
                    isCorrectAnswer && "border-correct bg-correct/10",
                    isUserSelected && !isCorrect && "border-wrong bg-wrong/10"
                  )}
                >
                  <span className="flex flex-1 gap-2 font-medium text-muted-tx">
                    <span
                      className={cn(
                        isCorrectAnswer && "text-correct",
                        isUserSelected && !isCorrect && "text-wrong"
                      )}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <p className="text-sm text-primary-tx">{option.text}</p>
                  </span>
                  <div className="self-start">
                    {isCorrectAnswer && (
                      <Badge className="rounded-sm bg-correct/20 text-2xs font-medium text-correct">
                        Correta
                      </Badge>
                    )}
                    {isUserSelected && !isCorrectAnswer && (
                      <Badge className="rounded-sm bg-wrong/20 text-2xs font-medium text-wrong">
                        Sua resposta
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Explanation Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary-tx">Explicação</h4>
          <div className="rounded-lg border-2 border-accent-cyan bg-accent-cyan/10 p-3">
            <p className="text-sm text-primary-tx">
              {detail.explanation.general}
            </p>
          </div>
        </div>

        {/* Incorrect Options Explanations Section */}
        {Object.keys(detail.explanation.incorrects).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-primary-tx">
              Por que outras opções estão erradas
            </h4>
            <div className="space-y-2">
              {Object.keys(detail.explanation.incorrects).map((optionId) => {
                const explanation =
                  detail.explanation.incorrects[
                    optionId as keyof typeof detail.explanation.incorrects
                  ]
                const option = detail.options.find((opt) => opt.id === optionId)
                const optionText = option?.text ?? "Opção desconhecida"

                return (
                  <div
                    key={optionId}
                    className="rounded-lg border-2 border-wrong bg-wrong/10 p-3"
                  >
                    <p className="mb-1 text-xs font-semibold text-wrong">
                      Opção {optionId.toUpperCase()}: {optionText}
                    </p>
                    <p className="text-sm text-primary-tx">{explanation}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
