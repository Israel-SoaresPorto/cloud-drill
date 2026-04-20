import type {
  DomainBreakdown,
  DomainCode,
  DomainDistribution,
  Exam,
  ExamDomains,
  Exams,
} from "./domains"
import type { Question, QuestionAnswer } from "./question"

export type QuizMode = "simulated" | "practice"

export interface QuizConfig {
  exam: Exam
  mode: QuizMode
  duration: number | null // em segundos, null para sem limite
  totalQuestions: number
  distribution: DomainDistribution
  domains: DomainCode[]
}

export interface QuizSession {
  id: string
  exam: keyof typeof Exams
  domains: ExamDomains[DomainCode][]
  mode: QuizMode
  questions: Question[]
  currentIndex: number
  answers: Record<string, QuestionAnswer>
  startTime: number
  endTime?: number
  timeLimit?: number
}

export interface QuizResult {
  sessionId: string
  exam: Exam
  mode: QuizMode
  totalQuestions: number
  correctCount: number
  incorrectCount: number
  score: number
  passed: boolean
  domainBreakdown: DomainBreakdown
  duration: number // em segundos
  completedAt: Date
}
