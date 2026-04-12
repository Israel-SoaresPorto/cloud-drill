import { describe, expect, test } from "vitest"
import { loadQuestionsForExam } from "@/lib/question"

describe("loadQuestionsForExam", () => {
  test("retorna questões para CLF_002", () => {
    const questions = loadQuestionsForExam("CLF_002")

    expect(questions.length).toBeGreaterThan(0)
    expect(questions[0]).toHaveProperty("id")
    expect(questions[0]).toHaveProperty("domainCode")
  })

  test("retorna array vazio para exam inválido", () => {
    const questions = loadQuestionsForExam("INVALID" as never)

    expect(questions).toEqual([])
  })
})
