import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import QuizHeader from "@/features/quiz/components/quiz-header"

describe("QuizHeader", () => {
  const renderQuizHeader = (props = {}) => {
    const defaultProps = {
      certificationLabel: "Cloud Certified Practitioner",
      currentQuestion: 2,
      totalQuestions: 10,
      timerLabel: "08:30",
      onFinish: vi.fn(),
      onExit: vi.fn(),
      onOpenProgressMap: vi.fn(),
    }

    return render(<QuizHeader {...defaultProps} {...props} />)
  }

  test("renderiza informações do cabeçalho do questionário", () => {
    renderQuizHeader()

    expect(screen.getByText("Cloud Certified Practitioner")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("08:30")).toBeInTheDocument()
  })

  test("chama a função para finalizar o quiz ao clicar no botão de finalizar", () => {
    const onFinish = vi.fn()

    renderQuizHeader({ onFinish })

    const finishButton = screen.getByRole("button", { name: /Finalizar/i })
    fireEvent.click(finishButton)

    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  test("chama a função de sair do quiz ao clicar no botão de abrir mapa de progresso", () => {
    const onExit = vi.fn()

    renderQuizHeader({ onExit })

    const progressMapButton = screen.getByRole("button", {
      name: /Sair/i,
    })
    fireEvent.click(progressMapButton)

    expect(onExit).toHaveBeenCalledTimes(1)
  })

  test("chama a função de abrir mapa de progresso ao clicar no botão de abrir mapa de progresso", () => {
    const onOpenProgressMap = vi.fn()

    renderQuizHeader({ onOpenProgressMap })

    const progressMapButton = screen.getByRole("button", {
      name: /Abrir mapa de questões/i,
    })
    fireEvent.click(progressMapButton)

    expect(onOpenProgressMap).toHaveBeenCalledTimes(1)
  })
})
