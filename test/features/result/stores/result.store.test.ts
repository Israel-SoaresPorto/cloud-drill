import { describe, expect, test } from "vitest"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  RESULT_STORAGE_KEY,
  resultStoreCreator,
  type QuizResultState,
} from "@/features/result/stores/result.store"
import { makeResult } from "../../../utils/result"

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
