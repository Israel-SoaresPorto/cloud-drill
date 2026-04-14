import type { Question, QuestionAnswer } from "@/types/question"
import AnswerOption from "./answer-option"

type AnswerOptionsGroupProps = {
  question: Question
  selectedOptionIds: QuestionAnswer["selectedOptionIds"]
  revealed: boolean
  disabled?: boolean
  onSelectionChange: (nextSelected: QuestionAnswer["selectedOptionIds"]) => void
}

function computeOptionState(
  optionId: Question["options"][number]["id"],
  question: Question,
  selectedOptionIds: QuestionAnswer["selectedOptionIds"],
  revealed: boolean
): "idle" | "selected" | "correct" | "wrong" {
  const selected = selectedOptionIds.includes(optionId)

  if (!revealed) {
    return selected ? "selected" : "idle"
  }

  const isCorrect = question.correctAnswers.includes(optionId)
  if (isCorrect) {
    return "correct"
  }

  if (selected && !isCorrect) {
    return "wrong"
  }

  return "idle"
}

export default function AnswerOptionsGroup({
  question,
  selectedOptionIds,
  revealed,
  disabled = false,
  onSelectionChange,
}: AnswerOptionsGroupProps) {
  const currentSelected = selectedOptionIds
  const groupName = `question-${question.id}`
  const control = question.type === "single" ? "radio" : "checkbox"

  return (
    <fieldset className="space-y-3" aria-label="Alternativas da questão">
      {question.options.map((option) => {
        const optionId = `${question.id}-${option.id}`
        const checked = currentSelected.includes(option.id)
        const optionState = computeOptionState(
          option.id,
          question,
          currentSelected,
          revealed
        )

        return (
          <AnswerOption
            key={option.id}
            id={optionId}
            name={groupName}
            control={control}
            optionLabel={`${option.id}.`}
            optionText={option.text}
            checked={checked}
            state={optionState}
            disabled={disabled}
            onCheckedChange={(isChecked) => {
              if (disabled) {
                return
              }

              if (control === "radio") {
                onSelectionChange(isChecked ? [option.id] : [])
                return
              }

              if (isChecked) {
                onSelectionChange([...currentSelected, option.id])
                return
              }

              onSelectionChange(
                currentSelected.filter((selectedId) => selectedId !== option.id)
              )
            }}
          />
        )
      })}
    </fieldset>
  )
}
