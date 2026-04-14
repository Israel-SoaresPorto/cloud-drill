import { fireEvent, screen } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import QuizLayout from "@/features/quiz/components/quiz-layout"
import { makeQuestion } from "../../../utils/question"
import renderWithRouter from "../../../utils/render-with-router"
import type { QuizSession } from "@/types/quiz"

const mockNavigate = vi.fn()

let mockState: {
  isRevealed: boolean
  submitAnswer: ReturnType<typeof vi.fn>
  previousQuestion: ReturnType<typeof vi.fn>
  nextQuestion: ReturnType<typeof vi.fn>
  revealAnswer: ReturnType<typeof vi.fn>
  endSession: ReturnType<typeof vi.fn>
  clearSession: ReturnType<typeof vi.fn>
  timeRemaining: number | null
}

vi.mock("@/features/quiz/stores/quiz.store", () => ({
  useQuizStore: (selector: (state: typeof mockState) => unknown) =>
    selector(mockState),
}))

function renderLayout(session: QuizSession) {
  renderWithRouter(
    [
      {
        path: "/quiz",
        element: <QuizLayout session={session} />,
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
  beforeEach(() => {
    mockNavigate.mockReset()
    mockState = {
      isRevealed: false,
      submitAnswer: vi.fn(),
      previousQuestion: vi.fn(),
      nextQuestion: vi.fn(),
      revealAnswer: vi.fn(),
      endSession: vi.fn(() => ({
        sessionId: "session-1",
        exam: "CLF_002",
        mode: "practice",
        totalQuestions: 2,
        correctCount: 1,
        incorrectCount: 1,
        score: 50,
        passed: false,
        domainBreakdown: {
          "Conceitos de Nuvem": { correct: 1, total: 2 },
        },
        duration: 90,
        completedAt: new Date(),
      })),
      clearSession: vi.fn(),
      timeRemaining: null,
    }
  })

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
  });

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

  test("permite confirmar resposta quando há seleção em rascunho", () => {
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

    fireEvent.click(screen.getByRole("radio", { name: /a\./i }))
    fireEvent.click(screen.getByRole("button", { name: "Confirmar resposta" }))

    expect(mockState.submitAnswer).toHaveBeenCalledWith(q1.id, ["a"])
    expect(mockState.revealAnswer).toHaveBeenCalledTimes(1)
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
    expect(optionA.closest("label")?.className).toContain(
      "border-accent-orange"
    )

    expect(confirmButton).not.toBeDisabled()
  })

  test("quando questão já está respondida, botão principal avança", () => {
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

    fireEvent.click(screen.getByRole("button", { name: "Próxima" }))

    expect(mockState.nextQuestion).toHaveBeenCalledTimes(1)
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

    expect(
      screen.getByRole("generic", { description: "Resposta Correta!" })
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

    expect(
      screen.getByRole("generic", { description: "Resposta Incorreta!" })
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

    expect(screen.getByText(/questões não respondidas/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(mockState.endSession).toHaveBeenCalledTimes(1)
    expect(mockState.clearSession).toHaveBeenCalledTimes(1)
    expect(screen.getByText("Resultado Final")).toBeInTheDocument()
  })

  test("finaliza normalmente quando todas questões estão respondidas", () => {
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
          selectedOptionIds: ["b"],
          isCorrect: false,
        },
      },
      startTime: 1000,
    })

    fireEvent.click(screen.getByRole("button", { name: "Finalizar" }))

    expect(mockState.endSession).toHaveBeenCalledTimes(1)
    expect(mockState.clearSession).toHaveBeenCalledTimes(1)
    expect(screen.getByText("Resultado Final")).toBeInTheDocument()
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
    expect(screen.getByText("Sair do quiz")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }))

    expect(mockState.clearSession).toHaveBeenCalledTimes(1)
    expect(screen.getByText("Home")).toBeInTheDocument()
  })
})
