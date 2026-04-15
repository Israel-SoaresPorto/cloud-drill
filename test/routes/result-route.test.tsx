import { describe, expect, test } from "vitest"
import { fireEvent, screen } from "@testing-library/react"
import renderWithRouter from "../utils/render-with-router"
import ResultPage from "@/routes/result-route"
import { useResultStore } from "@/features/result/stores/result.store"
import { makeResult } from "../utils/result"

describe("ResultRoute", () => {
  const render = () => {
    renderWithRouter(
      [
        { path: "/", element: <div>Home</div> },
        { path: "/resultado", element: <ResultPage /> },
      ],
      "/resultado"
    )
  }

  test("redireciona para home quando não existe resultado", () => {
    useResultStore.setState((state) => ({
      ...state,
      result: null,
    }))

    render()

    expect(screen.getByText("Home")).toBeInTheDocument()
  })

  test("renderiza resultado persistido e permite voltar para home", () => {
    useResultStore.setState((state) => ({
      ...state,
      result: makeResult({
        score: 85,
        correctCount: 17,
        totalQuestions: 20,
        incorrectCount: 3,
      }),
    }))

    render()

    expect(screen.getByText("85%")).toBeInTheDocument()
    expect(screen.getByText("Desempenho por Domínio")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Voltar para Home" }))

    expect(screen.getByText("Home")).toBeInTheDocument()
  })
})
