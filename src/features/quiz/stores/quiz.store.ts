import { create, type StateCreator } from "zustand"
import { persist } from "zustand/middleware"
import type { QuizSession } from "@/types/quiz"
import type {
  OptionsID,
  Question,
  QuestionAnswer,
  QuestionID,
} from "@/types/question"
import type { DomainCode, ExamDomains, Exams } from "@/types/domains"
import { generateQuizSessionID } from "@/lib/quiz"

export interface QuizState {
  // Estado
  session: QuizSession | null
  isRevealed: boolean // feedback visível?
  timeRemaining: number | null // para modo simulado
  sessionExpired: boolean // rastreia expiração por timeout

  // Ações
  startSession: (config: SessionConfig) => void
  submitAnswer: (questionId: QuestionID, answers: OptionsID[]) => void
  goToQuestion: (questionIndex: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  revealAnswer: () => void
  toggleQuestionReview: (questionId: QuestionID) => void
  tickTimer: () => void // decrementa timeRemaining a cada segundo
  endSession: (
    forceExpired?: boolean
  ) => Omit<
    QuizSession,
    "domains" | "currentIndex" | "startTime" | "endTime" | "timeLimit"
  > & { duration: number }
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
  sessionExpired: false,

  goToQuestion: (questionIndex) => {
    const { session } = get()
    if (!session) return

    if (questionIndex < 0 || questionIndex >= session.questions.length) {
      return
    }

    const targetQuestion = session.questions[questionIndex]
    const hasAnsweredTargetQuestion =
      !!session.answers[targetQuestion.id] &&
      session.answers[targetQuestion.id].selectedOptionIds.length > 0

    set({
      session: {
        ...session,
        currentIndex: questionIndex,
      },
      isRevealed: hasAnsweredTargetQuestion,
    })
  },

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
      reviewFlags: {},
      startTime: Date.now(),
      timeLimit: config.mode === "simulated" ? 90 * 60 : undefined, // 90 min
    }

    set({
      session,
      isRevealed: false,
      timeRemaining: session.timeLimit || null,
      sessionExpired: false,
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

    console.log("Resposta submetida:", questionAnswer)
    console.log("Tempo Expirado?", get().sessionExpired)

    // remove questão dos flags de revisão ao responder
    const reviewFlags = { ...(session.reviewFlags ?? {}) }
    delete reviewFlags[questionId]

    set({
      session: {
        ...session,
        answers: {
          ...session.answers,
          [questionId]: questionAnswer,
        },
        reviewFlags,
      },
    })
  },

  // Próxima questão
  nextQuestion: () => {
    const { session } = get()
    if (!session) return

    if (session.currentIndex < session.questions.length - 1) {
      get().goToQuestion(session.currentIndex + 1)
    }
  },

  // Questão anterior
  previousQuestion: () => {
    const { session } = get()
    if (!session) return

    if (session.currentIndex > 0) {
      get().goToQuestion(session.currentIndex - 1)
    }
  },

  // Revelar resposta (modo prática)
  revealAnswer: () => set({ isRevealed: true }),

  // Marcar/desmarcar questão para revisão
  toggleQuestionReview: (questionId) => {
    const { session } = get()
    if (!session) return

    const targetQuestion = session.questions.find(
      (question) => question.id === questionId
    )

    if (!targetQuestion) return

    const hasAnsweredTargetQuestion =
      !!session.answers[targetQuestion.id] &&
      session.answers[targetQuestion.id].selectedOptionIds.length > 0

    if (hasAnsweredTargetQuestion) return

    const reviewFlags = { ...(session.reviewFlags ?? {}) }

    if (reviewFlags[questionId]) {
      delete reviewFlags[questionId]
    } else {
      reviewFlags[questionId] = true
    }

    set({
      session: {
        ...session,
        reviewFlags,
      },
    })
  },

  // Finalizar sessão e retornar resultado
  endSession: (forceExpired?: boolean) => {
    const { session } = get()
    if (!session) throw new Error("No active session")

    if (forceExpired === true) {
      set({ sessionExpired: true })
    }

    const endTime = Date.now()
    const duration = Math.floor((endTime - session.startTime) / 1000)

    return {
      id: session.id,
      exam: session.exam,
      mode: session.mode,
      questions: session.questions,
      answers: session.answers,
      duration,
      sessionExpired: get().sessionExpired,
    }
  },

  // Decrementar timer a cada segundo
  tickTimer: () => {
    const { timeRemaining, session } = get()

    if (timeRemaining === null || session?.mode !== "simulated") return

    const newTimeRemaining = Math.max(timeRemaining - 1, 0)

    if (newTimeRemaining === 0) {
      set({
        timeRemaining: newTimeRemaining,
        sessionExpired: true,
      })
    } else {
      set({ timeRemaining: newTimeRemaining })
    }
  },

  // Limpar sessão
  clearSession: () =>
    set({
      session: null,
      isRevealed: false,
      timeRemaining: null,
      sessionExpired: false,
    }),
})

export const useQuizStore = create<QuizState>()(
  persist(quizStoreCreator, {
    name: "quiz-session", // chave do localStorage
    partialize: (state) => ({
      session: state.session,
      timeRemaining: state.timeRemaining,
    }),
    version: 1,
  })
)
