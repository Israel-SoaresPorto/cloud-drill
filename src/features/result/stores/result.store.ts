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

export const useResultStore = create<QuizResultState>()(
  persist(resultStoreCreator, {
    name: RESULT_STORAGE_KEY,
    partialize: (state) => ({
      result: state.result,
    }),
    version: 1,
  })
)
