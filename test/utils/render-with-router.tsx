import { render } from "@testing-library/react"
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from "react-router"

export default function renderWithRouter(routes: RouteObject[], initialPath = "/") {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  })
  return render(<RouterProvider router={router} />)
}
