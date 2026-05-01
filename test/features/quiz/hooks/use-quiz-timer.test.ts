import { describe, expect, test, beforeEach, afterEach, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import { useQuizTimer } from "@/features/quiz/hooks/use-quiz-timer"
import { useQuizStore } from "@/features/quiz/stores/quiz.store"
import { useNavigate } from "react-router"
import { createQuizSession } from "../../../utils/quiz"

// Mock useNavigate para evitar erros de Router context
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router")
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

describe("useQuizTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useQuizStore.setState((state) => ({
      ...state,
      session: null,
      isRevealed: false,
      timeRemaining: null,
      sessionExpired: false,
    }))
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  test("retorna timeRemaining e isExpired corretos", () => {
    const session = createQuizSession()

    useQuizStore.setState((state) => ({
      ...state,
      session,
      timeRemaining: 100,
      sessionExpired: false,
    }))

    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    const { result, unmount } = renderHook(() => useQuizTimer())

    expect(result.current.timeRemaining).toBe(100)
    expect(result.current.isExpired).toBe(false)
    expect(result.current.displayTime).toBe("1m 40s")

    unmount()
  })

  test("inicia intervalo ao montar e chama tickTimer", () => {
    const session = createQuizSession()

    useQuizStore.setState((state) => ({
      ...state,
      session,
      timeRemaining: 100,
      sessionExpired: false,
    }))

    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    const tickTimerSpy = vi.spyOn(useQuizStore.getState(), "tickTimer")

    const { unmount } = renderHook(() => useQuizTimer())

    // Verificar que o intervalo foi criado e não chamou imediatamente
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(tickTimerSpy).not.toHaveBeenCalled()

    // Avançar 1 segundo
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(tickTimerSpy).toHaveBeenCalled()

    tickTimerSpy.mockRestore()

    unmount()
  })

  test("limpa intervalo ao desmontar", async () => {
    const session = createQuizSession()

    useQuizStore.setState((state) => ({
      ...state,
      session,
      timeRemaining: 100,
      sessionExpired: false,
    }))

    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    const { unmount } = renderHook(() => useQuizTimer())

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    unmount()

    const timeBeforeUnmount = useQuizStore.getState().timeRemaining

    vi.advanceTimersByTime(2000)

    // Após desmontar, o timeRemaining não deve mudar
    expect(useQuizStore.getState().timeRemaining).toBe(timeBeforeUnmount)
  })

  test("não executa intervalo se não houver sessão", async () => {
    useQuizStore.setState((state) => ({
      ...state,
      session: null,
      timeRemaining: null,
      sessionExpired: false,
    }))

    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    const { result } = renderHook(() => useQuizTimer())

    expect(result.current.timeRemaining).toBeNull()

    vi.advanceTimersByTime(2000)

    // Nada deve mudar se não houver sessão
    expect(result.current.timeRemaining).toBeNull()
  })

  test("não executa intervalo se sessionExpired for true", async () => {
    const session = createQuizSession()

    useQuizStore.setState((state) => ({
      ...state,
      session,
      timeRemaining: 100,
      sessionExpired: true,
    }))

    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    const { result } = renderHook(() => useQuizTimer())

    expect(result.current.isExpired).toBe(true)

    const timeBeforeAdvance = result.current.timeRemaining

    vi.advanceTimersByTime(2000)

    // Intervalo não deve executar
    expect(result.current.timeRemaining).toBe(timeBeforeAdvance)
  })

  test("navega para /resultado quando sessionExpired=true", async () => {
    // Arrange
    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    const mockSession = createQuizSession()

    useQuizStore.setState((state) => ({
      ...state,
      session: mockSession,
      timeRemaining: 1, // Configurar para expirar no próximo tick
      sessionExpired: false,
    }))

    // Act
    renderHook(() => useQuizTimer())

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith("/resultado", { replace: true })
  })

  test("não inicia intervalo em modo practice", () => {
    // Arrange
    vi.useFakeTimers()
    const mockSession = createQuizSession({ mode: "practice" })

    useQuizStore.setState({
      session: mockSession,
      timeRemaining: null,
      sessionExpired: false,
    })

    // Act
    const { unmount } = renderHook(() => useQuizTimer())

    // Assert - timeRemaining não deve mudar
    expect(useQuizStore.getState().timeRemaining).toBe(null)

    unmount()
  })
})
