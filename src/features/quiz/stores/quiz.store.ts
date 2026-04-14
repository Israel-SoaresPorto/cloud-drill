import { create, type StateCreator } from "zustand"
import { persist } from "zustand/middleware"
import type { QuizSession, QuizResult } from "@/types/quiz"
import type {
  OptionsID,
  Question,
  QuestionAnswer,
  QuestionID,
} from "@/types/question"
import type {
  DomainBreakdown,
  DomainCode,
  ExamDomains,
  Exams,
} from "@/types/domains"
import { generateQuizSessionID } from "@/lib/quiz"

interface QuizState {
  // Estado
  session: QuizSession | null
  isRevealed: boolean // feedback visível?
  timeRemaining: number | null // para modo simulado

  // Ações
  startSession: (config: SessionConfig) => void
  submitAnswer: (questionId: QuestionID, answers: OptionsID[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  revealAnswer: () => void
  endSession: () => QuizResult
  clearSession: () => void
}

interface SessionConfig {
  exam: keyof typeof Exams
  domains: DomainCode[]
  questionCount: number
  mode: "practice" | "simulated"
  questions: Question[] // já embaralhadas
}

export const quizStoreCreator: StateCreator<QuizState> = (set, get) => ({
  // Estado inicial
  session: null,
  isRevealed: false,
  timeRemaining: null,

  // Iniciar nova sessão
  startSession: (config) => {
    const id = generateQuizSessionID()

    const session: QuizSession = {
      id,
      exam: config.exam,
      domains: config.domains as ExamDomains[DomainCode][],
      mode: config.mode,
      questions: config.questions,
      currentIndex: 0,
      answers: {},
      startTime: Date.now(),
      timeLimit: config.mode === "simulated" ? 90 * 60 : undefined, // 90 min
    }

    set({
      session,
      isRevealed: false,
      timeRemaining: session.timeLimit || null,
    })
  },

  // Submeter resposta
  submitAnswer: (questionId, answers) => {
    const { session } = get()
    if (!session) return

    const question = session.questions.find((q) => q.id === questionId)

    if (!question) return

    const isCorrect =
      answers.length === question.correctAnswers.length &&
      answers.every((ans) => question.correctAnswers.includes(ans))

    const questionAnswer: QuestionAnswer = {
      id: questionId,
      selectedOptionIds: answers,
      isCorrect,
    }

    set({
      session: {
        ...session,
        answers: {
          ...session.answers,
          [questionId]: questionAnswer,
        },
      },
    })
  },

  // Próxima questão
  nextQuestion: () => {
    const { session } = get()
    if (!session) return

    if (session.currentIndex < session.questions.length - 1) {
      const nextIndex = session.currentIndex + 1
      const nextQuestion = session.questions[nextIndex]
      const hasAnsweredNextQuestion =
        !!session.answers[nextQuestion.id] &&
        session.answers[nextQuestion.id].selectedOptionIds.length > 0

      set({
        session: {
          ...session,
          currentIndex: nextIndex,
        },
        isRevealed: hasAnsweredNextQuestion,
      })
    }
  },

  // Questão anterior
  previousQuestion: () => {
    const { session } = get()
    if (!session) return

    if (session.currentIndex > 0) {
      const nextIndex = session.currentIndex - 1
      const nextQuestion = session.questions[nextIndex]
      const hasAnsweredNextQuestion =
        !!session.answers[nextQuestion.id] &&
        session.answers[nextQuestion.id].selectedOptionIds.length > 0

      set({
        session: {
          ...session,
          currentIndex: nextIndex,
        },
        isRevealed: hasAnsweredNextQuestion,
      })
    }
  },

  // Revelar resposta (modo prática)
  revealAnswer: () => set({ isRevealed: true }),

  // Finalizar sessão e retornar resultado
  endSession: () => {
    const { session } = get()
    if (!session) throw new Error("No active session")

    const endTime = Date.now()
    const duration = Math.floor((endTime - session.startTime) / 1000)

    // Calcular resultado
    let correctCount = 0
    let incorrectCount = 0
    const domainBreakdown: DomainBreakdown = {} as DomainBreakdown

    session.questions.forEach((q) => {
      const userAnswer = session.answers[q.id]
      const userAnswers = userAnswer?.selectedOptionIds || []
      const isCorrect = userAnswer?.isCorrect || false

      if (isCorrect) correctCount++
      else if (userAnswers.length > 0) incorrectCount++

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

    const score = Math.round((correctCount / session.questions.length) * 100)

    const result: QuizResult = {
      sessionId: session.id,
      exam: session.exam,
      mode: session.mode,
      totalQuestions: session.questions.length,
      correctCount,
      incorrectCount,
      score,
      passed: score >= 70, // nota de corte de 70%
      domainBreakdown,
      duration,
      completedAt: new Date(),
    }

    return result
  },

  // Limpar sessão
  clearSession: () =>
    set({
      session: null,
      isRevealed: false,
      timeRemaining: null,
    }),
})

export const useQuizStore = create<QuizState>()(
  persist(quizStoreCreator, {
    name: "quiz-session", // chave do localStorage
    partialize: (state) => ({ session: state.session }), // só persiste a sessão
  })
)
