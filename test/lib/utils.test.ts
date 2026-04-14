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
      expect(formatTimerLabel(null)).toBe("--:--")
      expect(formatTimerLabel(undefined)).toBe("--:--")
      expect(formatTimerLabel(Number.NaN)).toBe("--:--")
    })

    test("formatTimerLabel formata minutos e segundos com padding", () => {
      expect(formatTimerLabel(0)).toBe("00:00")
      expect(formatTimerLabel(5)).toBe("00:05")
      expect(formatTimerLabel(65)).toBe("01:05")
      expect(formatTimerLabel(3_661)).toBe("61:01")
    })

    test("formatTimerLabel limita valores negativos em 00:00", () => {
      expect(formatTimerLabel(-10)).toBe("00:00")
    })
  })
})
