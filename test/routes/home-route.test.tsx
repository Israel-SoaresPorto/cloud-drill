import { act, fireEvent, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import HomeRoute from "@/routes/home-route"
import type { QuizConfig, QuizResult } from "@/types/quiz"
import type { Question } from "@/types/question"
import renderWithRouter from "../utils/render-with-router"
import { useResultStore } from "@/features/result/stores/result.store"

vi.mock("@/components/layout/header", () => ({
  default: function MockHeader() {
    return <div data-testid="header" />
  },
}))

const mockLoadQuestionsForExam = vi.fn()
const mockSelectExamQuestions = vi.fn()
const mockGenerateQuizSessionID = vi.fn()

let modalConfig: QuizConfig = {
  mode: "practice",
  exam: "CLF_002",
  duration: null,
  totalQuestions: 20,
  distribution: {
    "CLF_002-cloud-concepts": 0.28,
    "CLF_002-security-and-compliance": 0.24,
    "CLF_002-aws-technologies": 0.36,
    "CLF_002-billing-and-pricing": 0.12,
  },
  domains: [
    "CLF_002-cloud-concepts",
    "CLF_002-security-and-compliance",
    "CLF_002-aws-technologies",
    "CLF_002-billing-and-pricing",
  ],
}

vi.mock("@/lib/question", () => ({
  loadQuestionsForExam: (...args: unknown[]) =>
    mockLoadQuestionsForExam(...args),
}))

vi.mock("@/lib/quiz", () => ({
  selectExamQuestions: (...args: unknown[]) => mockSelectExamQuestions(...args),
  generateQuizSessionID: () => mockGenerateQuizSessionID(),
}))

vi.mock("@/components/quiz/quiz-config-modal", () => ({
  default: function MockQuizConfigModal(props: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onStart?: (config: QuizConfig) => void
  }) {
    return (
      <div data-testid="quiz-config-modal">
        <span>{props.open ? "open" : "closed"}</span>
        <button type="button" onClick={() => props.onStart?.(modalConfig)}>
          Trigger Start
        </button>
        <button type="button" onClick={() => props.onOpenChange(false)}>
          Close Modal
        </button>
      </div>
    )
  },
}))

