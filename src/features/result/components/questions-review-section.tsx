import { useState } from "react"
import { Button } from "@/components/ui/button"
import { QuestionReviewItem } from "./question-review-item"
import type { QuestionAnswerDetail } from "@/types/quiz"
import { Accordion } from "@/components/ui/accordion"
import type { QuestionID } from "@/types/question"

interface QuestionsReviewSectionProps {
  details: QuestionAnswerDetail[]
}

export function QuestionsReviewSection({
  details,
}: QuestionsReviewSectionProps) {
  const [expandedValues, setExpandedValues] = useState<QuestionID[]>([])

  const toggleExpanded = (questionId: QuestionID) => {
    setExpandedValues((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    )
  }

  const expandAll = () => {
    setExpandedValues(details.map((d) => d.id))
  }

  const collapseAll = () => {
    setExpandedValues([])
  }

  return (
    <section className="space-y-4">
      {/* Header with title and stats */}
      <div className="flex justify-between">
        <h2 className="text-text-primary font-semibold">Revisão de Questões</h2>
        {/* Expand/Collapse button */}
        <Button
          onClick={() => {
            if (expandedValues.length === details.length) {
              collapseAll()
            } else {
              expandAll()
            }
          }}
          variant="outline"
        >
          {expandedValues.length === details.length
            ? "Recolher tudo"
            : "Expandir tudo"}
        </Button>
      </div>

      {/* Questions list */}
      <Accordion
        multiple
        className="w-full border border-border"
        value={expandedValues}
      >
        {details.map((detail, index) => (
          <QuestionReviewItem
            key={detail.id}
            detail={detail}
            questionNumber={index + 1}
            onToggle={(id) => toggleExpanded(id as QuestionID)}
          />
        ))}
      </Accordion>
    </section>
  )
}
