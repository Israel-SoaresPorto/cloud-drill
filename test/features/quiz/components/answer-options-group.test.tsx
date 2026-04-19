import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import AnswerOptionsGroup from "@/features/quiz/components/answer-options-group"
import { makeQuestion } from "../../../utils/question"

describe("AnswerOptionsGroup", () => {
  test("em questão single substitui seleção anterior", () => {
    const question = makeQuestion("001", "CLF_002-cloud-concepts")
    const onSelectionChange = vi.fn()

    render(
      <AnswerOptionsGroup
        question={question}
        selectedOptionIds={["a"]}
        revealed={false}
        onSelectionChange={onSelectionChange}
      />
    )

    fireEvent.click(screen.getByRole("radio", { name: /b\./i }))

    expect(onSelectionChange).toHaveBeenCalledWith(["b"])
  })

  test("em questão multiple adiciona e remove seleção", () => {
    const question = makeQuestion(
      "002",
      "CLF_002-security-and-compliance",
      "multiple",
      ["a", "b"]
    )

    const onSelectionChange = vi.fn()

    const { rerender } = render(
      <AnswerOptionsGroup
        question={question}
        selectedOptionIds={["a"]}
        revealed={false}
        onSelectionChange={onSelectionChange}
      />
    )

    fireEvent.click(screen.getByRole("checkbox", { name: /b\./i }))
    expect(onSelectionChange).toHaveBeenCalledWith(["a", "b"])

    rerender(
      <AnswerOptionsGroup
        question={question}
        selectedOptionIds={["a", "b"]}
        revealed={false}
        onSelectionChange={onSelectionChange}
      />
    )

    fireEvent.click(screen.getByRole("checkbox", { name: /a\./i }))
    expect(onSelectionChange).toHaveBeenCalledWith(["b"])
  })

  test("não altera seleção quando disabled", () => {
    const question = makeQuestion("003", "CLF_002-aws-technologies")
    const onSelectionChange = vi.fn()

    render(
      <AnswerOptionsGroup
        question={question}
        selectedOptionIds={[]}
        revealed={false}
        disabled
        onSelectionChange={onSelectionChange}
      />
    )

    fireEvent.click(screen.getByRole("radio", { name: /a\./i }))

    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  test("quando revelado marca alternativa correta e errada (uníca escolha)", () => {
    const question = makeQuestion("004", "CLF_002-billing-and-pricing")

    render(
      <AnswerOptionsGroup
        question={question}
        selectedOptionIds={["b"]}
        revealed
        onSelectionChange={vi.fn()}
      />
    )

    const optionA = screen.getByRole("radio", { name: /a\./i }).closest("label")
    const optionB = screen.getByRole("radio", { name: /b\./i }).closest("label")

    expect(optionA).toHaveAttribute("data-answer-state", "correct")
    expect(optionB).toHaveAttribute("data-answer-state", "wrong")
  })

  test("quando revelado marca alternativas corretas e erradas (múltipla escolha)", () => {
    const question = makeQuestion("005", "CLF_002-architecting", "multiple", [
      "a",
      "c",
    ])

    render(
      <AnswerOptionsGroup
        question={question}
        selectedOptionIds={["a", "b"]}
        revealed
        onSelectionChange={vi.fn()}
      />
    )

    const optionA = screen
      .getByRole("checkbox", { name: /a\./i })
      .closest("label")
    const optionB = screen
      .getByRole("checkbox", { name: /b\./i })
      .closest("label")
    const optionC = screen
      .getByRole("checkbox", { name: /c\./i })
      .closest("label")
    const optionD = screen
      .getByRole("checkbox", { name: /d\./i })
      .closest("label")

    expect(optionA).toHaveAttribute("data-answer-state", "correct")
    expect(optionB).toHaveAttribute("data-answer-state", "wrong")
    expect(optionC).toHaveAttribute("data-answer-state", "correct")
    expect(optionD).toHaveAttribute("data-answer-state", "idle")
  })
})
