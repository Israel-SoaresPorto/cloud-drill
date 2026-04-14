import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import QuizAlert from "@/components/alert"

describe("QuizAlert", () => {
  test("renderiza conteúdo e confirma ação", () => {
    const onConfirm = vi.fn()

    render(
      <QuizAlert
        title="Sair do quiz"
        description="Seu progresso será perdido"
        open
        onConfirm={onConfirm}
      />
    )

    expect(screen.getByText("Sair do quiz")).toBeInTheDocument()
    expect(screen.getByText("Seu progresso será perdido")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
