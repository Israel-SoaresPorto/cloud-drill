import type { OptionsID } from "@/types/question"
import { useQuizStore } from "../stores/quiz.store"
import QuestionCard from "./question-card"
import QuizExplanation from "./quiz-explanation"
import QuizHeader from "./quiz-header"
import QuizNavigation from "./quiz-navigation"
import QuizProgressMap from "./quiz-progress-map"
import type { QuizSession } from "@/types/quiz"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { formatTimerLabel } from "@/lib/utils"
import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import QuizAlert from "@/components/alert"
import { useResultStore } from "../../result/stores/result.store"
import { calculateQuizResult } from "@/lib/result"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuizTimer } from "../hooks/use-quiz-timer"

interface QuizLayoutProps {
  session: QuizSession
}

export default function QuizLayout({ session }: QuizLayoutProps) {
  const navigate = useNavigate()
  const liveSession = useQuizStore((state) => state.session)
  const isRevealed = useQuizStore((state) => state.isRevealed)
  const submitAnswer = useQuizStore((state) => state.submitAnswer)
  const goToQuestion = useQuizStore((state) => state.goToQuestion)
  const previousQuestion = useQuizStore((state) => state.previousQuestion)
  const nextQuestion = useQuizStore((state) => state.nextQuestion)
  const revealAnswer = useQuizStore((state) => state.revealAnswer)
  const toggleQuestionReview = useQuizStore(
    (state) => state.toggleQuestionReview
  )
  const endSession = useQuizStore((state) => state.endSession)
  const clearSession = useQuizStore((state) => state.clearSession)
  const timeRemaining = useQuizStore((state) => state.timeRemaining)
  const setResult = useResultStore((state) => state.setResult)

  // Usar o hook do timer - ele gerencia o countdown automaticamente
  const { isExpired } = useQuizTimer()

  const currentSession = liveSession ?? session

  const [draftAnswers, setDraftAnswers] = useState<Record<string, OptionsID[]>>(
    {}
  )
  const [isProgressMapOpen, setIsProgressMapOpen] = useState(false)
  const [openQuitAlert, setOpenQuitAlert] = useState(false)
  const [openFinishAlert, setOpenFinishAlert] = useState(false)

  const isSimulatedMode = currentSession.mode === "simulated"
  const currentQuestion = currentSession.questions[currentSession.currentIndex]
  const currentAnswer = currentSession.answers[currentQuestion.id]
  const currentSelected =
    draftAnswers[currentQuestion.id] ?? currentAnswer?.selectedOptionIds ?? []
  const answeredCount = currentAnswer?.selectedOptionIds.length ?? 0
  const hasAnsweredCurrent = answeredCount > 0
  const isCurrentRevealed =
    (hasAnsweredCurrent || isRevealed) && currentAnswer !== undefined
  const canReveal = isCurrentRevealed && !isSimulatedMode
  const canConfirm =
    !isSimulatedMode && !hasAnsweredCurrent && currentSelected.length > 0
  const canGoPrevious = currentSession.currentIndex > 0
  const canGoNext =
    currentSession.currentIndex < currentSession.questions.length - 1
  const certificationLabel =
    currentSession.exam === "CLF_002"
      ? "Cloud Certified Practitioner"
      : "AWS Certification"
  const timerLabel = isSimulatedMode
    ? formatTimerLabel(timeRemaining ?? currentSession.timeLimit)
    : "Prática"

  const totalAnswered = useMemo(
    () =>
      Object.values(currentSession.answers).filter(
        (answer) => answer.selectedOptionIds.length > 0
      ).length,
    [currentSession.answers]
  )

  const percentComplete =
    (totalAnswered / Math.max(currentSession.questions.length, 1)) * 100

  const handleSelectionChange = (nextSelected: OptionsID[]) => {
    if (isSimulatedMode) {
      submitAnswer(currentQuestion.id, nextSelected)
      return
    }

    setDraftAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: nextSelected,
    }))
  }

  const handleConfirm = () => {
    if (!canConfirm || isExpired) return

    if (currentSession.mode === "practice") {
      submitAnswer(currentQuestion.id, currentSelected)
      revealAnswer()
    }
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
    const totalQuestions = currentSession.questions.length
    const totalAnswered = Object.values(currentSession.answers).filter(
      (answer) => answer.selectedOptionIds.length > 0
    ).length

    if (totalAnswered === totalQuestions || isExpired) {
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
    <div className="relative min-h-dvh bg-deep">
      <QuizHeader
        certificationLabel={certificationLabel}
        currentQuestion={currentSession.currentIndex + 1}
        totalQuestions={currentSession.questions.length}
        timerLabel={timerLabel}
        onFinish={handleQuizComplete}
        onExit={() => setOpenQuitAlert(true)}
        onOpenProgressMap={() => setIsProgressMapOpen(true)}
      />

      <main className="mx-auto grid min-h-[calc(100vh-8.6rem)] w-full lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="flex flex-col items-center space-y-8 px-6 py-8 md:px-8 lg:px-12">
          <div className="w-full max-w-5xl space-y-8">
            <div className="space-y-4">
              <Progress
                value={percentComplete}
                className="w-full"
                aria-label="Progresso do quiz"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(percentComplete)}
                aria-valuetext={`${totalAnswered} de ${currentSession.questions.length} respondidas`}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <ProgressLabel>Respostas confirmadas</ProgressLabel>
                  <span className="ml-auto text-sm text-secondary-tx tabular-nums">
                    {`${totalAnswered}/${currentSession.questions.length} (${Math.round(percentComplete)}%)`}
                  </span>
                </div>
              </Progress>
            </div>
            <QuestionCard
              question={currentQuestion}
              selectedOptionIds={currentSelected}
              revealed={canReveal}
              disabled={(hasAnsweredCurrent || isExpired) && canReveal}
              isMarkedForReview={
                currentSession.reviewFlags?.[currentQuestion.id] ?? false
              }
              onSelectionChange={(nextSelected) =>
                handleSelectionChange(nextSelected)
              }
              onToggleReview={() => toggleQuestionReview(currentQuestion.id)}
            />
            {canReveal && (
              <QuizExplanation
                question={currentQuestion}
                answer={currentAnswer}
              />
            )}
          </div>
        </section>

        <aside
          id="quiz-progress-map-panel"
          className="sticky top-17 hidden h-[calc(100vh-8.6rem)] bg-card p-4 lg:block"
        >
          <QuizProgressMap
            session={currentSession}
            currentIndex={currentSession.currentIndex}
            onJumpToQuestion={goToQuestion}
          />
        </aside>
      </main>

      <footer className="sticky bottom-0 place-items-center border-t border-secondary bg-card px-4 py-4 md:px-8 lg:px-12">
        {isExpired ? (
          <div
            className="w-full"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            aria-label="Tempo expirado"
          >
            <div className="flex w-full items-center justify-center rounded-lg bg-destructive/10 px-4 py-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-lg font-semibold text-destructive">
                  Tempo Expirado
                </span>
                <span className="text-sm text-destructive/80">
                  Seu quiz foi finalizado automaticamente
                </span>
              </div>
            </div>
          </div>
        ) : (
          <QuizNavigation
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            canConfirm={canConfirm && !isExpired}
            isAnswered={hasAnsweredCurrent}
            isSimulatedMode={currentSession.mode === "simulated"}
            onPrevious={previousQuestion}
            onNext={nextQuestion}
            onConfirm={handleConfirm}
          />
        )}
      </footer>

      {isProgressMapOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-start gap-4 overflow-auto bg-background p-4 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mapa das questões"
        >
          <div className="mb-4 flex w-full items-center justify-between">
            <h2 className="text-lg font-semibold">Progresso</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsProgressMapOpen(false)}
              className="rounded-lg p-2 hover:bg-card"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <QuizProgressMap
            session={currentSession}
            currentIndex={currentSession.currentIndex}
            onJumpToQuestion={(index) => {
              goToQuestion(index)
              setIsProgressMapOpen(false)
            }}
            className="w-full"
          />
          <div className="flex w-full flex-1 flex-wrap items-end justify-between gap-4 md:hidden">
            <Button
              type="button"
              variant="outline"
              className="grow basis-40 border-idle bg-transparent text-secondary-tx hover:bg-option hover:text-primary-tx xs:grow-0"
              onClick={() => setOpenQuitAlert(true)}
            >
              Sair do quiz
            </Button>
            <Button
              type="button"
              className="grow basis-40 xs:grow-0"
              onClick={() => {
                handleQuizComplete()
              }}
            >
              Finalizar quiz
            </Button>
          </div>
        </div>
      )}

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
