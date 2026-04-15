import { Navigate, createBrowserRouter } from "react-router"
import HomeRoute from "./home-route"
import MainLayout from "@/components/layout/main-layout"
import QuizPage from "./quiz-route"
import ResultPage from "./result-route"

export const appRouter = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        element: <HomeRoute />,
      },
      {
        path: "quiz",
        element: <QuizPage />,
      },
      {
        path: "resultado",
        element: <ResultPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
])
