import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, test, vi, beforeEach } from "vitest"

import QuizConfigModal from "@/components/quiz/quiz-config-modal"
import { CLF_002_DISTRIBUTION } from "@/types/domains"

describe("QuizConfigModal", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renderiza as opções principais quando aberto", () => {
    render(
      <QuizConfigModal open={true} onOpenChange={vi.fn()} onStart={vi.fn()} />
    )

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Configurar Quiz")).toBeInTheDocument()
    expect(
      screen.getByText("Personalize sua sessão de prática")
    ).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "10" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "20" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "40" })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: "65" })).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Conceitos de Nuvem" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Segurança e Conformidade" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Tecnologia e Serviços de Nuvem" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("checkbox", { name: "Cobranças, Preços e Suporte" })
    ).toBeInTheDocument()
  })

  test("permite trocar a quantidade de questões e selecionar domínios", () => {
    const onStart = vi.fn()

    render(
      <QuizConfigModal open={true} onOpenChange={vi.fn()} onStart={onStart} />
    )

    fireEvent.click(screen.getByRole("radio", { name: "20" }))
    fireEvent.click(screen.getByRole("button", { name: "Selecionar Todos" }))

    fireEvent.click(screen.getByRole("button", { name: "Iniciar" }))

    expect(onStart).toHaveBeenCalledWith({
      mode: "practice",
      exam: "CLF_002",
      duration: null,
      totalQuestions: 20,
      distribution: CLF_002_DISTRIBUTION,
      domains: [
        "CLF_002-cloud-concepts",
        "CLF_002-security-and-compliance",
        "CLF_002-aws-technologies",
        "CLF_002-billing-and-pricing",
      ],
    })
  })

  test("desabilita o botão de iniciar se nenhuma opção for selecionada", () => {
    render(
      <QuizConfigModal open={true} onOpenChange={vi.fn()} onStart={vi.fn()} />
    )

    const startButton = screen.getByRole("button", { name: "Iniciar" })
    expect(startButton).toBeDisabled()
  })

  test("monta distribuição somente com domínios selecionados", () => {
    const onStart = vi.fn()

    render(
      <QuizConfigModal open={true} onOpenChange={vi.fn()} onStart={onStart} />
    )

    fireEvent.click(screen.getByRole("radio", { name: "10" }))
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Cobranças, Preços e Suporte" })
    )

    fireEvent.click(screen.getByRole("button", { name: "Iniciar" }))

    expect(onStart).toHaveBeenCalledWith({
      mode: "practice",
      exam: "CLF_002",
      duration: null,
      totalQuestions: 10,
      distribution: {
        "CLF_002-cloud-concepts": 0.28,
        "CLF_002-security-and-compliance": 0.24,
        "CLF_002-aws-technologies": 0.36,
      },
      domains: [
        "CLF_002-cloud-concepts",
        "CLF_002-security-and-compliance",
        "CLF_002-aws-technologies",
      ],
    })
  })

  test("exibe o aviso sobre variação de questões", () => {
    render(
      <QuizConfigModal open={true} onOpenChange={vi.fn()} onStart={vi.fn()} />
    )

    expect(screen.getByRole("note")).toHaveTextContent(
      /Aviso: A quantidade de questões disponíveis para prática pode variar/i
    )
  })

  test("fecha o modal ao clicar em cancelar ou no botão de fechar", () => {
    const onOpenChange = vi.fn()

    render(
      <QuizConfigModal
        open={true}
        onOpenChange={onOpenChange}
        onStart={vi.fn()}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    fireEvent.click(screen.getByRole("button", { name: "Close" }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onOpenChange).toHaveBeenCalledTimes(2)
  })

  test("permite selecionar e desmarcar domínios individualmente", () => {
    const onStart = vi.fn()

    render(
      <QuizConfigModal open={true} onOpenChange={vi.fn()} onStart={onStart} />
    )

    const cloudConceptsCheckbox = screen.getByRole("checkbox", {
      name: "Conceitos de Nuvem",
    })
    const securityComplianceCheckbox = screen.getByRole("checkbox", {
      name: "Segurança e Conformidade",
    })

    fireEvent.click(cloudConceptsCheckbox)
    fireEvent.click(securityComplianceCheckbox)

    expect(cloudConceptsCheckbox).not.toBeChecked()
    expect(securityComplianceCheckbox).not.toBeChecked()

    fireEvent.click(cloudConceptsCheckbox)

    expect(cloudConceptsCheckbox).toBeChecked()
    expect(securityComplianceCheckbox).not.toBeChecked()
  })
})
