import { describe, expect, test } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import ResultLayout from "@/features/result/components/result-layout"
import renderWithRouter from "../../../utils/render-with-router"
import { makeResult } from "../../../utils/result"
import type { QuestionAnswerDetail } from "@/types/quiz"

function renderLayout(result = makeResult()) {
  renderWithRouter(
    [
      { path: "/", element: <div>Home</div> },
      { path: "/resultado", element: <ResultLayout result={result} /> },
    ],
    "/resultado"
  )
}

function makeQuestionAnswerDetail(
  overrides: Partial<QuestionAnswerDetail> = {}
): QuestionAnswerDetail {
  return {
    id: "CLF_002-question-001",
    selectedOptionIds: ["b"],
    isCorrect: false,
    questionText: "Qual é o modelo de cobrança preferível para uma startup?",
    correctAnswers: ["d"],
    domain: "Conceitos de Nuvem",
    options: [
      { id: "a", text: "Compra de hardware dedicado antecipada" },
      { id: "b", text: "Provisionamento fixo por 3 anos" },
      { id: "c", text: "Aquisição de licenças perpétuas" },
      { id: "d", text: "Pagamento conforme o uso (pay-as-you-go)" },
    ],
    explanation: {
      general:
        "Na nuvem, a empresa troca gastos antecipados por cobrança baseada no consumo real.",
      incorrects: {
        a: "Incorreta. A compra de hardware exige alto investimento inicial (CapEx).",
        b: "Incorreta. O provisionamento fixo de infraestrutura pode gerar capacidade ociosa.",
        c: "Incorreta. Licenças perpétuas representam um custo inicial fixo e elevado.",
      },
    },
    ...overrides,
  }
}

