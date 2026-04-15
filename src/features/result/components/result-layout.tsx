import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatTimerLabel } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress, ProgressLabel } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router"
import type { QuizResult } from "@/types/quiz"

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

  return (
    <main className="min-h-dvh bg-deep px-6 py-10 md:px-8 lg:px-12">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <Badge
            data-approved={result.passed}
            className="data-[approved=false]:bg-wrong/20 data-[approved=false]:text-wrong data-[approved=true]:bg-correct/20 data-[approved=true]:text-correct"
            variant="outline"
            role="status"
          >
            {result.passed ? "Aprovado" : "Não Aprovado"}
          </Badge>

          <div className="space-y-2">
            <h1
              data-approved={result.passed}
              className="text-6xl font-bold data-[approved=false]:text-wrong data-[approved=true]:text-correct"
            >
              {result.score}%
            </h1>
            <p className="text-secondary-tx">
              {result.correctCount} de {result.totalQuestions} questões corretas
            </p>
          </div>
        </header>

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
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary-tx">
                {result.correctCount}
              </p>
              <p className="text-xs text-secondary-tx">Acertos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary-tx">
                {result.incorrectCount}
              </p>
              <p className="text-xs text-secondary-tx">Erros</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            size="lg"
            onClick={() => navigate("/", { replace: true })}
          >
            Voltar para Home
          </Button>
        </div>
      </section>
    </main>
  )
}
