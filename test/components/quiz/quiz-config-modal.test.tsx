import { fireEvent, render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, test, vi, beforeEach } from "vitest"

import QuizConfigModal from "@/components/quiz/quiz-config-modal"

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
      questionCount: 20,
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

  test("permite iniciar o quiz com pelos menos um domínio selecionado", () => {
    const onStart = vi.fn()

    render(
      <QuizConfigModal open={true} onOpenChange={vi.fn()} onStart={onStart} />
    )

    fireEvent.click(screen.getByRole("radio", { name: "40" }))
    fireEvent.click(screen.getByRole("checkbox", { name: "Conceitos de Nuvem" }))
    fireEvent.click(screen.getByRole("checkbox", { name: "Tecnologia e Serviços de Nuvem" }))
    fireEvent.click(screen.getByRole("checkbox", { name: "Cobranças, Preços e Suporte" }))

    fireEvent.click(screen.getByRole("button", { name: "Iniciar" }))

    expect(onStart).toHaveBeenCalledWith({
      questionCount: 40,
      domains: ["CLF_002-security-and-compliance"],
    })
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
})
