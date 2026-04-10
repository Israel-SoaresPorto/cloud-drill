import { RouterProvider } from "react-router"
import { appRouter } from "@/routes/app-router"

export function App() {
  return <RouterProvider router={appRouter} />
}

export default App
