import { describe, expect, test } from "vitest"
import { cn, formatTimerLabel } from "@/lib/utils"

describe("utils", () => {
  describe("cn", () => {
    test("cn combina classes corretamente", () => {
      const condition = false

      expect(cn("class1", "class2")).toBe("class1 class2")
      expect(cn("class1", condition && "class2", "class3")).toBe(
        "class1 class3"
      )
      expect(cn("class1", null, "class3")).toBe("class1 class3")
      expect(cn("class1", undefined, "class3")).toBe("class1 class3")
    })
  })

  describe("formatTimerLabel", () => {
    test("formatTimerLabel retorna placeholder para valores invalidos", () => {
      expect(formatTimerLabel(null)).toBe("00s")
      expect(formatTimerLabel(undefined)).toBe("00s")
      expect(formatTimerLabel(Number.NaN)).toBe("00s")
    })

    test("formatTimerLabel formata apenas segundos", () => {
      expect(formatTimerLabel(0)).toBe("0s")
      expect(formatTimerLabel(5)).toBe("5s")
      expect(formatTimerLabel(59)).toBe("59s")
    })

    test("formatTimerLabel formata minutos e segundos", () => {
      expect(formatTimerLabel(60)).toBe("1m")
      expect(formatTimerLabel(65)).toBe("1m 5s")
      expect(formatTimerLabel(3599)).toBe("59m 59s")
    })

    test("formatTimerLabel formata horas, minutos e segundos", () => {
      expect(formatTimerLabel(3600)).toBe("1h")
      expect(formatTimerLabel(3605)).toBe("1h 5s")
      expect(formatTimerLabel(3665)).toBe("1h 1m 5s")
    })

    test("formatTimerLabel limita valores negativos em 00s", () => {
      expect(formatTimerLabel(-10)).toBe("00s")
    })
  })
})
