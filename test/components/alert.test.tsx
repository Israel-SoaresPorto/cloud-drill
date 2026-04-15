import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import Alert from "@/components/alert"

describe("Alert", () => {
  test("renderiza conteúdo e confirma ação", () => {
    const onConfirm = vi.fn()

    render(
      <Alert
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
