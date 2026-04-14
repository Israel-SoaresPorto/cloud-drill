import type { OptionsID } from "@/types/question"
import { useQuizStore } from "../stores/quiz.store"
import QuestionCard from "./question-card"
import QuizExplanation from "./quiz-explanation"
import QuizHeader from "./quiz-header"
import QuizNavigation from "./quiz-navigation"
import { formatTimerLabel } from "@/lib/utils"
import type { QuizSession } from "@/types/quiz"
import { Progress } from "@/components/ui/progress"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import QuizAlert from "@/components/alert"

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
  const [finalizedResult, setFinalizedResult] = useState<ReturnType<
    typeof endSession
  > | null>(null)
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

  const handleFinish = () => {
    const result = endSession()
    setFinalizedResult(result)
    console.log("Quiz finalizado:", result)
    clearSession()
  }

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

  if (finalizedResult) {
    return (
      <div className="min-h-dvh bg-deep px-6 py-10 md:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-3xl rounded-xl border border-idle bg-card p-6 md:p-8">
          <h1 className="text-2xl font-bold text-primary-tx">
            Resultado Final
          </h1>
          <p className="mt-2 text-secondary-tx">
            Você acertou {finalizedResult.correctCount} de{" "}
            {finalizedResult.totalQuestions} questões.
          </p>
          <p className="mt-4 text-lg font-semibold text-primary-tx">
            Pontuação: {finalizedResult.score}% (
            {finalizedResult.passed ? "Aprovado" : "Não aprovado"})
          </p>

          <Button
            type="button"
            size="lg"
            className="mt-8 bg-accent-orange text-[#0e0c1a] hover:bg-accent-orange/90"
            onClick={() => navigate("/", { replace: true })}
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    )
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
