import ResultLayout from "@/features/result/components/result-layout"
import { useResultStore } from "@/features/result/stores/result.store"
import { Navigate } from "react-router"

export default function ResultPage() {
  const result = useResultStore((state) => state.result)

  if (!result) {
    return <Navigate to="/" replace />
  }

  return <ResultLayout result={result} />
}
