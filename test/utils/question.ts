import { CLF_002_DOMAINS } from "@/types/domains"
import type { Question } from "@/types/question"

export function makeQuestion(
  id: string,
  domainCode: Question["domainCode"],
  type: Question["type"] = "single",
  correctAnswers: Question["correctAnswers"] = ["a"]
): Question {
  return {
    id: `CLF_002-question-${id}`,
    exam: "cloud-practitioner",
    domain: CLF_002_DOMAINS[domainCode],
    domainCode,
    type,
    question: `Question ${id}`,
    options: [
      { id: "a", text: "A" },
      { id: "b", text: "B" },
      { id: "c", text: "C" },
      { id: "d", text: "D" },
    ],
    correctAnswers,
    explanation: {
      general: "ok",
      incorrects: {
        b: "x",
        c: "x",
        d: "x",
        e: "x",
      },
    },
    references: ["https://docs.aws.amazon.com/"],
    tags: [],
  } as Question
}
