import { describe, expect, test } from "bun:test"
import { cn } from "../utils"

describe("cn utility", () => {
  test("merges class names correctly", () => {
    const result = cn("base-class", "additional-class")
    expect(result).toBe("base-class additional-class")
  })

  test("handles conditional classes", () => {
    const isActive = true
    const result = cn("base", isActive && "active")
    expect(result).toBe("base active")
  })

  test("filters out falsy values", () => {
    const result = cn("base", false, null, undefined, "valid")
    expect(result).toBe("base valid")
  })

  test("merges Tailwind classes correctly", () => {
    const result = cn("px-4 py-2", "px-6")
    expect(result).toBe("py-2 px-6")
  })

  test("handles empty input", () => {
    const result = cn()
    expect(result).toBe("")
  })

  test("handles array input", () => {
    const result = cn(["class1", "class2"])
    expect(result).toBe("class1 class2")
  })

  test("handles object input for conditional classes", () => {
    const result = cn({
      "always-on": true,
      "conditionally-off": false,
    })
    expect(result).toBe("always-on")
  })
})
