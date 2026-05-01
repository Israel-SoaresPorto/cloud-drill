import type { QuizSession } from "@/types/quiz"
import { makeQuestion } from "./question"
import type { ExamDomains, DomainCode } from "@/types/domains"

export function createQuizSession(
  overrides: Partial<QuizSession> = {}
): QuizSession {
  return {
    id: "session-1",
    exam: "CLF_002" as const,
    domains: ["CLF_002-cloud-concepts"] as ExamDomains[DomainCode][],
    mode: "simulated" as const,
    questions: [makeQuestion("001", "CLF_002-cloud-concepts")],
    currentIndex: 0,
    answers: {},
    startTime: 1000,
    timeLimit: 100,
    ...overrides,
  } as QuizSession
}
