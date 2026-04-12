import type { Question } from "@/types/question"

export function makeQuestion(
  id: string,
  domainCode: Question["domainCode"],
  correctAnswers: Question["correctAnswers"] = ["a"]
): Question {
  return {
    id: `CLF_002-question-${id}`,
    exam: "cloud-practitioner",
    domain:
      domainCode === "CLF_002-cloud-concepts"
        ? "Conceitos de Nuvem"
        : domainCode === "CLF_002-security-and-compliance"
          ? "Segurança e Conformidade"
          : domainCode === "CLF_002-aws-technologies"
            ? "Tecnologia e Serviços de Nuvem"
            : "Cobranças, Preços e Suporte",
    domainCode,
    type: "single",
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
    references: [],
    tags: [],
  } as Question
}
