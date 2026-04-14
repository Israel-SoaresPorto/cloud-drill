import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import QuizHeader from "@/features/quiz/components/quiz-header"

describe("QuizHeader", () => {
  test("renderiza informações e aciona botões", () => {
    const onFinish = vi.fn()
    const onExit = vi.fn()

    render(
      <QuizHeader
        certificationLabel="Cloud Certified Practitioner"
        currentQuestion={2}
        totalQuestions={10}
        timerLabel="08:30"
        onFinish={onFinish}
        onExit={onExit}
      />
    )

    expect(screen.getByText("Cloud Certified Practitioner")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText("10")).toBeInTheDocument()
    expect(screen.getByText("08:30")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Sair" }))
    fireEvent.click(screen.getByRole("button", { name: "Finalizar" }))

    expect(onExit).toHaveBeenCalledTimes(1)
    expect(onFinish).toHaveBeenCalledTimes(1)
  })
})
