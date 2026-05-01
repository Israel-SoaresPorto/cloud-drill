import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useQuizStore } from "../stores/quiz.store"
import { formatTimerLabel } from "@/lib/utils"

export function useQuizTimer() {
  const navigate = useNavigate()
  const session = useQuizStore((state) => state.session)
  const sessionExpired = useQuizStore((state) => state.sessionExpired)
  const timeRemaining = useQuizStore((state) => state.timeRemaining)

  useEffect(() => {
    // Proteção: não iniciar intervalo se não houver sessão ou se já tiver expirado
    if (!session || sessionExpired) return
    
    // Para sessões de prática, o timer não deve ser iniciado
    if (session.mode === "practice") return

    const interval = setInterval(() => {
      const state = useQuizStore.getState()

      // Proteção contra race condition: verify state again
      if (!state.session || state.sessionExpired) {
        clearInterval(interval)
        return
      }

      state.tickTimer()

      // Após tickTimer, verificar se tempo expirou
      const newState = useQuizStore.getState()
      if (newState.sessionExpired && newState.session?.mode === "simulated") {
        clearInterval(interval)
        newState.endSession(true)
        navigate("/resultado", { replace: true })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [session, sessionExpired, navigate])

  return {
    timeRemaining,
    isExpired: sessionExpired,
    displayTime: formatTimerLabel(timeRemaining ?? session?.timeLimit),
  }
}
