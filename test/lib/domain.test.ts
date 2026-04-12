import { describe, expect, test } from "vitest"
import { groupQuestionsByDomain } from "@/lib/domain"
import { makeQuestion } from "../utils/question"


describe("groupQuestionsByDomain", () => {
  test("agrupa questões por domainCode", () => {
    const questions = [
      makeQuestion("001", "CLF_002-cloud-concepts"),
      makeQuestion("002", "CLF_002-security-and-compliance"),
      makeQuestion("003", "CLF_002-cloud-concepts"),
    ]

    const grouped = groupQuestionsByDomain(questions)

    expect(grouped["CLF_002-cloud-concepts"]).toHaveLength(2)
    expect(grouped["CLF_002-security-and-compliance"]).toHaveLength(1)
  })

  test("retorna objeto vazio para entrada vazia", () => {
    const grouped = groupQuestionsByDomain([])

    expect(grouped).toEqual({})
  })
})
