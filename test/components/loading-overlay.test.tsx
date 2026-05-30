import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import LoadingOverlay from "@/components/loading-overlay"

describe("LoadingOverlay", () => {
  test("não renderiza quando isVisible é false", () => {
    const { container } = render(<LoadingOverlay isVisible={false} />)
    expect(container.firstChild).toBeNull()
  })

  test("renderiza com mensagem padrão quando isVisible é true", () => {
    render(<LoadingOverlay isVisible={true} />)
    expect(screen.getByText("Carregando...")).toBeInTheDocument()
  })

  test("renderiza com mensagem customizada", () => {
    render(
      <LoadingOverlay isVisible={true} message="Processando dados..." />
    )
    expect(screen.getByText("Processando dados...")).toBeInTheDocument()
  })

  test("aplica classes de fullScreen por padrão", () => {
    const { container } = render(<LoadingOverlay isVisible={true} />)
    const overlay = container.querySelector("div[role='status']")
    expect(overlay).toHaveClass("fixed", "inset-0", "z-50")
  })

  test("aplica classes de overlay contido quando fullScreen é false", () => {
    const { container } = render(
      <LoadingOverlay isVisible={true} fullScreen={false} />
    )
    const overlay = container.querySelector("div[role='status']")
    expect(overlay).toHaveClass("absolute", "inset-0", "rounded-lg")
    expect(overlay).not.toHaveClass("fixed", "z-50")
  })

  test("define atributos de acessibilidade corretamente", () => {
    render(
      <LoadingOverlay isVisible={true} message="Carregando dados" />
    )
    const overlay = screen.getByRole("status")
    expect(overlay).toHaveAttribute("aria-live", "polite")
    expect(overlay).toHaveAttribute("aria-label", "Carregando dados")
  })

  test("renderiza ícone Loader2 com aria-hidden", () => {
    const { container } = render(<LoadingOverlay isVisible={true} />)
    const loaderIcon = container.querySelector("svg[aria-hidden='true']")
    expect(loaderIcon).toBeInTheDocument()
    expect(loaderIcon).toHaveClass("animate-spin", "text-accent-cyan")
  })

  test("aplica classes de estilo corretas ao container externo", () => {
    const { container } = render(<LoadingOverlay isVisible={true} />)
    const overlay = container.querySelector("div[role='status']")
    expect(overlay).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "bg-black/50",
      "backdrop-blur-sm",
      "transition-opacity",
      "duration-300"
    )
  })
})