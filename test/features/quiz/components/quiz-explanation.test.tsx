import { render, screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import QuizExplanation from "@/features/quiz/components/quiz-explanation"
import { makeQuestion } from "../../../utils/question"

describe("QuizExplanation", () => {
  test("exibe mensagem de acerto", () => {
    const question = makeQuestion("001", "CLF_002-cloud-concepts")

    render(
      <QuizExplanation
        question={question}
        answer={{ id: question.id, selectedOptionIds: ["a"], isCorrect: true }}
      />
    )

    expect(screen.getByText("Resposta Correta!")).toBeInTheDocument()
    expect(screen.getByText("Explicação")).toBeInTheDocument()
  })

  test("exibe mensagem de erro e motivos das incorretas", () => {
    const question = makeQuestion("002", "CLF_002-security-and-compliance")

    render(
      <QuizExplanation
        question={question}
        answer={{ id: question.id, selectedOptionIds: ["b"], isCorrect: false }}
      />
    )

    expect(screen.getByText("Resposta Incorreta!")).toBeInTheDocument()
    expect(screen.getByText(/por que as outras estão incorretas\?/i)).toBeInTheDocument()
    expect(screen.getByText(/b:/i)).toBeInTheDocument()
  })
})
