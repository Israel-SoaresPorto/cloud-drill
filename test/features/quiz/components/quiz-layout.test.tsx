import { fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import QuizLayout from "@/features/quiz/components/quiz-layout"
import { makeQuestion } from "../../../utils/question"
import renderWithRouter from "../../../utils/render-with-router"
import type { QuizSession } from "@/types/quiz"
import { useQuizStore } from "@/features/quiz/stores/quiz.store"

function renderLayout(
  session: QuizSession,
) {
  useQuizStore.setState((state) => ({
    ...state,
    session,
    isRevealed: false,
    timeRemaining: null,
  }))

  renderWithRouter(
    [
      {
        path: "/quiz",
        element: <QuizLayout session={session} />,
      },
      {
        path: "/resultado",
        element: <div>Resultado</div>,
      },
      {
        path: "/",
        element: <div>Home</div>,
      },
    ],
    "/quiz"
  )
}

describe("QuizLayout", () => {
  test("exibe questão de unica escolha", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "practice",
      questions: [q1],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    })

    expect(screen.getByRole("radio", { name: /a\./i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /b\./i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /c\./i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /d\./i })).toBeInTheDocument()
  })

  test("exibe questão de múltipla escolha", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts", "multiple")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "practice",
      questions: [q1],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    })

    expect(screen.getByRole("checkbox", { name: /a\./i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /b\./i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /c\./i })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /d\./i })).toBeInTheDocument()
  })

  test("exibe questão marcada e botão principal habilitado para confirmar resposta", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "practice",
      questions: [q1],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    })

    const confirmButton = screen.getByRole("button", {
      name: "Confirmar resposta",
    })

    const optionA = screen.getByRole("radio", { name: /a\./i })

    fireEvent.click(optionA)

    expect(optionA).toBeChecked()

    expect(confirmButton).not.toBeDisabled()
  })

  test("quando questão já está respondida, avança para a próxima questão", async () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem", "Segurança e Conformidade"],
      mode: "practice",
      questions: [q1, q2],
      currentIndex: 0,
      answers: {
        [q1.id]: {
          id: q1.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
      },
      startTime: 1000,
    })

    const nextButton = screen.getByRole("button", { name: "Próxima" })

    fireEvent.click(nextButton)

    waitFor(async () => {
      const nextQuestion = await screen.getByText(q2.question)
      expect(nextQuestion).toBeInTheDocument()
    })
  })

  test("voltar para a questão anterior", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem", "Segurança e Conformidade"],
      mode: "practice",
      questions: [q1, q2],
      currentIndex: 1,
      answers: {
        [q1.id]: {
          id: q1.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
        [q2.id]: {
          id: q2.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
      },
      startTime: 1000,
    })

    const previousButton = screen.getByRole("button", { name: "Anterior" })

    fireEvent.click(previousButton)

    waitFor(() => {
      const previousQuestion = screen.getByText(q1.question)
      expect(previousQuestion).toBeInTheDocument()
    })
  })

  test("quando questão já está respondida, exibe explicação correta", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem", "Segurança e Conformidade"],
      mode: "practice",
      questions: [q1],
      currentIndex: 0,
      answers: {
        [q1.id]: {
          id: q1.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
      },
      startTime: 1000,
    })

    const explanation = screen.getByLabelText("Explicação da questão")

    expect(
      within(explanation).getByRole("heading", { name: "Resposta Correta!" })
    ).toBeInTheDocument()
  })

  test("quando questão já está respondida, exibe explicação incorreta", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem", "Segurança e Conformidade"],
      mode: "practice",
      questions: [q1],
      currentIndex: 0,
      answers: {
        [q1.id]: {
          id: q1.id,
          selectedOptionIds: ["b"],
          isCorrect: false,
        },
      },
      startTime: 1000,
    })

    const explanation = screen.getByLabelText("Explicação da questão")

    expect(
      within(explanation).getByRole("heading", { name: "Resposta Incorreta!" })
    ).toBeInTheDocument()
  })

  test("ao finalizar com pendências abre alerta e confirma finalização parcial", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem", "Segurança e Conformidade"],
      mode: "practice",
      questions: [q1, q2],
      currentIndex: 0,
      answers: {
        [q1.id]: {
          id: q1.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
      },
      startTime: 1000,
    })

    fireEvent.click(screen.getByRole("button", { name: "Finalizar" }))

    const alertDialog = screen.getByRole("alertdialog", {
      name: "Finalizar quiz",
    })

    expect(alertDialog).toBeInTheDocument()

    fireEvent.click(
      within(alertDialog).getByRole("button", { name: "Confirmar" })
    )

    waitFor(async () => {
      const result = await screen.getByText("Resultado")
      expect(result).toBeInTheDocument()
    })
  })

  test("ao finalizar sem pendências finaliza normalmente", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem", "Segurança e Conformidade"],
      mode: "practice",
      questions: [q1, q2],
      currentIndex: 0,
      answers: {
        [q1.id]: {
          id: q1.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
        [q2.id]: {
          id: q2.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
      },
      startTime: 1000,
    })

    fireEvent.click(screen.getByRole("button", { name: "Finalizar" }))

    waitFor(async () => {
      const result = await screen.getByText("Resultado")
      expect(result).toBeInTheDocument()
    })
  })

  test("fluxo de sair abre alerta, limpa sessão e navega para home", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "practice",
      questions: [q1],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    })

    fireEvent.click(screen.getByRole("button", { name: "Sair" }))

    const alertDialog = screen.getByRole("alertdialog", {
      name: "Sair do quiz",
    })

    expect(alertDialog).toBeInTheDocument()

    fireEvent.click(
      within(alertDialog).getByRole("button", { name: "Confirmar" })
    )

    const home = screen.getByText("Home")
    expect(home).toBeInTheDocument()
  })

  test("navega pelo mapa e marca questão para revisão", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem", "Segurança e Conformidade"],
      mode: "practice",
      questions: [q1, q2],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    })

    const questionMap = screen.getByRole("complementary")

    expect(questionMap).toBeInTheDocument()

    fireEvent.click(
      within(questionMap).getByRole("button", { name: "Questão 2" })
    )

    expect(screen.getByText(q2.question)).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Marcar para revisão" }))

    expect(
      screen.getByRole("button", { name: "Remover revisão" })
    ).toBeInTheDocument()

    expect(
      within(questionMap).getByRole("button", {
        name: /questão 2, marcada para revisão/i,
      })
    ).toHaveAttribute("data-reviewed", "true")
  })

  test("permite abrir mapa de questões", () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "practice",
      questions: [question],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    })

    const openMapButton = screen.getByRole("button", {
      name: "Abrir mapa de questões",
    })

    expect(openMapButton).toBeInTheDocument()

    fireEvent.click(openMapButton)

    expect(
      screen.getByRole("dialog", { name: "Mapa das questões" })
    ).toBeInTheDocument()
  })

  test('renderiza mensagem "Tempo expirado" quando quiz é expirado', async () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts")

    // Act - renderizar layout
    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "simulated",
      questions: [question],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    })

    useQuizStore.getState().endSession(true) // Forçar expiração da sessão

    // Assert - verificar que "Tempo expirado" aparece
    await waitFor(() =>
      expect(screen.getByText(/Tempo expirado/i)).toBeInTheDocument()
    )
  })

  test("não renderiza explicação quando modo é simulado", () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "simulated",
      questions: [question],
      currentIndex: 0,
      answers: {
        [question.id]: {
          id: question.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
      },
      startTime: 1000,
      timeLimit: 300000,
    })

    // Assert
    const explanation = screen.queryByLabelText("Explicação da questão")
    expect(explanation).not.toBeInTheDocument()
  })

  test("exibe tempo restante quando em modo simulado", async () => {
    const question = makeQuestion("010", "CLF_002-cloud-concepts")

    renderLayout({
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "simulated",
      questions: [question],
      currentIndex: 0,
      answers: {},
      startTime: Date.now(),
      timeLimit: 5 * 60
    })

    const timer = screen.getByRole("timer")

    expect(timer).toBeInTheDocument()
    expect(timer).toHaveTextContent(/\d+[h|m|s]/) 
  })
})
