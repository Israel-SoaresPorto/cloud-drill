import type { OptionsID } from "@/types/question"
import { useQuizStore } from "../stores/quiz.store"
import QuestionCard from "./question-card"
import QuizExplanation from "./quiz-explanation"
import QuizHeader from "./quiz-header"
import QuizNavigation from "./quiz-navigation"
import { formatTimerLabel } from "@/lib/utils"
import type { QuizSession } from "@/types/quiz"
import { Progress } from "@/components/ui/progress"
import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import QuizAlert from "@/components/alert"
import { useResultStore } from "../../result/stores/result.store"
import { calculateQuizResult } from "@/lib/result"

interface QuizLayoutProps {
  session: QuizSession
}

export default function QuizLayout({ session }: QuizLayoutProps) {
  const navigate = useNavigate()
  const isRevealed = useQuizStore((state) => state.isRevealed)
  const submitAnswer = useQuizStore((state) => state.submitAnswer)
  const previousQuestion = useQuizStore((state) => state.previousQuestion)
  const nextQuestion = useQuizStore((state) => state.nextQuestion)
  const revealAnswer = useQuizStore((state) => state.revealAnswer)
  const endSession = useQuizStore((state) => state.endSession)
  const clearSession = useQuizStore((state) => state.clearSession)
  const timeRemaining = useQuizStore((state) => state.timeRemaining)
  const setResult = useResultStore((state) => state.setResult)

  const [draftAnswers, setDraftAnswers] = useState<Record<string, OptionsID[]>>(
    {}
  )
  const [openQuitAlert, setOpenQuitAlert] = useState(false)
  const [openFinishAlert, setOpenFinishAlert] = useState(false)

  const currentQuestion = session.questions[session.currentIndex]
  const currentAnswer = session.answers[currentQuestion.id]
  const currentSelected =
    currentAnswer?.selectedOptionIds ?? draftAnswers[currentQuestion.id] ?? []
  const answeredCount = currentAnswer?.selectedOptionIds.length ?? 0
  const hasAnsweredCurrent = answeredCount > 0
  const isCurrentRevealed = hasAnsweredCurrent || isRevealed
  const canConfirm = !hasAnsweredCurrent && currentSelected.length > 0
  const canGoPrevious = session.currentIndex > 0
  const canGoNext = session.currentIndex < session.questions.length - 1
  const certificationLabel =
    session.exam === "CLF_002"
      ? "Cloud Certified Practitioner"
      : "AWS Certification"
  const timerLabel =
    session.mode === "simulated"
      ? formatTimerLabel(timeRemaining ?? session.timeLimit)
      : "Prática"

  const percentComplete =
    ((session.currentIndex + (hasAnsweredCurrent ? 1 : 0)) /
      Math.max(session.questions.length, 1)) *
    100

  const totalAnswered = useMemo(
    () =>
      Object.values(session.answers).filter(
        (answer) => answer.selectedOptionIds.length > 0
      ).length,
    [session.answers]
  )

  const handleConfirm = () => {
    if (!canConfirm) return

    submitAnswer(currentQuestion.id, currentSelected)
    revealAnswer()
  }

  const handleFinish = useCallback(() => {
    const {
      answers,
      exam,
      mode,
      questions,
      duration,
      id: sessionId,
    } = endSession()

    const result = calculateQuizResult(
      sessionId,
      exam,
      mode,
      questions,
      answers,
      duration
    )

    setResult(result)
    navigate("/resultado", { replace: true })
  }, [endSession, setResult, navigate])

  const handleQuizComplete = () => {
    const totalQuestions = session.questions.length
    const totalAnswered = Object.values(session.answers).filter(
      (answer) => answer.selectedOptionIds.length > 0
    ).length

    if (totalAnswered === totalQuestions) {
      handleFinish()
    } else {
      setOpenFinishAlert(true)
    }
  }

  const handleExit = () => {
    clearSession()
    navigate("/", { replace: true })
  }

  return (
    <div className="min-h-dvh bg-deep">
      <QuizHeader
        certificationLabel={certificationLabel}
        currentQuestion={session.currentIndex + 1}
        totalQuestions={session.questions.length}
        timerLabel={timerLabel}
        onFinish={handleQuizComplete}
        onExit={() => setOpenQuitAlert(true)}
      />

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-8 md:px-8 lg:px-12">
        <div className="mb-8 self-stretch">
          <Progress
            value={percentComplete}
            className="flex h-6 justify-between rounded-full"
            aria-label="Progresso do quiz"
            aria-valuemin={1}
            aria-valuemax={Math.max(session.questions.length, 1)}
            aria-valuenow={totalAnswered}
          >
            <span>Progresso</span>
            <span>{`${Math.round(percentComplete)}%`}</span>
          </Progress>
        </div>

        <section className="space-y-8">
          <QuestionCard
            question={currentQuestion}
            selectedOptionIds={currentSelected}
            revealed={isCurrentRevealed}
            disabled={hasAnsweredCurrent}
            onSelectionChange={(nextSelected) => {
              setDraftAnswers((prev) => ({
                ...prev,
                [currentQuestion.id]: nextSelected as OptionsID[],
              }))
            }}
          />

          <QuizNavigation
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            canConfirm={canConfirm}
            isAnswered={hasAnsweredCurrent}
            onPrevious={previousQuestion}
            onNext={nextQuestion}
            onConfirm={handleConfirm}
          />

          {isCurrentRevealed && currentAnswer && (
            <QuizExplanation
              question={currentQuestion}
              answer={currentAnswer}
            />
          )}
        </section>
      </main>

      {/* Alertas de confirmação para sair do quiz */}
      <QuizAlert
        open={openQuitAlert}
        onOpenChange={setOpenQuitAlert}
        title="Sair do quiz"
        description="Tem certeza que deseja sair? Seu progresso atual será perdido."
        onConfirm={handleExit}
      />

      {/* Alerta de confirmação para finalizar o quiz com respostas pendentes */}
      <QuizAlert
        open={openFinishAlert}
        onOpenChange={setOpenFinishAlert}
        title="Finalizar quiz"
        description="Você ainda tem questões não respondidas. Tem certeza que deseja finalizar? Você receberá um resultado parcial."
        onConfirm={handleFinish}
      />
    </div>
  )
}
