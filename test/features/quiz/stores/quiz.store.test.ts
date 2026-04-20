import { beforeEach, describe, expect, test, vi } from "vitest"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  quizStoreCreator,
  type QuizState,
} from "@/features/quiz/stores/quiz.store"
import * as quizLib from "@/lib/quiz"
import { makeQuestion } from "../../../utils/question"

describe("Quiz Store - Logic", () => {
  const useQuizStore = create<QuizState>(quizStoreCreator)

  beforeEach(() => {
    useQuizStore.getState().clearSession()
  })

  test("startSession inicializa sessão de prática sem revelar feedback", () => {
    vi.spyOn(quizLib, "generateQuizSessionID").mockReturnValue("session-1")

    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts"],
      questionCount: 1,
      mode: "practice",
      questions: [makeQuestion("001", "CLF_002-cloud-concepts")],
    })

    const state = useQuizStore.getState()

    expect(state.session?.id).toBe("session-1")
    expect(state.session?.mode).toBe("practice")
    expect(state.session?.currentIndex).toBe(0)
    expect(state.isRevealed).toBe(false)
    expect(state.timeRemaining).toBeNull()
  })

  test("startSession em modo simulado define limite e tempo restante", () => {
    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts"],
      questionCount: 1,
      mode: "simulated",
      questions: [makeQuestion("001", "CLF_002-cloud-concepts")],
    })

    expect(useQuizStore.getState().session?.timeLimit).toBe(90 * 60)
    expect(useQuizStore.getState().timeRemaining).toBe(90 * 60)
  })

  test("submitAnswer marca correta e incorreta", () => {
    const question = makeQuestion("001", "CLF_002-cloud-concepts", "multiple", [
      "a",
      "b",
    ])

    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts"],
      questionCount: 1,
      mode: "practice",
      questions: [question],
    })

    useQuizStore.getState().submitAnswer(question.id, ["a", "b"])
    expect(
      useQuizStore.getState().session?.answers[question.id].isCorrect
    ).toBe(true)

    useQuizStore.getState().submitAnswer(question.id, ["a"])
    expect(
      useQuizStore.getState().session?.answers[question.id].isCorrect
    ).toBe(false)
  })

  test("submitAnswer ignora questão inexistente", () => {
    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts"],
      questionCount: 1,
      mode: "practice",
      questions: [makeQuestion("001", "CLF_002-cloud-concepts")],
    })

    useQuizStore.getState().submitAnswer("CLF_002-question-999" as const, ["a"])

    expect(useQuizStore.getState().session?.answers).toEqual({})
  })

  test("nextQuestion e previousQuestion respeitam limites e isRevealed", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts", "CLF_002-security-and-compliance"],
      questionCount: 2,
      mode: "simulated",
      questions: [q1, q2],
    })

    expect(useQuizStore.getState().session?.currentIndex).toBe(0)
    expect(useQuizStore.getState().isRevealed).toBe(false)

    useQuizStore.getState().nextQuestion()
    expect(useQuizStore.getState().session?.currentIndex).toBe(1)
    expect(useQuizStore.getState().isRevealed).toBe(false)

    useQuizStore.getState().submitAnswer(q1.id, ["a"])
    useQuizStore.getState().previousQuestion()
    expect(useQuizStore.getState().session?.currentIndex).toBe(0)
    expect(useQuizStore.getState().isRevealed).toBe(true)

    useQuizStore.getState().previousQuestion()
    expect(useQuizStore.getState().session?.currentIndex).toBe(0)
  })

  test("nextQuestion não ultrapassa limite superior", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts", "CLF_002-security-and-compliance"],
      questionCount: 2,
      mode: "practice",
      questions: [q1, q2],
    })

    useQuizStore.getState().nextQuestion()
    useQuizStore.getState().nextQuestion()

    expect(useQuizStore.getState().session?.currentIndex).toBe(1)
  })

  test("previousQuestion volta com isRevealed false quando questão anterior não foi respondida", () => {
    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")

    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts", "CLF_002-security-and-compliance"],
      questionCount: 2,
      mode: "practice",
      questions: [q1, q2],
    })

    useQuizStore.getState().nextQuestion()
    useQuizStore.getState().submitAnswer(q2.id, ["a"])
    useQuizStore.getState().previousQuestion()

    expect(useQuizStore.getState().session?.currentIndex).toBe(0)
    expect(useQuizStore.getState().isRevealed).toBe(false)
  })

  test("endSession retorna dados para calculo de resultado", () => {
    vi.spyOn(quizLib, "generateQuizSessionID").mockReturnValue("session-1")
    vi.spyOn(Date, "now").mockReturnValueOnce(1000).mockReturnValueOnce(61_000)

    const q1 = makeQuestion("001", "CLF_002-cloud-concepts")
    const q2 = makeQuestion("002", "CLF_002-security-and-compliance")
    const q3 = makeQuestion("003", "CLF_002-aws-technologies")

    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: [
        "CLF_002-cloud-concepts",
        "CLF_002-security-and-compliance",
        "CLF_002-aws-technologies",
      ],
      questionCount: 3,
      mode: "practice",
      questions: [q1, q2, q3],
    })

    useQuizStore.getState().submitAnswer(q1.id, ["a"])
    useQuizStore.getState().submitAnswer(q2.id, ["a"])
    useQuizStore.getState().submitAnswer(q3.id, ["b"])

    const result = useQuizStore.getState().endSession()

    expect(result.id).toBe("session-1")
    expect(result.exam).toBe("CLF_002")
    expect(result.mode).toBe("practice")
    expect(result.questions).toStrictEqual([q1, q2, q3])
    expect(result.duration).toBe(60)
    expect(result.answers).toHaveProperty("CLF_002-question-001", {
      id: "CLF_002-question-001",
      isCorrect: true,
      selectedOptionIds: ["a"],
    })
  })

  test("clearSession reseta estado", () => {
    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts"],
      questionCount: 1,
      mode: "practice",
      questions: [makeQuestion("001", "CLF_002-cloud-concepts")],
    })

    useQuizStore.getState().clearSession()

    expect(useQuizStore.getState().session).toBeNull()
    expect(useQuizStore.getState().isRevealed).toBe(false)
    expect(useQuizStore.getState().timeRemaining).toBeNull()
  })

  test("endSession sem sessão ativa lança erro", () => {
    expect(() => useQuizStore.getState().endSession()).toThrow(
      "No active session"
    )
  })
})

describe("Quiz Store - Persistence", () => {
  const useQuizStore = create<QuizState>()(
    persist(quizStoreCreator, {
      name: "quiz-session", // chave do localStorage
      partialize: (state) => ({ session: state.session }), // só persiste a sessão
    })
  )

  test("persist salva sessão no localStorage", () => {
    vi.spyOn(quizLib, "generateQuizSessionID").mockReturnValue(
      "session-persist"
    )

    useQuizStore.getState().startSession({
      exam: "CLF_002",
      domains: ["CLF_002-cloud-concepts"],
      questionCount: 1,
      mode: "practice",
      questions: [makeQuestion("001", "CLF_002-cloud-concepts")],
    })

    const raw = localStorage.getItem("quiz-session")

    expect(raw).toContain("session-persist")
  })
})
