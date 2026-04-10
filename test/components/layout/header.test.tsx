// src/components/layout/header.test.tsx
import { fireEvent, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { describe, expect, test, vi, beforeEach } from "vitest"
import Header from "@/components/layout/header"
import { useTheme } from "@/components/theme-provider"
import renderWithRouter from "../../utils/render-with-router"

vi.mock("@/components/theme-provider", () => ({
  useTheme: vi.fn(),
}))

const mockedUseTheme = vi.mocked(useTheme)

function renderHeader(theme: "dark" | "light") {
  const setTheme = vi.fn()

  mockedUseTheme.mockReturnValue({
    theme,
    setTheme,
  } as never)

  renderWithRouter([
    {
      path: "/",
      element: <Header />,
    },
  ])

  return { setTheme }
}

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renderiza o branding e o link para a home", () => {
    renderHeader("dark")

    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /CloudDrill/i })).toHaveAttribute(
      "href",
      "/"
    )
    expect(screen.getByText("CloudDrill")).toBeInTheDocument()
  })

  test("mostra o botão de alternância para tema claro quando está no tema escuro", () => {
    renderHeader("dark")

    expect(
      screen.getByRole("button", { name: /Alternar para tema claro/i })
    ).toBeInTheDocument()
  })

  test("chama setTheme('light') ao clicar no botão quando está no tema escuro", () => {
    const { setTheme } = renderHeader("dark")

    fireEvent.click(
      screen.getByRole("button", { name: /Alternar para tema claro/i })
    )

    expect(setTheme).toHaveBeenCalledTimes(1)
    expect(setTheme).toHaveBeenCalledWith("light")
  })

  test("mostra o botão de alternância para tema escuro quando está no tema claro", () => {
    renderHeader("light")

    expect(
      screen.getByRole("button", { name: /Alternar para tema escuro/i })
    ).toBeInTheDocument()
  })

  test("chama setTheme('dark') ao clicar no botão quando está no tema claro", () => {
    const { setTheme } = renderHeader("light")

    fireEvent.click(
      screen.getByRole("button", { name: /Alternar para tema escuro/i })
    )

    expect(setTheme).toHaveBeenCalledTimes(1)
    expect(setTheme).toHaveBeenCalledWith("dark")
  })
})
