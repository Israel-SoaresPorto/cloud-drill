import { useQuizStore } from "@/features/quiz/stores/quiz.store"
import { Navigate } from "react-router"

export default function QuizPage() {
  const session = useQuizStore((state) => state.session)

  if (!session) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center">
      <h1 className="text-2xl font-bold">Quiz Page</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}
