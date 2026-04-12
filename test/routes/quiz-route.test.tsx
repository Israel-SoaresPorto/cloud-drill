import { describe, expect, test, vi } from "vitest"
import { screen } from "@testing-library/react"
import renderWithRouter from "../utils/render-with-router"
import QuizPage from "@/routes/quiz-route"
import type { QuizSession } from "@/types/quiz"

let mockSession: QuizSession | null = null

vi.mock("@/features/quiz/stores/quiz.store", () => ({
  useQuizStore: (selector: (state: { session: QuizSession | null }) => unknown) =>
    selector({ session: mockSession }),
}))

describe("QuizPage", () => {
  test("redireciona para / quando não existe sessão", () => {
    mockSession = null

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
    mockSession = {
      id: "session-1",
      exam: "CLF_002",
      domains: ["Conceitos de Nuvem"],
      mode: "practice",
      questions: [],
      currentIndex: 0,
      answers: {},
      startTime: 1000,
    }

    renderWithRouter(
      [
        { path: "/", element: <div>Home</div> },
        { path: "/quiz", element: <QuizPage /> },
      ],
      "/quiz"
    )

    expect(screen.getByRole("heading", { name: "Quiz Page" })).toBeInTheDocument()
    expect(screen.getByText(/"id": "session-1"/)).toBeInTheDocument()
  })
})
