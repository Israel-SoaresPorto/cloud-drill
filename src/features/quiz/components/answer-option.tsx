import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

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
  const isCorrect = state === "correct"
  const isWrong = state === "wrong"

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-md border-2 bg-option px-3 py-3 text-sm transition-colors focus-within:ring-2 focus-within:ring-muted/75 focus-within:ring-offset-0",
        !disabled && "hover:bg-option-hover",
        state === "idle" && "border-idle text-secondary-tx",
        state === "selected" &&
          "border-accent-orange bg-accent-orange/10 text-primary-tx focus-within:ring-accent-orange/30 focus-within:ring-offset-0 hover:bg-accent-orange/20",
        isCorrect &&
          "border-correct bg-correct/10 text-correct focus-within:ring-correct/30 focus-within:ring-offset-0 hover:bg-correct/20",
        isWrong &&
          "border-wrong bg-wrong/10 text-wrong focus-within:ring-wrong/30 focus-within:ring-offset-0 hover:bg-wrong/20",
        disabled && "cursor-not-allowed opacity-90"
      )}
    >
      <input
        id={id}
        type={control}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-4 shrink-0 items-center justify-center border text-xs",
          control === "radio" ? "rounded-full" : "rounded-xs",
          checked ? "border-accent-orange" : "border-secondary-tx/60",
          isCorrect && "border-correct",
          isWrong && "border-wrong"
        )}
      >
        {checked &&
          (control === "checkbox" ? (
            <Check
              className={cn(
                "size-2 stroke-8",
                checked && "text-accent-orange",
                isCorrect && "text-correct",
                isWrong && "text-wrong"
              )}
            />
          ) : (
            <span
              className={cn(
                "size-2 rounded-full",
                checked && "bg-accent-orange",
                isCorrect && "bg-correct",
                isWrong && "bg-wrong"
              )}
            ></span>
          ))}
      </span>

      <span className="inline-flex items-center gap-1.5">
        <span className="font-semibold uppercase">{optionLabel}</span>
        <span>{optionText}</span>
      </span>
    </label>
  )
}
