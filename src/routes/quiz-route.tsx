import { useQuizStore } from "@/features/quiz/stores/quiz.store"
import { Navigate } from "react-router"
import QuizLayout from "@/features/quiz/components/quiz-layout"

export default function QuizPage() {
  const session = useQuizStore((state) => state.session)

  if (!session) {
    return <Navigate to="/" replace />
  }

  const currentQuestion = session.questions[session.currentIndex]

  if (!currentQuestion) {
    return <Navigate to="/" replace />
  }

  return <QuizLayout session={session} />
}
