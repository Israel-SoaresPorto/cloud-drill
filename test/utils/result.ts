import type { QuizResult } from "@/types/quiz"

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
    ...overrides,
  }
}
