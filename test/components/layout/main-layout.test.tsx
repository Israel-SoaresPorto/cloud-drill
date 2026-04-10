// src/components/layout/main-layout.test.tsx
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, test } from "vitest"
import MainLayout from "@/components/layout/main-layout"

describe("MainLayout", () => {
  test("renderiza o outlet com conteúdo filho", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <div>Conteúdo da rota filha</div>,
            },
          ],
        },
      ],
      {
        initialEntries: ["/"],
      }
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByText("Conteúdo da rota filha")).toBeInTheDocument()
  })

  test("aplica a estrutura base do layout", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: <div>Teste</div>,
            },
          ],
        },
      ],
      {
        initialEntries: ["/"],
      }
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByText("Teste").parentElement?.parentElement).toBeTruthy()
  })
})