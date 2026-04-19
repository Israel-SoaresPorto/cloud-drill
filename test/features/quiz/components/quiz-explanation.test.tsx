import { render, screen, within } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import QuizExplanation from "@/features/quiz/components/quiz-explanation"
import { makeQuestion } from "../../../utils/question"

describe("QuizExplanation", () => {
  test("exibe estado de questão correta", () => {
    const question = makeQuestion("001", "CLF_002-cloud-concepts")

    render(
      <QuizExplanation
        question={question}
        answer={{ id: question.id, selectedOptionIds: ["a"], isCorrect: true }}
      />
    )

    const explanation = screen.getByLabelText("Explicação da questão")

    expect(explanation).toBeInTheDocument()
    expect(explanation).toHaveAttribute("data-answer-is-correct", "true")
    expect(
      within(explanation).getByRole("heading", { level: 3 })
    ).toHaveTextContent("Resposta Correta!")
  })

  test("exibe estado de questão incorreta", () => {
    const question = makeQuestion("002", "CLF_002-security-and-compliance")

    render(
      <QuizExplanation
        question={question}
        answer={{ id: question.id, selectedOptionIds: ["b"], isCorrect: false }}
      />
    )

    const explanation = screen.getByLabelText("Explicação da questão")

    expect(explanation).toBeInTheDocument()
    expect(explanation).toHaveAttribute("data-answer-is-correct", "false")
    expect(
      within(explanation).getByRole("heading", { level: 3 })
    ).toHaveTextContent("Resposta Incorreta!")
  })

  test("exibe explicação da questão", () => {
    const question = makeQuestion("002", "CLF_002-security-and-compliance")

    render(
      <QuizExplanation
        question={question}
        answer={{ id: question.id, selectedOptionIds: ["a"], isCorrect: false }}
      />
    )

    const explanationGeneral = screen.getByRole("paragraph", {
      description: "Explicação",
    })

    expect(explanationGeneral).toHaveTextContent("ok")
  })

  test("exibe explicação das alternativas incorretas", () => {
    const question = makeQuestion("002", "CLF_002-security-and-compliance")

    render(
      <QuizExplanation
        question={question}
        answer={{ id: question.id, selectedOptionIds: ["a"], isCorrect: false }}
      />
    )

    const explanationIncorrects = screen.getByRole("list")

    expect(explanationIncorrects).toBeInTheDocument()
  })

  test("exibe referências da explicação", () => {
    const question = makeQuestion("002", "CLF_002-security-and-compliance")

    render(
      <QuizExplanation
        question={question}
        answer={{ id: question.id, selectedOptionIds: ["a"], isCorrect: false }}
      />
    )

    const explanationReferences = screen.getAllByRole("link")

    expect(explanationReferences).toHaveLength(1)
  })
})
