import { useQuizStore } from "@/features/quiz/stores/quiz.store"
import ResultLayout from "@/features/result/components/result-layout"
import { useResultStore } from "@/features/result/stores/result.store"
import { useEffect } from "react"
import { Navigate } from "react-router"

export default function ResultPage() {
  const result = useResultStore((state) => state.result)
  const clearSession = useQuizStore((state) => state.clearSession)

  useEffect(() => {
    if (result) {
      clearSession()
    }
  }, [clearSession, result])

  if (!result) {
    return <Navigate to="/" replace />
  }

  return <ResultLayout result={result} />
}
