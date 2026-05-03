import type { QuestionAnswerDetail, QuizResult } from "@/types/quiz"

export function makeResult(overrides: Partial<QuizResult> = {}): QuizResult {
  return {
    sessionId: "session-1",
    exam: "CLF_002",
    mode: "practice",
    totalQuestions: 20,
    correctCount: 14,
    incorrectCount: 6,
    score: 700,
    passed: true,
    domainBreakdown: {
      "Conceitos de Nuvem": { correct: 4, total: 5 },
      "Segurança e Conformidade": { correct: 3, total: 5 },
      "Tecnologia e Serviços de Nuvem": { correct: 4, total: 6 },
      "Cobranças, Preços e Suporte": { correct: 3, total: 4 },
    },
    duration: 1122,
    completedAt: new Date("2026-04-15T12:00:00.000Z"),
    questionAnswerDetails: [],
    ...overrides,
  }
}

export function makeQuestionAnswerDetail(
  overrides: Partial<QuestionAnswerDetail> = {}
): QuestionAnswerDetail {
  return {
    id: "CLF_002-question-001",
    selectedOptionIds: ["b"],
    isCorrect: false,
    questionText: "Qual é o modelo de cobrança preferível para uma startup?",
    correctAnswers: ["d"],
    domain: "Conceitos de Nuvem",
    options: [
      { id: "a", text: "Compra de hardware dedicado antecipada" },
      { id: "b", text: "Provisionamento fixo por 3 anos" },
      { id: "c", text: "Aquisição de licenças perpétuas" },
      { id: "d", text: "Pagamento conforme o uso (pay-as-you-go)" },
    ],
    explanation: {
      general:
        "Na nuvem, a empresa troca gastos antecipados por cobrança baseada no consumo real.",
      incorrects: {
        a: "Incorreta. A compra de hardware exige alto investimento inicial (CapEx).",
        b: "Incorreta. O provisionamento fixo de infraestrutura pode gerar capacidade ociosa.",
        c: "Incorreta. Licenças perpétuas representam um custo inicial fixo e elevado.",
      },
    },
    ...overrides,
  }
}