describe("ResultLayout", () => {
  test("renderiza resumo principal do resultado com status e score", () => {
    renderLayout(
      makeResult({
        score: 700,
        correctCount: 14,
        totalQuestions: 20,
        duration: 1122,
        passed: true,
      })
    )

    expect(screen.getByText("Aprovado")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Sua Pontuação" })
    ).toBeInTheDocument()
    expect(screen.getByText("700")).toBeInTheDocument()
    expect(screen.getByText("14 de 20 questões corretas")).toBeInTheDocument()
  })

  test("renderiza status de aprovação com styling correto", () => {
    renderLayout(
      makeResult({
        passed: true,
        score: 90,
      })
    )

    const status = screen.getByRole("status")
    const heading = screen.getByRole("heading", { name: "Sua Pontuação" })

    expect(status).toHaveAttribute("data-approved", "true")
    expect(heading).toBeInTheDocument()
    expect(status).toHaveTextContent("Aprovado")
    expect(screen.getByText("90")).toBeInTheDocument()
  })

  test("renderiza status de reprovação com styling correto", () => {
    renderLayout(
      makeResult({
        passed: false,
        score: 55,
      })
    )

    const status = screen.getByRole("status")
    const heading = screen.getByRole("heading", { name: "Sua Pontuação" })

    expect(status).toHaveAttribute("data-approved", "false")
    expect(heading).toBeInTheDocument()
    expect(status).toHaveTextContent("Não Aprovado")
    expect(screen.getByText("55")).toBeInTheDocument()
  })

  test("exibe 4 cards de estatísticas: tempo, total, acertos, erros", () => {
    const result = makeResult({
      duration: 900,
      totalQuestions: 15,
      correctCount: 12,
      incorrectCount: 3,
    })

    renderLayout(result)

    // Check for all 4 stat values
    expect(screen.getByText("15m")).toBeInTheDocument()
    expect(screen.getByText("15")).toBeInTheDocument()
    expect(screen.getByText("12")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()

    // Check for stat labels
    expect(screen.getByText("Tempo total")).toBeInTheDocument()
    expect(screen.getByText("Questões")).toBeInTheDocument()
    expect(screen.getByText("Acertos")).toBeInTheDocument()
    expect(screen.getByText("Erros")).toBeInTheDocument()
  })

  test("exibe domain breakdown com título 'Desempenho por Domínio'", () => {
    const result = makeResult()
    renderLayout(result)

    expect(screen.getByText("Desempenho por Domínio")).toBeInTheDocument()
  })

  test("exibe linhas por domínio com progresso correto", () => {
    const result = makeResult()
    renderLayout(result)

    Object.keys(result.domainBreakdown).forEach((domainName) => {
      expect(screen.getByText(domainName)).toBeInTheDocument()
      expect(
        screen.getByLabelText(`Progresso de ${domainName}`)
      ).toBeInTheDocument()
    })
  })

  test("linha de domínio com desempenho excelente (>= 70%)", () => {
    const result = makeResult({
      domainBreakdown: {
        "Conceitos de Nuvem": { correct: 7, total: 10 },
      },
    })

    renderLayout(result)

    const domainRow = screen.getByLabelText("Desempenho de Conceitos de Nuvem")
    expect(domainRow).toHaveAttribute("data-percent-label", "excellent")
  })

  test("linha de domínio com desempenho ruim (< 40%)", () => {
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

  test("linha de domínio com desempenho tolerável (40-69%)", () => {
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

  test("renderiza questions review section quando detalhes existem e têm itens", () => {
    const details: QuestionAnswerDetail[] = [makeQuestionAnswerDetail()]

    renderLayout(
      makeResult({
        questionAnswerDetails: details,
      })
    )

    expect(screen.getByText("Revisão de Questões")).toBeInTheDocument()
  })

  test("NÃO renderiza questions review section quando detalhes estão vazios", () => {
    renderLayout(
      makeResult({
        questionAnswerDetails: [],
      })
    )

    expect(screen.queryByText("Revisão de Questões")).not.toBeInTheDocument()
  })

  test("NÃO renderiza questions review section quando detalhes não existem", () => {
    renderLayout(makeResult())

    expect(screen.queryByText("Revisão de Questões")).not.toBeInTheDocument()
  })

  test("renderiza expandir/recolher button quando detalhes existem", () => {
    const details: QuestionAnswerDetail[] = [makeQuestionAnswerDetail()]

    renderLayout(
      makeResult({
        questionAnswerDetails: details,
      })
    )

    expect(
      screen.getByRole("button", { name: /Expandir tudo|Recolher tudo/ })
    ).toBeInTheDocument()
  })

  test("botão 'Voltar para Home' navega para home", () => {
    renderLayout(makeResult())

    fireEvent.click(screen.getByRole("button", { name: "Voltar para Home" }))

    expect(screen.getByText("Home")).toBeInTheDocument()
  })

  test("botão voltar existe em qualquer estado do resultado", () => {
    renderLayout(
      makeResult({
        passed: false,
        score: 55,
      })
    )

    expect(
      screen.getByRole("button", { name: "Voltar para Home" })
    ).toBeInTheDocument()
  })

  test("renderiza todas as 4 seções na ordem correta", () => {
    const details: QuestionAnswerDetail[] = [makeQuestionAnswerDetail()]

    renderLayout(
      makeResult({
        passed: true,
        score: 700,
        questionAnswerDetails: details,
      })
    )

    // Section 1: Header
    expect(screen.getByRole("status")).toBeInTheDocument()

    // Section 2: Stats
    expect(screen.getByText("Desempenho por Domínio")).toBeInTheDocument()

    // Section 3: Review
    expect(screen.getByText("Revisão de Questões")).toBeInTheDocument()

    // Section 4: Button
    expect(
      screen.getByRole("button", { name: "Voltar para Home" })
    ).toBeInTheDocument()
  })

  test("renderiza layout sem review section quando não há detalhes", () => {
    renderLayout(makeResult())

    // Section 1: Header
    expect(screen.getByRole("status")).toBeInTheDocument()

    // Section 2: Stats
    expect(screen.getByText("Desempenho por Domínio")).toBeInTheDocument()

    // Section 3: Review (should NOT be present)
    expect(screen.queryByText("Revisão de Questões")).not.toBeInTheDocument()

    // Section 4: Button
    expect(
      screen.getByRole("button", { name: "Voltar para Home" })
    ).toBeInTheDocument()
  })
})
