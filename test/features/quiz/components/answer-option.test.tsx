import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import AnswerOption from "@/features/quiz/components/answer-option"

describe("AnswerOption", () => {
  test("aciona callback ao selecionar opção de rádio", () => {
    const onCheckedChange = vi.fn()

    render(
      <AnswerOption
        id="q1-a"
        name="q1"
        control="radio"
        optionLabel="a."
        optionText="Alternativa A"
        checked={false}
        onCheckedChange={onCheckedChange}
      />
    )

    fireEvent.click(screen.getByRole("radio", { name: /a\./i }))

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  test("renderiza checkbox marcado com ícone de check", () => {
    render(
      <AnswerOption
        id="q1-a"
        name="q1"
        control="checkbox"
        optionLabel="a."
        optionText="Alternativa A"
        checked
        state="selected"
        onCheckedChange={vi.fn()}
      />
    )

    expect(screen.getByRole("checkbox", { name: /a\./i })).toBeChecked()
    expect(document.querySelector("svg")).toBeInTheDocument()
  })

  test("respeita estado disabled", () => {
    const onCheckedChange = vi.fn()

    render(
      <AnswerOption
        id="q1-a"
        name="q1"
        control="checkbox"
        optionLabel="a."
        optionText="Alternativa A"
        checked={false}
        disabled
        onCheckedChange={onCheckedChange}
      />
    )

    const input = screen.getByRole("checkbox", { name: /a\./i })
    expect(input).toBeDisabled()

    const label = input.closest("label")
    expect(label?.className).toContain("cursor-not-allowed")
  })

  test("aplica estado de selecionado", () => {
    render(
      <AnswerOption
        id="q1-a"
        name="q1"
        control="radio"
        optionLabel="a."
        optionText="Alternativa A"
        checked
        state="selected"
        onCheckedChange={vi.fn()}
      />
    )

    const label = screen.getByRole("radio", { name: /a\./i }).closest("label")
    expect(label).toHaveAttribute("data-answer-state", "selected")
  })

  test("aplica estado de correto", () => {
    render(
      <AnswerOption
        id="q1-a"
        name="q1"
        control="radio"
        optionLabel="a."
        optionText="Alternativa A"
        checked
        state="correct"
        onCheckedChange={vi.fn()}
      />
    )

    const label = screen.getByRole("radio", { name: /a\./i }).closest("label")
    expect(label).toHaveAttribute("data-answer-state", "correct")
  })

  test("aplica estado de errado", () => {
    render(
      <AnswerOption
        id="q1-a"
        name="q1"
        control="radio"
        optionLabel="a."
        optionText="Alternativa A"
        checked
        state="wrong"
        onCheckedChange={vi.fn()}
      />
    )

    const label = screen.getByRole("radio", { name: /a\./i }).closest("label")
    expect(label).toHaveAttribute("data-answer-state", "wrong")
  })
})
