import { describe, expect, test } from "vitest"
import { screen } from "@testing-library/react"
import renderWithRouter from "../utils/render-with-router"
import QuizPage from "@/routes/quiz-route"
import type { QuizSession } from "@/types/quiz"
import { makeQuestion } from "../utils/question"
import { useQuizStore } from "@/features/quiz/stores/quiz.store"

describe("QuizPage", () => {
  const questions = new Array(20)
    .fill(null)
    .map((_, i) => makeQuestion(`00${i + 1}`, "CLF_002-cloud-concepts"))
    
  const session: QuizSession = {
    id: "session-1",
    exam: "CLF_002",
    domains: ["Conceitos de Nuvem"],
    mode: "practice",
    questions,
    currentIndex: 0,
    answers: {},
    startTime: 1000,
  }

  test("redireciona para / quando não existe sessão", () => {
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

    useQuizStore.setState((state) => ({
      ...state,
      session,
    }))

    renderWithRouter(
      [
        { path: "/", element: <div>Home</div> },
        { path: "/quiz", element: <QuizPage /> },
      ],
      "/quiz"
    )

    expect(screen.getByText("Cloud Certified Practitioner")).toBeInTheDocument()
    expect(screen.getByText("Question 001")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Confirmar resposta" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Finalizar" })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sair" })).toBeInTheDocument()
  })
})
