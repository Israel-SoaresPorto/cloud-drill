import { render } from "@testing-library/react"
import { describe, expect, test } from "vitest"
import CircularProgress from "@/components/circular-progress"

describe("CircularProgress", () => {
  test("renderiza SVG com dimensões corretas para tamanho lg", () => {
    const { container } = render(<CircularProgress value={50} />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("width", "150")
    expect(svg).toHaveAttribute("height", "150")
  })

  test("renderiza SVG com dimensões corretas para tamanho md", () => {
    const { container } = render(<CircularProgress value={50} size="md" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("width", "120")
    expect(svg).toHaveAttribute("height", "120")
  })

  test("renderiza SVG com dimensões corretas para tamanho sm", () => {
    const { container } = render(<CircularProgress value={50} size="sm" />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("width", "100")
    expect(svg).toHaveAttribute("height", "100")
  })

  test("calcula a porcentagem corretamente com max padrão", () => {
    const { container } = render(<CircularProgress value={50} />)
    const progressCircle = container.querySelectorAll("circle")[1]
    const radius = (150 - 8) / 2
    const circumference = radius * 2 * Math.PI
    const expectedOffset = circumference - (50 / 100) * circumference

    expect(progressCircle).toHaveAttribute(
      "stroke-dashoffset",
      String(expectedOffset)
    )
  })

  test("limita a porcentagem a 0 quando value é negativo", () => {
    const { container } = render(<CircularProgress value={-10} max={100} />)
    const progressCircle = container.querySelectorAll("circle")[1]
    const radius = (150 - 8) / 2
    const circumference = radius * 2 * Math.PI
    expect(progressCircle).toHaveAttribute(
      "stroke-dashoffset",
      String(circumference)
    )
  })

  test("limita a porcentagem a 100 quando value excede max", () => {
    const { container } = render(<CircularProgress value={150} max={100} />)
    const progressCircle = container.querySelectorAll("circle")[1]
    const radius = (150 - 8) / 2
    const circumference = radius * 2 * Math.PI
    const expectedOffset = circumference - (100 / 100) * circumference
    expect(progressCircle).toHaveAttribute(
      "stroke-dashoffset",
      String(expectedOffset)
    )
  })

  test("retorna cor verde quando porcentagem >= 70", () => {
    const { container } = render(<CircularProgress value={70} />)
    const progressCircle = container.querySelectorAll("circle")[1]
    expect(progressCircle).toHaveAttribute("stroke", "#22c55e")
  })

  test("retorna cor amarela quando porcentagem entre 40 e 69", () => {
    const { container } = render(<CircularProgress value={50} />)
    const progressCircle = container.querySelectorAll("circle")[1]
    expect(progressCircle).toHaveAttribute("stroke", "#eab308")
  })

  test("retorna cor vermelha quando porcentagem < 40", () => {
    const { container } = render(<CircularProgress value={30} />)
    const progressCircle = container.querySelectorAll("circle")[1]
    expect(progressCircle).toHaveAttribute("stroke", "#ef4444")
  })

  test("renderiza círculos de fundo e de progresso", () => {
    const { container } = render(<CircularProgress value={50} />)
    const circles = container.querySelectorAll("circle")
    expect(circles).toHaveLength(2)
    expect(circles[0]).toHaveClass("text-muted/50")
    expect(circles[1]).toHaveClass("transition-all", "duration-500")
  })

  test("aplica className customizado ao container", () => {
    const { container } = render(
      <CircularProgress value={50} className="custom-class" />
    )
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass("relative", "custom-class")
  })

  test("renderiza label quando prop renderLabel é fornecida", () => {
    const { container } = render(
      <CircularProgress
        value={75}
        renderLabel={(_percent, value, max) => (
          <div data-testid="label">
            {value}/{max}
          </div>
        )}
      />
    )
    const label = container.querySelector("[data-testid='label']")
    expect(label).toBeInTheDocument()
    expect(label).toHaveTextContent("75/100")
  })

  test("passa parâmetros corretos para o callback renderLabel", () => {
    let capturedArgs = { percent: 0, value: 0, max: 0 }
    render(
      <CircularProgress
        value={60}
        max={80}
        renderLabel={(percent, value, max) => {
          capturedArgs = {
            percent: percent || 0,
            value: value || 0,
            max: max || 0,
          }
          return null
        }}
      />
    )
    expect(capturedArgs.value).toBe(60)
    expect(capturedArgs.max).toBe(80)
    expect(capturedArgs.percent).toBe(75)
  })

  test("não renderiza label quando prop renderLabel não é fornecida", () => {
    const { container } = render(<CircularProgress value={50} />)
    const labelContainer = container.querySelector(".absolute.inset-0")
    expect(labelContainer).not.toBeInTheDocument()
  })

  test("renderiza com larguras de stroke corretas para diferentes tamanhos", () => {
    const { container: smContainer } = render(
      <CircularProgress value={50} size="sm" />
    )
    const smCircles = smContainer.querySelectorAll("circle")
    expect(smCircles[0]).toHaveAttribute("stroke-width", "4")

    const { container: mdContainer } = render(
      <CircularProgress value={50} size="md" />
    )
    const mdCircles = mdContainer.querySelectorAll("circle")
    expect(mdCircles[0]).toHaveAttribute("stroke-width", "6")

    const { container: lgContainer } = render(
      <CircularProgress value={50} size="lg" />
    )
    const lgCircles = lgContainer.querySelectorAll("circle")
    expect(lgCircles[0]).toHaveAttribute("stroke-width", "8")
  })

  test("aplica transform -rotate-90 ao SVG", () => {
    const { container } = render(<CircularProgress value={50} />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveClass("-rotate-90", "transform")
  })
})
