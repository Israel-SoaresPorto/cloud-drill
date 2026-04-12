import { afterEach, describe, expect, test, vi } from "vitest"
import {
  generateQuizSessionID,
  selectExamQuestions,
  shuffleArray,
} from "@/lib/quiz"
import type { Question } from "@/types/question"
import { makeQuestion } from "../utils/question"

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("generateQuizSessionID", () => {
  test("usa crypto.randomUUID quando disponível", () => {
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn().mockReturnValue("test-uuid"),
    })

    const id = generateQuizSessionID()

    expect(id).toBe("test-uuid")
  })

  test("usa fallback quando crypto.randomUUID não existe", () => {
    vi.stubGlobal("crypto", {})
    vi.spyOn(Math, "random").mockReturnValue(0.123456789)
    vi.spyOn(Date, "now").mockReturnValue(1710000000000)

    const id = generateQuizSessionID()

    expect(id).toMatch(/^[a-z0-9]+$/)
    expect(id.length).toBeGreaterThan(5)
  })
})

describe("shuffleArray", () => {
  test("não modifica o array original e mantém os elementos", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)

    const original = [1, 2, 3, 4]
    const shuffled = shuffleArray(original)

    expect(original).toEqual([1, 2, 3, 4])
    expect(shuffled).toHaveLength(original.length)
    expect([...shuffled].sort()).toEqual([...original].sort())
    expect(shuffled).not.toEqual(original)
  })
})

describe("selectExamQuestions", () => {
  test("retorna quantidade solicitada sem duplicatas", () => {
    vi.spyOn(Math, "random").mockReturnValue(0)

    const questions: Question[] = [
      makeQuestion("001", "CLF_002-cloud-concepts"),
      makeQuestion("002", "CLF_002-cloud-concepts"),
      makeQuestion("003", "CLF_002-security-and-compliance"),
      makeQuestion("004", "CLF_002-security-and-compliance"),
      makeQuestion("005", "CLF_002-aws-technologies"),
      makeQuestion("006", "CLF_002-billing-and-pricing"),
    ]

    const selected = selectExamQuestions(
      "CLF_002",
      questions,
      {
        "CLF_002-cloud-concepts": 0.5,
        "CLF_002-security-and-compliance": 0.5,
        "CLF_002-aws-technologies": 0,
        "CLF_002-billing-and-pricing": 0,
      },
      4
    )

    expect(selected).toHaveLength(4)
    expect(new Set(selected.map((q) => q.id)).size).toBe(4)
    expect(selected.every((q) => q.exam === "cloud-practitioner")).toBe(true)
  })

  test("preenche com questões remanescentes quando distribuição não alcança count", () => {
    vi.spyOn(Math, "random").mockReturnValue(0)

    const questions: Question[] = [
      makeQuestion("001", "CLF_002-cloud-concepts"),
      makeQuestion("002", "CLF_002-security-and-compliance"),
      makeQuestion("003", "CLF_002-aws-technologies"),
      makeQuestion("004", "CLF_002-billing-and-pricing"),
    ]

    const selected = selectExamQuestions(
      "CLF_002",
      questions,
      {
        "CLF_002-cloud-concepts": 0.25,
        "CLF_002-security-and-compliance": 0,
        "CLF_002-aws-technologies": 0,
        "CLF_002-billing-and-pricing": 0,
      },
      3
    )

    expect(selected).toHaveLength(3)
    expect(new Set(selected.map((q) => q.id)).size).toBe(3)
  })
})
