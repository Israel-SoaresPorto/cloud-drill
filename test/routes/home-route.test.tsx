import { fireEvent, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { beforeEach, describe, expect, test, vi } from "vitest"
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

  const result: QuizResult = {
    sessionId: "mock-session-id",
    exam: "CLF_002",
    mode: "practice",
    duration: 1200,
    completedAt: new Date(),
    score: 85,
    correctCount: 17,
    incorrectCount: 3,
    totalQuestions: 20,
    domainBreakdown: {
      "CLF_002-cloud-concepts": { correct: 7, total: 8 },
      "CLF_002-security-and-compliance": { correct: 5, total: 6 },
      "CLF_002-aws-technologies": { correct: 4, total: 5 },
      "CLF_002-billing-and-pricing": { correct: 1, total: 1 },
    },
    passed: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
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
    render()

    expect(screen.getByTestId("header")).toBeInTheDocument()
  })

  test("abre o modal de configuração ao clicar no CTA", () => {
    render()

    expect(screen.getByText("closed")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /Começar a Estudar/i }))

    expect(screen.getByText("open")).toBeInTheDocument()
  })

  test("inicia sessão e navega para /quiz após o delay", () => {
    vi.useFakeTimers()

    const questions = [{ id: "CLF_002-question-001" }] as unknown as Question[]

    mockLoadQuestionsForExam.mockReturnValue(questions)
    mockSelectExamQuestions.mockReturnValue(questions)

    render()

    fireEvent.click(screen.getByRole("button", { name: /Começar a Estudar/i }))
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

    vi.advanceTimersByTime(500)

    waitFor(async () => {
      const main = screen.getByText(/Quiz Page/i)
      expect(main).toBeInTheDocument()
    })
  })

  test("navega para resultado ao clicar no botão de resultado anterior", () => {
    useResultStore.setState({
      result,
    })

    render()

    fireEvent.click(
      screen.getByRole("button", { name: /Ver Resultado Anterior/i })
    )

    waitFor(async () => {
      const main = screen.getByText(/Result Page/i)
      expect(main).toBeInTheDocument()
    })
  })
})
