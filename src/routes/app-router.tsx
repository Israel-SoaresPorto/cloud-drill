import { Navigate, createBrowserRouter } from "react-router"
import HomeRoute from "./home-route"
import MainLayout from "@/components/layout/main-layout"

export const appRouter = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])
