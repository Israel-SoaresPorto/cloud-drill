import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import QuizNavigation from "@/features/quiz/components/quiz-navigation"

describe("QuizNavigation", () => {
  test("quando não respondida usa ação de confirmar", () => {
    const onConfirm = vi.fn()

    render(
      <QuizNavigation
        canGoPrevious={false}
        canGoNext={true}
        canConfirm={true}
        isAnswered={false}
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        onConfirm={onConfirm}
      />
    )

    const previousButton = screen.getByRole("button", { name: "Anterior" })
    const actionButton = screen.getByRole("button", {
      name: "Confirmar resposta",
    })

    expect(previousButton).toBeDisabled()

    fireEvent.click(actionButton)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  test("quando respondida usa ação de próxima", () => {
    const onNext = vi.fn()

    render(
      <QuizNavigation
        canGoPrevious={true}
        canGoNext={true}
        canConfirm={false}
        isAnswered
        onPrevious={vi.fn()}
        onNext={onNext}
        onConfirm={vi.fn()}
      />
    )

    const actionButton = screen.getByRole("button", { name: "Próxima" })
    fireEvent.click(actionButton)

    expect(onNext).toHaveBeenCalledTimes(1)
  })

  test("retorna para questão anterior quando respondida", () => {
    const onPrevious = vi.fn()

    render(
      <QuizNavigation
        canGoPrevious={true}
        canGoNext={true}
        canConfirm={false}
        isAnswered
        onPrevious={onPrevious}
        onNext={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    const previousButton = screen.getByRole("button", { name: "Anterior" })
    fireEvent.click(previousButton)

    expect(onPrevious).toHaveBeenCalledTimes(1)
  })

  test("desabilita próxima quando respondida mas sem próximo índice", () => {
    render(
      <QuizNavigation
        canGoPrevious={true}
        canGoNext={false}
        canConfirm={false}
        isAnswered
        onPrevious={vi.fn()}
        onNext={vi.fn()}
        onConfirm={vi.fn()}
      />
    )

    expect(screen.getByRole("button", { name: "Próxima" })).toBeDisabled()
  })
})
