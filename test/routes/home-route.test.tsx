import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, test, vi } from "vitest"
import HomeRoute from "@/routes/home-route"

vi.mock("@/components/layout/header", () => ({
  default: function MockHeader() {
    return <div data-testid="header" />
  },
}))

describe("HomeRoute", () => {
  test("renderiza a home com os elementos principais", () => {
    render(<HomeRoute />)

    expect(
      screen.getByRole("heading", { name: /Prepare-se para a Certificação AWS/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Estude para a certificação AWS com quiz interativo/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Cloud Certified Practitioner/i)
    ).toBeInTheDocument()

    expect(screen.getByText(/Quiz Livre/i)).toBeInTheDocument()
    expect(screen.getByText(/Modo Simulado \(Em breve\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Progresso Salvo/i)).toBeInTheDocument()

    expect(
      screen.getByRole("button", { name: /Começar a Estudar/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        /v1\.0 - CloudDrill é um projeto de código aberto e gratuito para ajudar na preparação para a certificação AWS Certified Cloud Practitioner\./i
      )
    ).toBeInTheDocument()
  })

  test("renderiza o header da página", () => {
    render(<HomeRoute />)

    expect(screen.getByTestId("header")).toBeInTheDocument()
  })

    test("abre o modal de configuração ao clicar no CTA", () => {
      render(<HomeRoute />)

      fireEvent.click(screen.getByRole("button", { name: /Começar a Estudar/i }))

      expect(screen.getByRole("dialog")).toBeInTheDocument()
      expect(screen.getByText("Configurar Quiz")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Iniciar" })).toBeInTheDocument()
    })
})
