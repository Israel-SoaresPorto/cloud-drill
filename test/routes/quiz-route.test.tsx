import { describe, expect, test, vi } from "vitest"
import { screen } from "@testing-library/react"
import renderWithRouter from "../utils/render-with-router"
import QuizPage from "@/routes/quiz-route"
import type { QuizSession } from "@/types/quiz"
import { makeQuestion } from "../utils/question"

let mockState: {
  session: QuizSession | null
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
  useQuizStore: (
    selector: (
      state: {
        session: QuizSession | null
        isRevealed: boolean
        submitAnswer: ReturnType<typeof vi.fn>
        previousQuestion: ReturnType<typeof vi.fn>
        nextQuestion: ReturnType<typeof vi.fn>
        revealAnswer: ReturnType<typeof vi.fn>
        endSession: ReturnType<typeof vi.fn>
        clearSession: ReturnType<typeof vi.fn>
        timeRemaining: number | null
      }
    ) => unknown
  ) => selector(mockState),
}))

describe("QuizPage", () => {
  test("redireciona para / quando não existe sessão", () => {
    mockState = {
      session: null,
      isRevealed: false,
      submitAnswer: vi.fn(),
      previousQuestion: vi.fn(),
      nextQuestion: vi.fn(),
      revealAnswer: vi.fn(),
      endSession: vi.fn(),
      clearSession: vi.fn(),
      timeRemaining: null,
    }

    renderWithRouter(
      [
        { path: "/", element: <div>Home</div> },
        { path: "/quiz", element: <QuizPage /> },
      ],
      "/quiz"
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
  })

  test("renderiza página quando sessão existe", () => {
    const question = makeQuestion("001", "CLF_002-cloud-concepts")

    mockState = {
      isRevealed: true,
      submitAnswer: vi.fn(),
      previousQuestion: vi.fn(),
      nextQuestion: vi.fn(),
      revealAnswer: vi.fn(),
      endSession: vi.fn(() => ({
        totalQuestions: 1,
        correctCount: 1,
        score: 100,
        passed: true,
      })),
      clearSession: vi.fn(),
      timeRemaining: null,
      session: {
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "practice",
      questions: [question],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    }
    }

    renderWithRouter(
      [
        { path: "/", element: <div>Home</div> },
        { path: "/quiz", element: <QuizPage /> },
      ],
      "/quiz"
    )

    expect(screen.getByText("Cloud Certified Practitioner")).toBeInTheDocument()
    expect(screen.getByText("Question 001")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirmar resposta" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Finalizar" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument()
  })

  test("redireciona para / quando currentIndex não possui questão", () => {
    const question = makeQuestion("001", "CLF_002-cloud-concepts")

    mockState = {
      isRevealed: false,
      submitAnswer: vi.fn(),
      previousQuestion: vi.fn(),
      nextQuestion: vi.fn(),
      revealAnswer: vi.fn(),
      endSession: vi.fn(),
      clearSession: vi.fn(),
      timeRemaining: null,
      session: {
        id: "session-2",
        exam: "CLF_002",
        domains: ["Conceitos de Nuvem"],
        mode: "practice",
        questions: [question],
        currentIndex: 99,
        answers: {},
        startTime: 1000,
      },
    }

    renderWithRouter(
      [
        { path: "/", element: <div>Home</div> },
        { path: "/quiz", element: <QuizPage /> },
      ],
      "/quiz"
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
  })
})