describe("HomeRoute", () => {
  const render = () => {
    renderWithRouter([
      {
        path: "/",
        element: <HomeRoute />,
      },
      {
        path: "/quiz",
        element: <div>Quiz Page</div>,
      },
      {
        path: "/resultado",
        element: <div>Result Page</div>,
      },
    ])
  }

  beforeEach(() => {
    vi.useRealTimers()

    mockLoadQuestionsForExam.mockReturnValue([])
    mockSelectExamQuestions.mockReturnValue([])

    modalConfig = {
      mode: "practice",
      exam: "CLF_002",
      duration: null,
      totalQuestions: 20,
      distribution: {
        "CLF_002-cloud-concepts": 0.28,
        "CLF_002-security-and-compliance": 0.24,
        "CLF_002-aws-technologies": 0.36,
        "CLF_002-billing-and-pricing": 0.12,
      },
      domains: [
        "CLF_002-cloud-concepts",
        "CLF_002-security-and-compliance",
        "CLF_002-aws-technologies",
        "CLF_002-billing-and-pricing",
      ],
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test("renderiza a home com os elementos principais", () => {
    render()

    expect(
      screen.getByRole("heading", {
        name: /Prepare-se para a Certificação AWS/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Estude para a certificação AWS com quiz interativo/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Cloud Certified Practitioner/i)
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/Quiz Livre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Modo Simulado/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Progresso Salvo/i)).toBeInTheDocument()

    expect(screen.getByText(/Escolha o modo/i)).toBeInTheDocument()

    expect(
      screen.getByText(
        /\d\.\d - CloudDrill é um projeto de código aberto e gratuito para ajudar na preparação para a certificação AWS Certified Cloud Practitioner\./g
      )
    ).toBeInTheDocument()
  })

  test("renderiza o header da página", () => {
    render()

    expect(screen.getByTestId("header")).toBeInTheDocument()
  })

  test("abre o modal de configuração do modo pŕatica", () => {
    render()

    expect(screen.getByText("closed")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /Modo Livre/i }))

    expect(screen.getByText("open")).toBeInTheDocument()
  })

  test("abre o alert de confirmação do modo simulado", () => {
    render()

    expect(screen.queryByTestId("alert")).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /Modo Simulado/i }))

    expect(screen.getByText("Ir para o Modo Simulado")).toBeInTheDocument()
  })

  test("inicia modo prática e navega para /quiz após o delay", async () => {
    vi.useFakeTimers()

    const questions = [{ id: "CLF_002-question-001" }] as unknown as Question[]

    mockLoadQuestionsForExam.mockReturnValue(questions)
    mockSelectExamQuestions.mockReturnValue(questions)

    render()

    fireEvent.click(screen.getByRole("button", { name: /Modo Livre/i }))
    fireEvent.click(screen.getByRole("button", { name: /Trigger Start/i }))

    expect(mockLoadQuestionsForExam).toHaveBeenCalledWith("CLF_002")

    expect(mockSelectExamQuestions).toHaveBeenCalledWith(
      "CLF_002",
      questions,
      modalConfig.distribution,
      20
    )

    const main = document.querySelector("main")
    expect(main).toHaveClass("opacity-60")

    act(() => {
      vi.advanceTimersByTime(600)
    })

    const quizPage = screen.getByText(/Quiz Page/i)
    expect(quizPage).toBeInTheDocument()
  })

  test("inicia modo simulado e navega para /quiz após o delay", async () => {
    vi.useFakeTimers()

    const questions = [{ id: "CLF_002-question-001" }] as unknown as Question[]

    mockLoadQuestionsForExam.mockReturnValue(questions)
    mockSelectExamQuestions.mockReturnValue(questions)

    render()

    fireEvent.click(screen.getByRole("button", { name: /Modo Simulado/i }))
    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }))

    expect(mockLoadQuestionsForExam).toHaveBeenCalledWith("CLF_002")

    expect(mockSelectExamQuestions).toHaveBeenCalledWith(
      "CLF_002",
      questions,
      modalConfig.distribution
    )

    const main = document.querySelector("main")
    expect(main).toHaveClass("opacity-60")

    act(() => vi.advanceTimersByTime(600))

    waitFor(async () => {
      const main = screen.getByText(/Quiz Page/i)
      expect(main).toBeInTheDocument()
    })
  })

  test("exibe loading overlay com mensagem correta durante início do quiz", () => {
    render()

    fireEvent.click(screen.getByRole("button", { name: /Modo Simulado/i }))
    fireEvent.click(screen.getByRole("button", { name: /Confirmar/i }))

    const loadingOverlay = screen.getByRole("status", {
      name: /Carregando modo simulado.../i,
    })
    expect(loadingOverlay).toBeInTheDocument()
  })

  test("navega para /resultado se houver resultado salvo", async () => {
    const result: QuizResult = {
      exam: "CLF_002",
      mode: "simulated",
      score: 80,
      totalQuestions: 65,
      correctCount: 52,
      incorrectCount: 13,
      domainBreakdown: {
        "CLF_002-cloud-concepts": {
          correct: 14,
          total: 18,
        },
        "CLF_002-security-and-compliance": {
          correct: 12,
          total: 16,
        },
        "CLF_002-aws-technologies": {
          correct: 18,
          total: 24,
        },
        "CLF_002-billing-and-pricing": {
          correct: 8,
          total: 7,
        },
      },
      completedAt: new Date(),
      duration: 3600,
      passed: true,
      sessionId: "mock-session-id",
      questionAnswerDetails: [],
    }

    act(() => {
      useResultStore.getState().setResult(result)
    })

    render()

    fireEvent.click(screen.getByRole("button", { name: /Ver Resultado/i }))

    await waitFor(() => {
      const resultPage = screen.getByText(/Result Page/i)
      expect(resultPage).toBeInTheDocument()
    })
  })
})
