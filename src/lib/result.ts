import type {
  DomainBreakdown,
  DomainCode,
  Exam,
  ExamDomains,
} from "@/types/domains"
import type { Question, QuestionAnswer } from "@/types/question"
import type { QuizMode, QuizResult } from "@/types/quiz"

export const MIN_SCORE = 100
export const MAX_SCORE = 1000
export const SCORE_TO_PASS = 700

export function calculateDomainBreakdown(
  questions: Question[],
  answers: Record<string, QuestionAnswer>
): DomainBreakdown {
  const domainBreakdown: DomainBreakdown = {}

  questions.forEach((q) => {
    const userAnswer = answers[q.id]
    const isCorrect = userAnswer.isCorrect || false

    // Breakdown por domínio
    if (!domainBreakdown[q.domain]) {
      domainBreakdown[q.domain as ExamDomains[DomainCode]] = {
        correct: 0,
        total: 0,
      }
    }

    domainBreakdown[q.domain as ExamDomains[DomainCode]].total++

    if (isCorrect)
      domainBreakdown[q.domain as ExamDomains[DomainCode]].correct++
  })

  return domainBreakdown
}

export function calculateScore(
  questions: Question[],
  correctCount: number
): number {
  if (questions.length === 0) return MIN_SCORE

  const score = Math.round(MIN_SCORE + (correctCount / questions.length) * 1000)
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, score))
}

export function hasPassed(score: number): boolean {
  return score >= SCORE_TO_PASS
}

export function calculateQuizResult(
  sessionId: string,
  exam: Exam,
  mode: QuizMode,
  questions: Question[],
  answers: Record<string, QuestionAnswer>,
  duration: number
): QuizResult {
  let correctCount = 0
  let incorrectCount = 0

  questions.forEach((q) => {
    const userAnswer = answers[q.id]
    const userAnswers = userAnswer.selectedOptionIds || []
    const isCorrect = userAnswer.isCorrect || false

    if (isCorrect) correctCount++
    else if (userAnswers.length > 0) incorrectCount++
  })

  const score = calculateScore(questions, correctCount)
  const passed = hasPassed(score)
  const domainBreakdown = calculateDomainBreakdown(questions, answers)

  return {
    sessionId,
    exam,
    mode,
    totalQuestions: questions.length,
    correctCount,
    incorrectCount,
    score,
    passed,
    domainBreakdown,
    duration,
    completedAt: new Date(),
  }
}
