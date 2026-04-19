import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type AnswerOptionProps = {
  id: string
  name: string
  control: "radio" | "checkbox"
  optionLabel: string
  optionText: string
  checked: boolean
  disabled?: boolean
  state?: "idle" | "selected" | "correct" | "wrong"
  onCheckedChange: (checked: boolean) => void
}

export default function AnswerOption({
  id,
  name,
  control,
  optionLabel,
  optionText,
  checked,
  disabled = false,
  state = "idle",
  onCheckedChange,
}: AnswerOptionProps) {
  return (
    <label
      htmlFor={id}
      data-answer-state={state}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-3 rounded-md border-2 bg-option px-3 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-muted/75 focus-within:ring-offset-0 has-not-disabled:hover:bg-option-hover has-disabled:cursor-not-allowed has-disabled:opacity-90",
        "answer-correct:border-correct answer-correct:bg-correct/10 answer-correct:text-correct answer-correct:focus-within:ring-correct/30 answer-correct:hover:bg-correct/20",
        "answer-idle:border-idle answer-idle:text-secondary-tx",
        "answer-selected:hover:bg-selected/20 answer-selected:border-accent-orange answer-selected:bg-accent-orange/10 answer-selected:focus-within:ring-accent-orange/30 answer-selected:hover:bg-accent-orange/20",
        "answer-wrong:border-wrong answer-wrong:bg-wrong/10 answer-wrong:text-wrong answer-wrong:focus-within:ring-wrong/30 answer-wrong:hover:bg-wrong/20"
      )}
    >
      <input
        id={id}
        type={control}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center border text-xs peer-not-checked:border-secondary-tx/60 peer-checked:border-accent-orange",
          "peer-checkbox-checked:bg-accent-orange peer-[input[type='checkbox']]:rounded-sm peer-[input[type='radio']]:rounded-full",
          "group-answer-correct:peer-not-checked:border-correct group-answer-correct:peer-checked:border-correct group-answer-correct:peer-checkbox-checked:bg-correct",
          "group-answer-wrong:peer-not-checked:border-wrong group-answer-wrong:peer-checked:border-wrong group-answer-wrong:peer-checkbox-checked:bg-wrong"
        )}
      >
        {checked &&
          (control === "checkbox" ? (
            <Check className="size-2 stroke-8 text-white" />
          ) : (
            <span className="size-2 rounded-full group-answer-selected:bg-accent-orange group-answer-correct:bg-correct group-answer-wrong:bg-wrong"></span>
          ))}
      </span>

      <span className="inline-flex items-center gap-1.5">
        <span className="font-semibold uppercase">{optionLabel}</span>
        <span>{optionText}</span>
      </span>
    </label>
  )
}
