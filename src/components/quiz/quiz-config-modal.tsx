import { useMemo, useState } from "react"
import { Check, Funnel } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  CLF_002_DISTRIBUTION,
  CLF_002_DOMAINS,
  type DomainCode,
  type DomainDistribution,
} from "@/types/domains"
import type { QuizConfig } from "@/types/quiz"

const questionOptions = [10, 20, 40, 65] as const

const domainOptions = Object.keys(CLF_002_DOMAINS) as DomainCode[]

type QuizConfigModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStart?: (config: QuizConfig) => void
}

export default function QuizConfigModal({
  open,
  onOpenChange,
  onStart,
}: QuizConfigModalProps) {
  const [questionCount, setQuestionCount] = useState<number>(0)
  const [selectedDomains, setSelectedDomains] = useState<DomainCode[]>([
    ...domainOptions,
  ])

  const selectedDomainSet = useMemo(
    () => new Set(selectedDomains),
    [selectedDomains]
  )

  const canStart = selectedDomains.length > 0 && questionCount > 0

  function toggleDomain(domain: DomainCode) {
    setSelectedDomains((currentDomains) => {
      const hasDomain = currentDomains.includes(domain)

      if (hasDomain) {
        if (currentDomains.length === 1) {
          return currentDomains
        }

        return currentDomains.filter(
          (currentDomain) => currentDomain !== domain
        )
      }

      return [...currentDomains, domain]
    })
  }

  function handleSelectAll() {
    setSelectedDomains([...domainOptions])
  }

  function handleStart() {
    if (!canStart) {
      return
    }

    const distribution = Object.fromEntries(
      Object.entries(CLF_002_DISTRIBUTION).filter(([domain]) =>
        selectedDomainSet.has(domain as DomainCode)
      )
    ) as DomainDistribution

    onStart?.({
      mode: "practice",
      exam: "CLF_002",
      duration: null,
      totalQuestions: questionCount,
      distribution,
      domains: selectedDomains,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => onOpenChange(nextOpen)}>
      <DialogContent className="gap-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Configurar Quiz
          </DialogTitle>
          <DialogDescription>
            Personalize sua sessão de prática
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-secondary-tx">Número de questões</p>

          <div className="grid grid-cols-4 gap-2">
            {questionOptions.map((option) => {
              const isSelected = option === questionCount

              return (
                <label key={option} className="cursor-pointer">
                  <input
                    type="radio"
                    name="questionCount"
                    value={option}
                    checked={isSelected}
                    onChange={() => setQuestionCount(option)}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "inline-flex h-10 w-full items-center justify-center rounded-xl border px-0 text-base font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted/10 bg-secondary/50 text-secondary-tx hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    {option}
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-secondary-tx">
              <Funnel className="size-4" />
              <span>Filtrar por Domínio</span>
            </div>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto px-0 text-sm text-secondary-tx hover:text-foreground"
              onClick={handleSelectAll}
            >
              Selecionar Todos
            </Button>
          </div>

          <div className="p-2">
            <div className="space-y-1.5">
              {Object.entries(CLF_002_DOMAINS).map(([domain, label]) => {
                const isSelected = selectedDomainSet.has(domain as DomainCode)
                return (
                  <label
                    key={domain}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm text-secondary-tx transition-colors hover:bg-secondary/40 hover:text-foreground"
                  >
                    <span className="relative inline-flex size-6 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleDomain(domain as DomainCode)}
                        className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-sm border border-muted/10 bg-muted/10 checked:border-primary checked:bg-primary hover:border-primary/50"
                      />
                      <Check className="pointer-events-none relative z-10 size-4 text-foreground opacity-0 peer-checked:opacity-100" />
                    </span>
                    <span>{label}</span>
                  </label>
                )
              })}
            </div>
          </div>
          <p role="note" className="text-xs text-secondary-tx">
            Aviso: A quantidade de questões disponíveis para prática pode variar
            dependendo dos domínios selecionados.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DialogClose>Cancelar</DialogClose>
          <Button
            type="button"
            size="lg"
            onClick={handleStart}
            disabled={!canStart}
          >
            Iniciar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type { QuizConfig }
