import { describe, expect, test, beforeEach } from "vitest"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  RESULT_STORAGE_KEY,
  resultStoreCreator,
  type QuizResultState,
} from "@/features/result/stores/result.store"
import { makeResult } from "../../../utils/result"
import type { QuizResult } from "@/types/quiz"

describe("Quiz Result Store - Logica", () => {
  const useResultStore = create<QuizResultState>(resultStoreCreator)

  test("setLastResult salva apenas o último resultado", () => {
    const first = makeResult({ sessionId: "session-1", score: 70 })
    const second = makeResult({ sessionId: "session-2", score: 85 })

    useResultStore.getState().setResult(first)
    useResultStore.getState().setResult(second)

    const state = useResultStore.getState()

    expect(state.result?.sessionId).toBe("session-2")
    expect(state.result?.score).toBe(85)
  })

  test("clearLastResult remove o resultado armazenado", () => {
    useResultStore.getState().setResult(makeResult())

    useResultStore.getState().clearResult()

    expect(useResultStore.getState().result).toBeNull()
  })
})

describe("Quiz Result Store - Persistência", () => {
  const useResultStore = create<QuizResultState>()(
    persist(resultStoreCreator, {
      name: RESULT_STORAGE_KEY,
      partialize: (state) => ({
        result: state.result,
      }),
    })
  )

  test("salva resultado no localStorage", () => {
    const result = makeResult({ sessionId: "persist-1" })

    useResultStore.getState().setResult(result)

    const raw = localStorage.getItem(RESULT_STORAGE_KEY)

    expect(raw).not.toBeNull()
    expect(raw).toContain("persist-1")
  })
})

interface V1State {
  result:
    | (Omit<QuizResult, "questionAnswerDetails"> & {
        questionAnswerDetails?: never[]
      })
    | null
}

describe("Quiz Result Store - Migration v1 to v2", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test("migration: v1 data without questionAnswerDetails gets empty array added", () => {
    // Simulate migrate function logic with old v1 data
    const state: V1State = {
      result: {
        sessionId: "session-1",
        exam: "CLF_002",
        mode: "practice",
        totalQuestions: 50,
        correctCount: 45,
        incorrectCount: 5,
        score: 90,
        passed: true,
        domainBreakdown: {},
        duration: 1800,
        completedAt: new Date("2024-01-01"),
      },
    }
    const version = 1

    // Execute migration function logic
    let migratedState: {
      result: QuizResult | null
    }
    if (version === 1) {
      migratedState = {
        result: state.result
          ? {
              ...(state.result as QuizResult),
              questionAnswerDetails:
                (state.result as Partial<QuizResult>)?.questionAnswerDetails ||
                [],
            }
          : null,
      }
    } else {
      migratedState = state as { result: QuizResult | null }
    }

    expect(migratedState.result?.questionAnswerDetails).toEqual([])
    expect(migratedState.result?.sessionId).toBe("session-1")
    expect(migratedState.result?.score).toBe(90)
  })

  test("migration: v2 data with questionAnswerDetails passes through unchanged", () => {
    // Simulate migrate function logic with new v2 data
    const state: { result: QuizResult | null } = {
      result: makeResult({
        sessionId: "session-2",
        questionAnswerDetails: [
          {
            id: "CLF_002-question-001" as `CLF_002-${string}`,
            selectedOptionIds: ["a" as const],
            isCorrect: true,
            questionText: "What is AWS?",
            correctAnswers: ["a" as const],
            explanation: {
              general: "AWS is a cloud provider",
              incorrects: {},
            },
            domain: "Technology",
            options: [{ id: "a" as const, text: "Amazon Web Services" }],
          },
        ],
      }),
    }
    const version: number = 2

    // Execute migration function logic
    let migratedState: { result: QuizResult | null }
    if (version === 1) {
      migratedState = {
        result: state.result
          ? {
              ...state.result,
              questionAnswerDetails: state.result?.questionAnswerDetails || [],
            }
          : null,
      }
    } else {
      migratedState = state
    }

    expect(migratedState.result?.questionAnswerDetails).toHaveLength(1)
    expect(migratedState.result?.sessionId).toBe("session-2")
  })

  test("migration: null result handles gracefully without error", () => {
    // Simulate migrate function logic with null state
    const state: { result: QuizResult | null } = { result: null }
    const version = 1

    // Execute migration function logic
    let migratedState: { result: QuizResult | null }
    if (version === 1) {
      migratedState = {
        result: state.result
          ? {
              ...state.result,
              questionAnswerDetails: state.result?.questionAnswerDetails || [],
            }
          : null,
      }
    } else {
      migratedState = state
    }

    expect(migratedState.result).toBeNull()
  })

  test("store persists with version: 2 in localStorage", () => {
    const useResultStore = create<QuizResultState>()(
      persist(resultStoreCreator, {
        name: "test-quiz-result-v2",
        partialize: (state) => ({
          result: state.result,
        }),
        version: 2,
      })
    )

    const result = makeResult({
      sessionId: "migration-test",
      questionAnswerDetails: [],
    })

    useResultStore.getState().setResult(result)

    const stored = localStorage.getItem("test-quiz-result-v2")
    expect(stored).not.toBeNull()
    expect(stored).toContain('"version":2')

    localStorage.removeItem("test-quiz-result-v2")
  })
})
