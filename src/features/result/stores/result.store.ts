import type { QuizResult } from "@/types/quiz"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface QuizResultState {
  result: QuizResult | null
  setResult: (result: QuizResult) => void
  clearResult: () => void
}

export const RESULT_STORAGE_KEY = "quiz-result"

export const resultStoreCreator = (
  set: (partial: Partial<QuizResultState>) => void
): QuizResultState => ({
  result: null,

  setResult: (result) =>
    set({
      result: result,
    }),

  clearResult: () =>
    set({
      result: null,
    }),
})

interface PersistedState {
  result: QuizResult | null
}

export const useResultStore = create<QuizResultState>()(
  persist(resultStoreCreator, {
    name: RESULT_STORAGE_KEY,
    partialize: (state) => ({
      result: state.result,
    }),
    version: 2,
    migrate: (state: unknown, version: number): PersistedState => {
      if (version === 1) {
        const typedState = state as PersistedState
        // Migração de v1 para v2: adicionar questionAnswerDetails se não existir
        return {
          result: typedState.result
            ? {
                ...typedState.result,
                questionAnswerDetails:
                  typedState.result?.questionAnswerDetails || [],
              }
            : null,
        }
      }
      return state as PersistedState
    },
  })
)
