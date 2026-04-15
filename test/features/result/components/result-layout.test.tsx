import { describe, expect, test } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import ResultLayout from "@/features/result/components/result-layout"
import renderWithRouter from "../../../utils/render-with-router"
import { makeResult } from "../../../utils/result"

function renderLayout(result = makeResult()) {
  renderWithRouter(
    [
      { path: "/", element: <div>Home</div> },
      { path: "/resultado", element: <ResultLayout result={result} /> },
    ],
    "/resultado"
  )
}

describe("ResultLayout", () => {
  test("renderiza resumo principal do resultado", () => {
    renderLayout(
      makeResult({
        score: 70,
        correctCount: 14,
        totalQuestions: 20,
        duration: 1122,
        passed: true,
      })
    )

    expect(screen.getByText("Aprovado")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "70%" })).toBeInTheDocument()
    expect(screen.getByText("14 de 20 questões corretas")).toBeInTheDocument()
    expect(screen.getByText("Desempenho por Domínio")).toBeInTheDocument()
    expect(screen.getByText("18:42")).toBeInTheDocument()
  })

  test("renderiza status de aprovação", () => {
    renderLayout(
      makeResult({
        passed: true,
        score: 90,
      })
    )

    const status = screen.getByRole("status")
    const score = screen.getByRole("heading", { level: 1 })

    expect(status).toHaveAttribute("data-approved", "true")
    expect(score).toHaveAttribute("data-approved", "true")
  })

  test("renderiza status de reprovação", () => {
    renderLayout(
      makeResult({
        passed: false,
        score: 55,
      })
    )

    const status = screen.getByRole("status")
    const score = screen.getByRole("heading", { level: 1 })

    expect(status).toHaveAttribute("data-approved", "false")
    expect(score).toHaveAttribute("data-approved", "false")
  })

  test("exibe linhas por domínio com progresso", () => {
    const result = makeResult()
    renderLayout(result)

    Object.keys(result.domainBreakdown).forEach((domainName) => {
      expect(screen.getByText(domainName)).toBeInTheDocument()
      expect(
        screen.getByLabelText(`Progresso de ${domainName}`)
      ).toBeInTheDocument()
    })
  })

  test("linha de domínio com desempenho excelente", () => {
    const result = makeResult({
      domainBreakdown: {
        "Conceitos de Nuvem": { correct: 7, total: 10 },
      },
    })

    renderLayout(result)

    const domainRow = screen.getByLabelText("Desempenho de Conceitos de Nuvem")

    expect(domainRow).toHaveAttribute("data-percent-label", "excellent")
  })

  test("linha de domínio com desempenho ruim", () => {
    const result = makeResult({
      domainBreakdown: {
        "Segurança e Conformidade": { correct: 2, total: 10 },
      },
    })

    renderLayout(result)

    const domainRow = screen.getByLabelText(
      "Desempenho de Segurança e Conformidade"
    )

    expect(domainRow).toHaveAttribute("data-percent-label", "poor")
  })

  test("linha de domínio com desempenho tolerável", () => {
    const result = makeResult({
      domainBreakdown: {
        "Tecnologia e Ferramentas": { correct: 5, total: 10 },
      },
    })

    renderLayout(result)

    const domainRow = screen.getByLabelText(
      "Desempenho de Tecnologia e Ferramentas"
    )

    expect(domainRow).toHaveAttribute("data-percent-label", "tolerable")
  })

  test("exibe resumo de tempo, questões, acertos e erros", () => {
    const result = makeResult({
      duration: 900,
      totalQuestions: 15,
      correctCount: 12,
      incorrectCount: 3,
    })

    renderLayout(result)

    expect(screen.getByText("15")).toBeInTheDocument()
    expect(screen.getByText("12")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText("15:00")).toBeInTheDocument()
  })

  test("botão de voltar navega para home", () => {
    renderLayout(makeResult())

    fireEvent.click(screen.getByRole("button", { name: "Voltar para Home" }))

    expect(screen.getByText("Home")).toBeInTheDocument()
  })
})
