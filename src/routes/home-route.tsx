import { useCallback, useState } from "react"
import { BookmarkCheck, BookOpen, Timer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Header from "@/components/layout/header"
import QuizConfigModal from "@/components/quiz/quiz-config-modal"
import { useNavigate } from "react-router"
import type { QuizConfig } from "@/types/quiz"
import { loadQuestionsForExam } from "@/lib/question"
import { selectExamQuestions } from "@/lib/quiz"
import { useQuizStore } from "@/features/quiz/stores/quiz.store"
import { cn } from "@/lib/utils"
import { useResultStore } from "@/features/result/stores/result.store"
import QuizAlert from "@/components/alert"
import LoadingOverlay from "@/components/loading-overlay"
import {
  CLF_002_DISTRIBUTION,
  CLF_002_DOMAINS,
  type DomainCode,
} from "@/types/domains"

const features = [
  {
    icon: BookOpen,
    title: "Quiz Livre",
    description: "Questões aleatórias com feedback imediato",
  },
  {
    icon: Timer,
    title: "Modo Simulado",
    description: "65 questões em 90 minutos como no exame real",
  },
  {
    icon: BookmarkCheck,
    title: "Progresso Salvo",
    description: "Continua de onde parou automaticamente",
  },
] as const

export default function HomeRoute() {
  const [isQuizConfigOpen, setIsQuizConfigOpen] = useState(false)
  const navigate = useNavigate()
  const [isStartingQuiz, setIsStartingQuiz] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const startQuiz = useQuizStore((state) => state.startSession)
  const result = useResultStore((state) => state.result)
  const [simulatedModeSelected, setSimulatedModeSelected] = useState(false)

  const handleStartSimulated = useCallback(() => {
    setIsStartingQuiz(true)
    setLoadingMessage("Carregando modo simulado...")
    setSimulatedModeSelected(false)

    const loadedQuestions = loadQuestionsForExam("CLF_002")
    const selectedQuestions = selectExamQuestions(
      "CLF_002",
      loadedQuestions,
      CLF_002_DISTRIBUTION
    )

    startQuiz({
      exam: "CLF_002",
      questions: selectedQuestions,
      mode: "simulated",
      questionCount: 65,
      domains: Object.keys(CLF_002_DOMAINS) as DomainCode[],
    })

    setTimeout(() => {
      navigate("/quiz")
    }, 600)
  }, [startQuiz, navigate])

  const handleStartQuiz = useCallback(
    (config: QuizConfig) => {
      setIsStartingQuiz(true)
      setLoadingMessage("Carregando questões...")
      setIsQuizConfigOpen(false)

      const loadedQuestions = loadQuestionsForExam(config.exam)
      let practiceQuestions = loadedQuestions

      if (config.domains.length < 4 && config.domains.length > 0) {
        practiceQuestions = loadedQuestions.filter((q) => {
          let included = false

          config.domains.forEach((domain) => {
            if (q.domainCode === domain) {
              included = true
              return true
            }
          })

          return included
        })

        config.totalQuestions = Math.min(
          config.totalQuestions,
          practiceQuestions.length
        )
      }

      const selectedQuestions = selectExamQuestions(
        config.exam,
        practiceQuestions,
        config.distribution,
        config.totalQuestions
      )

      startQuiz({
        exam: config.exam,
        questions: selectedQuestions,
        mode: config.mode,
        questionCount: config.totalQuestions,
        domains: config.domains,
      })

      setTimeout(() => {
        navigate("/quiz")
      }, 600)
    },
    [navigate, startQuiz]
  )

  return (
    <div className="flex min-h-dvh flex-col justify-center">
      <Header />
      <QuizConfigModal
        open={isQuizConfigOpen}
        onOpenChange={setIsQuizConfigOpen}
        onStart={handleStartQuiz}
      />

      <main
        className={cn(
          "relative flex flex-1 flex-col justify-center overflow-hidden transition-opacity duration-300",
          isStartingQuiz && "pointer-events-none opacity-60",
          !isStartingQuiz && "opacity-100"
        )}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,222,128,0.08),transparent_42%),radial-gradient(circle_at_center,rgba(255,168,0,0.05),transparent_30%)]" />
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute top-32 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="max-w-8xl flex w-full flex-1 flex-col px-6 py-6 md:px-8 lg:px-12">
          <section className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-4">
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    Prepare-se para a Certificação AWS
                  </h1>
                  <p className="mx-auto max-w-md text-base leading-7 text-secondary-tx sm:text-lg">
                    Estude para a certificação AWS com quiz interativo
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="border-accent-cyan bg-accent-cyan/25 px-4 py-2 text-sm text-accent-cyan shadow-sm"
                >
                  Cloud Certified Practitioner
                </Badge>
              </div>

              <div className="grid w-full gap-3 md:grid-cols-3">
                {features.map(({ icon: Icon, title, description }) => (
                  <Card
                    key={title}
                    className="text-left backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5"
                    aria-label={title}
                    aria-description={description}
                  >
                    <CardHeader className="gap-3 p-5 pb-3">
                      <div className="flex items-center gap-2.5 text-foreground">
                        <span aria-hidden="true" className="inline-flex size-6 items-center justify-center rounded-md text-accent-cyan">
                          <Icon className="size-6" aria-hidden="true" focusable="false" />
                        </span>
                        <CardTitle className="text-base text-foreground">
                          {title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-6 text-muted-tx">
                        {description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-foreground">
                Escolha o Modo de Estudo
              </h3>

              <div className="flex gap-4 pt-2">
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    type="button"
                    size="lg"
                    className="w-40 shadow-[0_12px_30px_rgba(255,168,0,0.2)] transition-transform hover:-translate-y-0.5"
                    onClick={() => setIsQuizConfigOpen(true)}
                  >
                    Modo Livre
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    className="w-40 shadow-[0_12px_30px_rgba(255,168,0,0.2)] transition-transform hover:-translate-y-0.5"
                    onClick={() => setSimulatedModeSelected(true)}
                  >
                    Modo Simulado
                  </Button>
                </div>
              </div>
              {result && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="bg-transparent shadow-[0_12px_30px_rgba(255,168,0,0.2)] transition-transform hover:-translate-y-0.5 hover:bg-accent/75 dark:hover:bg-accent/50"
                  onClick={() => navigate("/resultado", { replace: true })}
                >
                  Ver Resultado Anterior
                </Button>
              )}
            </div>
          </section>
        </div>
      </main>
      <footer className="max-w-8xl w-full p-6 px-6 py-6 text-center md:px-8 lg:px-12">
        <p className="text-xs text-muted-foreground">
          v1.0 - CloudDrill é um projeto de código aberto e gratuito para ajudar
          na preparação para a certificação AWS Certified Cloud Practitioner.
        </p>
      </footer>

      {simulatedModeSelected && (
        <QuizAlert
          title="Ir para o Modo Simulado"
          description="O Modo Simulado oferece uma experiência de exame real, com 65 questões e limite de tempo de 90 minutos, sem revelar as respostas. Iniciar agora?"
          open={simulatedModeSelected}
          onOpenChange={setSimulatedModeSelected}
          onConfirm={handleStartSimulated}
        />
      )}

      <LoadingOverlay isVisible={isStartingQuiz} message={loadingMessage} />
    </div>
  )
}
