import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import QuizProgressMap from "@/features/quiz/components/quiz-progress-map"
import type { QuizSession } from "@/types/quiz"
import { makeQuestion } from "../../../utils/question"

describe("QuizProgressMap", () => {
  test("mostra estados e navega para a questão clicada", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")
    const q3 = makeQuestion("003", "CLF_002-aws-technologies")
    const onJumpToQuestion = vi.fn()

    const session: QuizSession = {
      id: "session-1",
      exam: "CLF_002",
      domains: [
        "CLF_002-cloud-concepts",
        "CLF_002-security-and-compliance",
        "CLF_002-aws-technologies",
      ],
      mode: "practice",
      questions: [q1, q2, q3],
      currentIndex: 1,
      answers: {
        [q1.id]: {
          id: q1.id,
          selectedOptionIds: ["a"],
          isCorrect: true,
        },
      },
      reviewFlags: {
        [q3.id]: true,
      },
      startTime: 1000,
    }

    render(
      <QuizProgressMap
        session={session}
        currentIndex={1}
        onJumpToQuestion={onJumpToQuestion}
      />
    )

    expect(screen.getByText(/1\/3 respondidas/i)).toBeInTheDocument()
    expect(screen.getByText(/1 para revisão/i)).toBeInTheDocument()

    const currentButton = screen.getByRole("button", {
      name: /Questão 2, atual/i,
    })
    expect(currentButton).toHaveAttribute("aria-current", "step")

    const reviewedButton = screen.getByRole("button", {
      name: /Questão 3, marcada para revisão/i,
    })
    expect(reviewedButton).toHaveAttribute("data-reviewed", "true")

    fireEvent.click(
      screen.getByRole("button", {
        name: /Questão 1, respondida/i,
      })
    )

    expect(onJumpToQuestion).toHaveBeenCalledWith(0)
  })
})