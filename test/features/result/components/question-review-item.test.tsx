import { describe, expect, test } from "vitest"
import { screen, waitFor, fireEvent } from "@testing-library/react"
import { render } from "@testing-library/react"
import { QuestionReviewItem } from "@/features/result/components/question-review-item"
import type { QuestionAnswerDetail } from "@/types/quiz"
import { Accordion } from "../../../../src/components/ui/accordion"

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

describe("QuestionReviewItem", () => {
  const renderComponent = (detail: QuestionAnswerDetail) => {
    return render(
      <Accordion className="w-full">
        <QuestionReviewItem
          detail={detail}
          questionNumber={1}
        />
      </Accordion>
    )
  }
   
  test("renderiza número da questão, domínio e texto em preview", () => {
    const detail = makeQuestionAnswerDetail({
      questionText: "Qual é o modelo de cobrança preferível?",
      domain: "Conceitos de Nuvem",
    })

    renderComponent(detail)

    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("Conceitos de Nuvem")).toBeInTheDocument()
    expect(
      screen.getByText("Qual é o modelo de cobrança preferível?")
    ).toBeInTheDocument()
  })

  test("exibe indicador ✓ para respostas corretas", () => {
    const detail = makeQuestionAnswerDetail({ isCorrect: true })

    renderComponent(detail)

    const indicator = screen.getByRole("img", { hidden: true })

    expect(indicator).toHaveClass("lucide-check")
  })

  test("exibe indicador ✕ para respostas incorretas", () => {
    const detail = makeQuestionAnswerDetail({ isCorrect: false })

    renderComponent(detail)

    const indicator = screen.getByRole("img", { hidden: true })

    expect(indicator).toHaveClass("lucide-x")
  })

  test("o accordion está fechado por padrão", () => {
    const detail = makeQuestionAnswerDetail()

    renderComponent(detail)

    // Opções não devem estar visíveis
    expect(
      screen.queryByText("Opções", { selector: "h4" })
    ).not.toBeInTheDocument()
  })

  test("expande o accordion quando clicado", async() => {
    const detail = makeQuestionAnswerDetail()

    renderComponent(detail)

    const trigger = screen.getByRole("button")
    fireEvent.click(trigger)

    await waitFor(() => {
      // Após expandir, as seções devem estar visíveis
      expect(screen.getByText("Opções")).toBeInTheDocument()
    })
  })

  test("exibe todas as opções quando expandido", async () => {
    const detail = makeQuestionAnswerDetail({
      options: [
        { id: "a", text: "Opção A" },
        { id: "b", text: "Opção B" },
        { id: "c", text: "Opção C" },
        { id: "d", text: "Opção D" },
      ],
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(screen.getByText("Opção A")).toBeInTheDocument()
      expect(screen.getByText("Opção B")).toBeInTheDocument()
      expect(screen.getByText("Opção C")).toBeInTheDocument()
      expect(screen.getByText("Opção D")).toBeInTheDocument()
    })
  })

  test("marca a resposta correta com  'Correta'", async () => {
    const detail = makeQuestionAnswerDetail({
      correctAnswers: ["d"],
      options: [
        { id: "a", text: "Opção A" },
        { id: "b", text: "Opção B" },
        { id: "c", text: "Opção C" },
        { id: "d", text: "Pagamento conforme o uso" },
      ],
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      const correctLabel = screen.getByText("Correta")
      expect(correctLabel).toBeInTheDocument()
    })
  })

  test("marca a resposta do usuário com 'Sua resposta'", async () => {
    const detail = makeQuestionAnswerDetail({
      selectedOptionIds: ["b"],
      correctAnswers: ["d"],
      options: [
        { id: "a", text: "Opção A" },
        { id: "b", text: "Opção B que o usuário selecionou" },
        { id: "c", text: "Opção C" },
        { id: "d", text: "Resposta correta" },
      ],
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      const userLabel = screen.getByText("Sua resposta")
      expect(userLabel).toBeInTheDocument()
    })
  })

  test("exibe explicação geral", async() => {
    const detail = makeQuestionAnswerDetail({
      explanation: {
        general: "Esta é a explicação geral da questão",
        incorrects: {},
      },
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(
        screen.getByText("Esta é a explicação geral da questão")
      ).toBeInTheDocument()
    })
  })

  test("exibe explicações de opções incorretas", async () => {
    const detail = makeQuestionAnswerDetail({
      options: [
        { id: "a", text: "Opção A" },
        { id: "b", text: "Opção B" },
        { id: "c", text: "Opção C" },
        { id: "d", text: "Opção D" },
      ],
      explanation: {
        general: "Explicação geral",
        incorrects: {
          a: "Por que A está errada",
          b: "Por que B está errada",
          c: "Por que C está errada",
        },
      },
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(screen.getByText("Por que A está errada")).toBeInTheDocument()
      expect(screen.getByText("Por que B está errada")).toBeInTheDocument()
      expect(screen.getByText("Por que C está errada")).toBeInTheDocument()
    })
  })

  test("lida com objeto incorrects vazio graciosamente", async () => {
    const detail = makeQuestionAnswerDetail({
      explanation: {
        general: "Explicação geral",
        incorrects: {},
      },
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    // Deve renderizar sem erro
    await waitFor(() => {
      expect(screen.getByText("Explicação")).toBeInTheDocument()
    })
  })

  test("resposta correta tem fundo verde", async () => {
    const detail = makeQuestionAnswerDetail({
      correctAnswers: ["d"],
      options: [
        { id: "a", text: "Opção A" },
        { id: "b", text: "Opção B" },
        { id: "c", text: "Opção C" },
        { id: "d", text: "Resposta correta" },
      ],
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      const correctOption = screen.getByText("Resposta correta").closest("div")
      expect(correctOption).toHaveClass("border-correct")
      expect(correctOption).toHaveClass("bg-correct/10")
    })
  })

  test("resposta do usuário incorreta tem fundo vermelho", async () => {
    const detail = makeQuestionAnswerDetail({
      selectedOptionIds: ["b"],
      correctAnswers: ["d"],
      options: [
        { id: "a", text: "Opção A" },
        { id: "b", text: "Resposta do usuário" },
        { id: "c", text: "Opção C" },
        { id: "d", text: "Resposta correta" },
      ],
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      const userOption = screen.getByText("Resposta do usuário").closest("div")
      expect(userOption).toHaveClass("border-wrong")
      expect(userOption).toHaveClass("bg-wrong/10")
    })
  })

  test("opção não selecionada tem fundo cinza", async() => {
    const detail = makeQuestionAnswerDetail({
      selectedOptionIds: ["b"],
      correctAnswers: ["d"],
      options: [
        { id: "a", text: "Opção A" },
        { id: "b", text: "Resposta do usuário" },
        { id: "c", text: "Opção C" },
        { id: "d", text: "Resposta correta" },
      ],
    })

    renderComponent(detail)

    fireEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      const unselectedOption = screen.getByText("Opção A").closest("div")
      expect(unselectedOption).toHaveClass("border-idle")
      expect(unselectedOption).toHaveClass("bg-option")
    })
  })

  test("linha de domínio é truncada em trigger", () => {
    const detail = makeQuestionAnswerDetail({
      questionText:
        "Esta é uma pergunta muito longa que deveria ser truncada quando não há espaço suficiente na tela",
    })

    renderComponent(detail)

    const questionText = screen.getByText(
      "Esta é uma pergunta muito longa que deveria ser truncada quando não há espaço suficiente na tela"
    )
    expect(questionText).toHaveClass("line-clamp-2")
  })
})
