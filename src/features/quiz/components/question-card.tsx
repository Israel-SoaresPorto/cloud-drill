import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Flag } from "lucide-react"
import type { Question, QuestionAnswer } from "@/types/question"
import AnswerOptionsGroup from "./answer-options-group"

type QuestionCardProps = {
  question: Question
  selectedOptionIds: QuestionAnswer["selectedOptionIds"]
  revealed: boolean
  disabled?: boolean
  isMarkedForReview?: boolean
  onSelectionChange: (nextSelected: QuestionAnswer["selectedOptionIds"]) => void
  onToggleReview?: () => void
}

export default function QuestionCard({
  question,
  selectedOptionIds,
  revealed,
  disabled = false,
  isMarkedForReview = false,
  onToggleReview = () => {},
  onSelectionChange,
}: QuestionCardProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Badge
            variant="outline"
            className="border-accent-cyan bg-accent-cyan/10 px-4 py-2 text-sm text-accent-cyan"
          >
            {question.domain}
          </Badge>

          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-pressed={isMarkedForReview}
            className={cn(
              "shrink-0 border-idle bg-transparent text-secondary-tx hover:bg-option hover:text-primary-tx",
              isMarkedForReview &&
                "border-accent-cyan bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20"
            )}
            onClick={onToggleReview}
          >
            <Flag className="size-3.5" aria-hidden="true" />
            {isMarkedForReview ? "Remover revisão" : "Marcar para revisão"}
          </Button>
        </div>

        <p className="text-base leading-7 text-primary-tx md:text-lg">
          {question.question}
        </p>
      </div>

      <AnswerOptionsGroup
        question={question}
        selectedOptionIds={selectedOptionIds}
        revealed={revealed}
        disabled={disabled}
        onSelectionChange={onSelectionChange}
      />
    </section>
  )
}
