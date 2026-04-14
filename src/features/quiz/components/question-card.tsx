import { Badge } from "@/components/ui/badge"
import type { Question, QuestionAnswer } from "@/types/question"
import AnswerOptionsGroup from "./answer-options-group"

type QuestionCardProps = {
  question: Question
  selectedOptionIds: QuestionAnswer["selectedOptionIds"]
  revealed: boolean
  disabled?: boolean
  onSelectionChange: (nextSelected: QuestionAnswer["selectedOptionIds"]) => void
}

export default function QuestionCard({
  question,
  selectedOptionIds,
  revealed,
  disabled = false,
  onSelectionChange,
}: QuestionCardProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <Badge
          variant="outline"
          className="border-accent-cyan bg-accent-cyan/10 px-4 py-2 text-sm text-accent-cyan"
        >
          {question.domain}
        </Badge>

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
