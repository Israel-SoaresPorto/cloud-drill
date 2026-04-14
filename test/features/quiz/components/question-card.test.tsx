import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import QuestionCard from "@/features/quiz/components/question-card"
import { makeQuestion } from "../../../utils/question"

describe("QuestionCard", () => {
  test("renderiza domínio, enunciado e propaga seleção", () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts")
    const onSelectionChange = vi.fn()

    render(
      <QuestionCard
        question={question}
        selectedOptionIds={[]}
        revealed={false}
        onSelectionChange={onSelectionChange}
      />
    )

    expect(screen.getByText("Conceitos de Nuvem")).toBeInTheDocument()
    expect(screen.getByText("Question 010")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("radio", { name: /a\./i }))
    expect(onSelectionChange).toHaveBeenCalledWith(["a"])
  })

  test("quando revelado seleciona alternativa", () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts", "single", [
      "c",
    ])
    const onSelectionChange = vi.fn()

    render(
      <QuestionCard
        question={question}
        selectedOptionIds={["c"]}
        revealed={false}
        onSelectionChange={onSelectionChange}
      />
    )

    const optionC = screen.getByRole("radio", { name: /c\./i })

    fireEvent.click(optionC)

    expect(optionC.closest("label")?.className).toContain(
      "border-accent-orange"
    )
  })

  test("quando revelado marca alternativa correta e errada (única escolha)", () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts")

    render(
      <QuestionCard
        question={question}
        selectedOptionIds={["c"]}
        revealed
        onSelectionChange={vi.fn()}
      />
    )

    const optionA = screen.getByRole("radio", { name: /a\./i })
    const optionC = screen.getByRole("radio", { name: /c\./i })

    expect(optionA).not.toBeChecked()
    expect(optionC).toBeChecked()

    expect(optionA.closest("label")?.className).toContain("border-correct")
    expect(optionC.closest("label")?.className).toContain("border-wrong")
  })

  test("quando revelado marca alternativa correta e errada (múltipla escolha)", () => {
    const question = makeQuestion(
      "011",
      "CLF_002-security-and-compliance",
      "multiple",
      ["a", "b"]
    )

    render(
      <QuestionCard
        question={question}
        selectedOptionIds={["a", "c"]}
        revealed
        onSelectionChange={vi.fn()}
      />
    )

    const optionA = screen.getByRole("checkbox", { name: /a\./i })
    const optionB = screen.getByRole("checkbox", { name: /b\./i })
    const optionC = screen.getByRole("checkbox", { name: /c\./i })

    expect(optionA).toBeChecked()
    expect(optionB).not.toBeChecked()
    expect(optionC).toBeChecked()

    expect(optionA.closest("label")?.className).toContain("border-correct")
    expect(optionB.closest("label")?.className).toContain("border-correct")
    expect(optionC.closest("label")?.className).toContain("border-wrong")
  })

  test("desabilita opções quando revelado", () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts")

    render(
      <QuestionCard
        question={question}
        selectedOptionIds={["c"]}
        revealed
        disabled
        onSelectionChange={vi.fn()}
      />
    )

    const options = screen.getAllByRole("radio")

    options.forEach((option) => {
      expect(option).toBeDisabled()
      expect(option.closest("label")?.className).toContain("cursor-not-allowed")
    })
  })
})
