import { useState } from "react"
import { ArrowRight, BookmarkCheck, BookOpen, Timer } from "lucide-react"
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

const features = [
  {
    icon: BookOpen,
    title: "Quiz Livre",
    description: "Questões aleatórias com feedback imediato",
  },
  {
    icon: Timer,
    title: "Modo Simulado (Em breve)",
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

  return (
    <div className="flex min-h-dvh flex-col justify-center">
      <Header />
      <QuizConfigModal
        open={isQuizConfigOpen}
        onOpenChange={setIsQuizConfigOpen}
        onStart={() => setIsQuizConfigOpen(false)}
      />
      <main className="relative flex flex-1 flex-col justify-center overflow-hidden">
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
                  <p className="mx-auto max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
                    Estude para a certificação AWS com quiz interativo
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className="border-accent/35 bg-accent/10 px-4 py-2 text-sm text-accent shadow-sm"
                >
                  Cloud Certified Practitioner
                </Badge>
              </div>

              <div className="grid w-full gap-3 md:grid-cols-3">
                {features.map(({ icon: Icon, title, description }) => (
                  <Card
                    key={title}
                    className="border-white/5 bg-card/80 text-left backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/10"
                  >
                    <CardHeader className="gap-3 p-5 pb-3">
                      <div className="flex items-center gap-2.5 text-foreground">
                        <span className="inline-flex size-6 items-center justify-center rounded-md text-accent-cyan">
                          <Icon className="size-6" />
                        </span>
                        <CardTitle className="text-base text-foreground">
                          {title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-6 text-muted-foreground">
                        {description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  size="lg"
                  className="h-11 rounded-xl px-6 text-sm font-semibold shadow-[0_12px_30px_rgba(255,168,0,0.2)] transition-transform hover:-translate-y-0.5"
                  onClick={() => setIsQuizConfigOpen(true)}
                >
                  Começar a Estudar
                  <ArrowRight className="size-4" />
                </Button>
              </div>
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
    </div>
  )
}
