import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { beforeEach, describe, expect, test, vi } from "vitest"
import HomeRoute from "@/routes/home-route"
import type { QuizConfig } from "@/types/quiz"
import type { Question } from "@/types/question"

vi.mock("@/components/layout/header", () => ({
  default: function MockHeader() {
    return <div data-testid="header" />
  },
}))

const mockNavigate = vi.fn()
const mockStartSession = vi.fn()
const mockLoadQuestionsForExam = vi.fn()
const mockSelectExamQuestions = vi.fn()

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

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock("@/lib/question", () => ({
  loadQuestionsForExam: (...args: unknown[]) => mockLoadQuestionsForExam(...args),
}))

vi.mock("@/lib/quiz", () => ({
  selectExamQuestions: (...args: unknown[]) => mockSelectExamQuestions(...args),
}))

vi.mock("@/features/quiz/stores/quiz.store", () => ({
  useQuizStore: (selector: (state: { startSession: typeof mockStartSession }) => unknown) =>
    selector({ startSession: mockStartSession }),
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

    expect(screen.getByText("closed")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /Começar a Estudar/i }))

    expect(screen.getByText("open")).toBeInTheDocument()
  })

  test("inicia sessão e navega para /quiz após o delay", () => {
    vi.useFakeTimers()

    const questions = [{ id: "CLF_002-question-001" }] as unknown as Question[]

    mockLoadQuestionsForExam.mockReturnValue(questions)
    mockSelectExamQuestions.mockReturnValue(questions)

    render(<HomeRoute />)

    fireEvent.click(screen.getByRole("button", { name: /Começar a Estudar/i }))
    fireEvent.click(screen.getByRole("button", { name: /Trigger Start/i }))

    expect(mockLoadQuestionsForExam).toHaveBeenCalledWith("CLF_002")
    expect(mockSelectExamQuestions).toHaveBeenCalledWith(
      "CLF_002",
      questions,
      modalConfig.distribution,
      20
    )
    expect(mockStartSession).toHaveBeenCalledWith({
      exam: "CLF_002",
      questions,
      mode: "practice",
      questionCount: 20,
      domains: modalConfig.domains,
    })

    const main = document.querySelector("main")
    expect(main).toHaveClass("opacity-60")

    expect(mockNavigate).not.toHaveBeenCalled()
    vi.advanceTimersByTime(500)
    expect(mockNavigate).toHaveBeenCalledWith("/quiz")
  })

  test("limita totalQuestions ao total filtrado quando domínios são parciais", () => {
    const loadedQuestions = [
      {
        id: "CLF_002-question-001",
        domainCode: "CLF_002-cloud-concepts",
      },
      {
        id: "CLF_002-question-002",
        domainCode: "CLF_002-security-and-compliance",
      },
      {
        id: "CLF_002-question-003",
        domainCode: "CLF_002-aws-technologies",
      },
      {
        id: "CLF_002-question-004",
        domainCode: "CLF_002-billing-and-pricing",
      },
    ] as unknown as Question[]

    modalConfig = {
      ...modalConfig,
      totalQuestions: 65,
      domains: [
        "CLF_002-cloud-concepts",
        "CLF_002-security-and-compliance",
        "CLF_002-aws-technologies",
      ],
      distribution: {
        "CLF_002-cloud-concepts": 0.28,
        "CLF_002-security-and-compliance": 0.24,
        "CLF_002-aws-technologies": 0.36,
      },
    }

    mockLoadQuestionsForExam.mockReturnValue(loadedQuestions)
    mockSelectExamQuestions.mockReturnValue([])

    render(<HomeRoute />)

    fireEvent.click(screen.getByRole("button", { name: /Trigger Start/i }))

    expect(mockSelectExamQuestions).toHaveBeenCalledWith(
      "CLF_002",
      loadedQuestions.slice(0, 3),
      modalConfig.distribution,
      3
    )
    expect(mockStartSession).toHaveBeenCalledWith(
      expect.objectContaining({ questionCount: 3 })
    )
  })
})
