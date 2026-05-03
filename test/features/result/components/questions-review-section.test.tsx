import { describe, expect, test } from "vitest"
import { screen, fireEvent } from "@testing-library/react"
import { render } from "@testing-library/react"
import { QuestionsReviewSection } from "@/features/result/components/questions-review-section"
import { makeQuestionAnswerDetail } from "../../../utils/result"

describe("QuestionsReviewSection", () => {
  test("renderiza o título 'Revisão de Questões'", () => {
    const details = [makeQuestionAnswerDetail()]

    render(<QuestionsReviewSection details={details} />)

    expect(screen.getByText("Revisão de Questões")).toBeInTheDocument()
  })

  test("renderiza o botão 'Expandir tudo' inicialmente", () => {
    const details = [makeQuestionAnswerDetail()]

    render(<QuestionsReviewSection details={details} />)

    expect(
      screen.getByRole("button", { name: "Expandir tudo" })
    ).toBeInTheDocument()
  })

  test("altera o texto do botão para 'Recolher tudo' quando clicado", () => {
    const details = [makeQuestionAnswerDetail()]

    render(<QuestionsReviewSection details={details} />)

    const button = screen.getByRole("button", { name: "Expandir tudo" })
    fireEvent.click(button)

    expect(
      screen.getByRole("button", { name: "Recolher tudo" })
    ).toBeInTheDocument()
  })

  test("altera o texto do botão de volta para 'Expandir tudo' quando clicado novamente", () => {
    const details = [makeQuestionAnswerDetail()]

    render(<QuestionsReviewSection details={details} />)

    const button = screen.getByRole("button", { name: "Expandir tudo" })
    fireEvent.click(button)
    fireEvent.click(button)

    expect(
      screen.getByRole("button", { name: "Expandir tudo" })
    ).toBeInTheDocument()
  })

  test("renderiza todos os QuestionReviewItem componentes", () => {
    const details = [
      makeQuestionAnswerDetail({
        id: "CLF_002-question-001",
        questionText: "Pergunta 1",
        domain: "Domain 1",
        isCorrect: true,
      }),
      makeQuestionAnswerDetail({
        id: "CLF_002-question-002",
        questionText: "Pergunta 2",
        domain: "Domain 2",
        isCorrect: false,
      }),
      makeQuestionAnswerDetail({
        id: "CLF_002-question-003",
        questionText: "Pergunta 3",
        domain: "Domain 3",
        isCorrect: true,
      }),
    ]

    render(<QuestionsReviewSection details={details} />)

    // Verify all question texts are rendered
    expect(screen.getByText("Pergunta 1")).toBeInTheDocument()
    expect(screen.getByText("Pergunta 2")).toBeInTheDocument()
    expect(screen.getByText("Pergunta 3")).toBeInTheDocument()

    // Verify all domain names are rendered
    expect(screen.getByText("Domain 1")).toBeInTheDocument()
    expect(screen.getByText("Domain 2")).toBeInTheDocument()
    expect(screen.getByText("Domain 3")).toBeInTheDocument()
  })

  test("abre todos os QuestionReviewItem componentes quando 'Expandir tudo' é clicado", () => {
    const details = [
      makeQuestionAnswerDetail({
        id: "CLF_002-question-001",
        questionText: "Pergunta 1",
        domain: "Domain 1",
        isCorrect: true,
      }),
      makeQuestionAnswerDetail({
        id: "CLF_002-question-002",
        questionText: "Pergunta 2",
        domain: "Domain 2",
        isCorrect: false,
      }),
    ]

    render(<QuestionsReviewSection details={details} />)

    const button = screen.getByRole("button", { name: "Expandir tudo" })
    fireEvent.click(button)

    // Verifique se as opções de cada questão estão visíveis
    expect(screen.getAllByText("Opções", { selector: "h4" })).toHaveLength(2)
    expect(screen.getAllByText("Explicação", { selector: "h4" })).toHaveLength(
      2
    )
  })

  test("fecha todos os QuestionReviewItem componentes quando 'Recolher tudo' é clicado", () => {
    const details = [
      makeQuestionAnswerDetail({
        id: "CLF_002-question-001",
        questionText: "Pergunta 1",
        domain: "Domain 1",
        isCorrect: true,
      }),
      makeQuestionAnswerDetail({
        id: "CLF_002-question-002",
        questionText: "Pergunta 2",
        domain: "Domain 2",
        isCorrect: false,
      }),
    ]

    render(<QuestionsReviewSection details={details} />)

    const button = screen.getByRole("button", { name: "Expandir tudo" })
    fireEvent.click(button) // Expande tudo
    fireEvent.click(button) // Recolhe tudo

    // Verifique se as opções de cada questão não estão mais visíveis
    expect(
      screen.queryByText("Opções", { selector: "h4" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText("Explicação", { selector: "h4" })
    ).not.toBeInTheDocument()
  })

  test("fecha um QuestionReviewItem individualmente quando seu título é clicado", () => {
    const details = [
      makeQuestionAnswerDetail({
        id: "CLF_002-question-001",
        questionText: "Pergunta 1",
        domain: "Domain 1",
        isCorrect: true,
      }),
      makeQuestionAnswerDetail({
        id: "CLF_002-question-002",
        questionText: "Pergunta 2",
        domain: "Domain 2",
        isCorrect: false,
      }),
    ]

    render(<QuestionsReviewSection details={details} />)

    // Expanda tudo primeiro
    const expandButton = screen.getByRole("button", { name: "Expandir tudo" })
    fireEvent.click(expandButton)

    // Clique no título da primeira questão para recolhê-la
    const questionTitle = screen.getByText("Pergunta 1")
    fireEvent.click(questionTitle)

    expect(screen.queryByText("Opções", { selector: "h4" })).toBeInTheDocument()
    expect(
      screen.queryByText("Explicação", { selector: "h4" })
    ).toBeInTheDocument()
    expect(expandButton).toHaveTextContent("Expandir tudo")
  })
})
