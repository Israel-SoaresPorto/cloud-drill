import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatTimerLabel } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CircularProgress } from "@/components/circular-progress"
import { useNavigate } from "react-router"
import { QuestionsReviewSection } from "./questions-review-section"
import type { QuizResult } from "@/types/quiz"
import { MAX_SCORE } from "@/lib/result"

interface ResultLayoutProps {
  result: QuizResult
}

export default function ResultLayout({ result }: ResultLayoutProps) {
  const navigate = useNavigate()

  const domainRows = Object.entries(result.domainBreakdown)

  const domainPercent = (domain: { correct: number; total: number }) => {
    return domain.total > 0
      ? Math.round((domain.correct / domain.total) * 100)
      : 0
  }

  const getDomainPercentLabel = (percent: number) => {
    if (percent >= 70) {
      return "excellent"
    } else if (percent >= 40) {
      return "tolerable"
    } else {
      return "poor"
    }
  }

  const hasQuestionDetails =
    result.questionAnswerDetails && result.questionAnswerDetails.length > 0

  return (
    <main className="min-h-dvh bg-deep px-6 py-8 md:px-8 md:py-12 lg:px-12">
      <div className="mx-auto w-full max-w-4xl space-y-12">
        {/* Header */}
        <header className="flex flex-col-reverse items-center gap-8 xs:flex-row xs:justify-between">
          <div className="flex flex-col items-center gap-4 xs:items-start">
            <Badge
              data-approved={result.passed}
              className="text-lg data-[approved=false]:bg-wrong/20 data-[approved=false]:text-wrong data-[approved=true]:bg-correct/20 data-[approved=true]:text-correct"
              variant="outline"
              role="status"
            >
              {result.passed ? "Aprovado" : "Não Aprovado"}
            </Badge>

            <div className="space-y-2 text-center xs:text-left">
              <h1 className="text-2xl font-bold text-primary-tx">
                Sua Pontuação
              </h1>
              <p className="text-secondary-tx">
                {result.correctCount} de {result.totalQuestions} questões
                corretas
              </p>
            </div>
          </div>

          <div className="flex-1 md:flex md:justify-end">
            <CircularProgress
              value={result.score}
              max={100}
              size="lg"
              renderLabel={() => (
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{result.score}</span>
                  <span className="text-sm text-secondary-tx">
                    /{MAX_SCORE}
                  </span>
                </div>
              )}
            />
          </div>
        </header>

        {/* Ações */}
        <div className="flex justify-center md:justify-start">
          <Button
            type="button"
            size="lg"
            onClick={() => navigate("/", { replace: true })}
          >
            Voltar para Home
          </Button>
        </div>

        {/* Resumo de Desempenho */}
        <section className="space-y-8">
          <h2 className="text-lg font-semibold text-primary-tx">
            Resumo de Desempenho
          </h2>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary-tx">
                  {formatTimerLabel(result.duration)}
                </p>
                <p className="text-xs text-secondary-tx">Tempo total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary-tx">
                  {result.totalQuestions}
                </p>
                <p className="text-xs text-secondary-tx">Questões</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="bg-green-50 p-4 text-center dark:bg-green-950/20">
                <p className="text-2xl font-bold text-primary-tx">
                  {result.correctCount}
                </p>
                <p className="text-xs text-secondary-tx">Acertos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="bg-red-50 p-4 text-center dark:bg-red-950/20">
                <p className="text-2xl font-bold text-primary-tx">
                  {result.incorrectCount}
                </p>
                <p className="text-xs text-secondary-tx">Erros</p>
              </CardContent>
            </Card>
          </div>

          {/* Desempenho por Domínio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-primary-tx">
                Desempenho por Domínio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {domainRows.map(([domainName, domain]) => {
                const percent = domainPercent(domain)

                const percentLabel = getDomainPercentLabel(percent)

                return (
                  <div
                    key={domainName}
                    className="group space-y-2"
                    data-percent-label={percentLabel}
                    aria-label={`Desempenho de ${domainName}`}
                  >
                    <Progress
                      value={percent}
                      className="flex w-full flex-col gap-2 group-data-[percent-label=excellent]:**:data-[slot=progress-indicator]:bg-correct group-data-[percent-label=poor]:**:data-[slot=progress-indicator]:bg-wrong group-data-[percent-label=tolerable]:**:data-[slot=progress-indicator]:bg-yellow-500"
                      aria-label={`Progresso de ${domainName}`}
                    >
                      <ProgressLabel className="flex w-full items-center justify-between gap-4">
                        <p className="text-primary-tx">{domainName}</p>
                        <p className="font-medium group-data-[percent-label=excellent]:text-correct group-data-[percent-label=poor]:text-wrong group-data-[percent-label=tolerable]:text-yellow-500">
                          {domain.correct}/{domain.total} ({percent}%)
                        </p>
                      </ProgressLabel>
                    </Progress>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </section>

        {/* Revisão de Questões */}
        {hasQuestionDetails && (
          <section>
            <QuestionsReviewSection details={result.questionAnswerDetails} />
          </section>
        )}
      </div>
    </main>
  )
}
