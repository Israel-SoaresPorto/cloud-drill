import {
  calculateDomainBreakdown,
  calculateQuizResult,
  calculateScore,
  hasPassed,
} from "@/lib/result"
import type { OptionsID, QuestionAnswer } from "@/types/question"
import { makeQuestion } from "../utils/question"
import { describe, test, expect } from "vitest"

const createQuestionsAndAnswers = () => {
  const questions = [
    makeQuestion("001", "CLF_002-cloud-concepts"),
    makeQuestion("002", "CLF_002-cloud-concepts"),
    makeQuestion("003", "CLF_002-cloud-concepts"),
    makeQuestion("004", "CLF_002-security-and-compliance"),
    makeQuestion("005", "CLF_002-security-and-compliance"),
    makeQuestion("006", "CLF_002-aws-technologies"),
    makeQuestion("007", "CLF_002-aws-technologies"),
    makeQuestion("008", "CLF_002-aws-technologies"),
    makeQuestion("009", "CLF_002-aws-technologies"),
    makeQuestion("010", "CLF_002-billing-and-pricing"),
  ]

  const answers: Record<string, QuestionAnswer> = {}

  questions.forEach((question) => {
    const rexeg = /(-001|-002|-003|-005|-007|-008|-010)/
    const selectedOptions = rexeg.test(question.id) ? ["a"] : ["b"]
    const isCorrect = question.correctAnswers.every((ans) =>
      selectedOptions.includes(ans)
    )

    answers[question.id] = {
      id: question.id,
      selectedOptionIds: selectedOptions as OptionsID[],
      isCorrect,
    }
  })

  return { questions, answers }
}

describe("calculateDomainBreakdown", () => {
  test("retornar acertos e erros por todos os dominios", () => {
    const { questions, answers } = createQuestionsAndAnswers()

    const domainBreakdown = calculateDomainBreakdown(questions, answers)

    expect(domainBreakdown).toHaveProperty("Conceitos de Nuvem", {
      correct: 3,
      total: 3,
    })
    expect(domainBreakdown).toHaveProperty("Segurança e Conformidade", {
      correct: 1,
      total: 2,
    })
    expect(domainBreakdown).toHaveProperty("Tecnologia e Serviços de Nuvem", {
      correct: 2,
      total: 4,
    })
    expect(domainBreakdown).toHaveProperty("Cobranças, Preços e Suporte", {
      correct: 1,
      total: 1,
    })
  })

  test("retornar acertos e erros para um dominio", () => {
    const questions = [
      makeQuestion("001", "CLF_002-cloud-concepts"),
      makeQuestion("002", "CLF_002-cloud-concepts"),
    ]

    const answers: Record<string, QuestionAnswer> = {
      "CLF_002-question-001": {
        id: "CLF_002-question-001",
        selectedOptionIds: ["a"],
        isCorrect: true,
      },
      "CLF_002-question-002": {
        id: "CLF_002-question-002",
        selectedOptionIds: ["b"],
        isCorrect: false,
      },
    }

    const domainBreakdown = calculateDomainBreakdown(questions, answers)

    expect(domainBreakdown).toHaveProperty("Conceitos de Nuvem", {
      correct: 1,
      total: 2,
    })
  })

  test("retornar 0 acertos e total correto para dominio sem respostas corretas", () => {
    const questions = [
      makeQuestion("001", "CLF_002-cloud-concepts"),
      makeQuestion("002", "CLF_002-security-and-compliance"),
    ]

    const answers: Record<string, QuestionAnswer> = {
      "CLF_002-question-001": {
        id: "CLF_002-question-001",
        selectedOptionIds: ["b"],
        isCorrect: false,
      },
      "CLF_002-question-002": {
        id: "CLF_002-question-002",
        selectedOptionIds: ["b"],
        isCorrect: false,
      },
    }

    const domainBreakdown = calculateDomainBreakdown(questions, answers)

    expect(domainBreakdown).toHaveProperty("Conceitos de Nuvem", {
      correct: 0,
      total: 1,
    })
    expect(domainBreakdown).toHaveProperty("Segurança e Conformidade", {
      correct: 0,
      total: 1,
    })
  })
})

describe("calculateScore", () => {
  test("calcular pontuação corretamente", () => {
    const { questions } = createQuestionsAndAnswers()

    expect(calculateScore(questions, 7)).toBe(800)
  })

  test("retornar pontuação mínima quando não houver perguntas", () => {
    expect(calculateScore([], 0)).toBe(100)
  })
})

describe("hasPassed", () => {
  test("retornar true para pontuação igual ou superior ao mínimo para passar", () => {
    expect(hasPassed(700)).toBe(true)
    expect(hasPassed(850)).toBe(true)
    expect(hasPassed(1000)).toBe(true)
  })

  test("retornar false para pontuação abaixo do mínimo para passar", () => {
    expect(hasPassed(690)).toBe(false)
    expect(hasPassed(500)).toBe(false)
    expect(hasPassed(100)).toBe(false)
  })
})

describe("calculateQuizResult", () => {
  test("calcular resultado do quiz corretamente", () => {
    const { questions, answers } = createQuestionsAndAnswers()

    const result = calculateQuizResult(
      "session-123",
      "CLF_002",
      "practice",
      questions,
      answers,
      300
    )

    expect(result).toHaveProperty("sessionId", "session-123")
    expect(result).toHaveProperty("exam", "CLF_002")
    expect(result).toHaveProperty("mode", "practice")
    expect(result).toHaveProperty("totalQuestions", questions.length)
    expect(result).toHaveProperty("correctCount", 7)
    expect(result).toHaveProperty("incorrectCount", 3)
    expect(result).toHaveProperty("score", 800)
    expect(result).toHaveProperty("passed", true)
    expect(result).toHaveProperty("domainBreakdown")
    expect(result).toHaveProperty("duration", 300)
  })
})
