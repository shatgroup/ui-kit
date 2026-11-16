import { describe, expect, it } from "vitest"
import { cn } from "./utils.ts"

describe("cn", () => {
  it("giữ cỡ chữ và màu token", () => {
    expect(cn("text-sm text-primary-text")).toBe("text-sm text-primary-text")
  })

  it("cỡ chữ sau thắng cỡ chữ trước", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })

  it("màu token sau thắng màu token trước", () => {
    expect(cn("text-muted-foreground", "text-primary-text")).toBe("text-primary-text")
  })

  it("đổi cỡ chữ không xoá màu token", () => {
    expect(cn("text-base text-success", "text-xs")).toBe("text-success text-xs")
  })

  it("chiều cao control sau thắng chiều cao trước", () => {
    expect(cn("h-control-sm", "h-control-md")).toBe("h-control-md")
  })

  it("nền sau thắng nền trước", () => {
    expect(cn("bg-card", "bg-muted")).toBe("bg-muted")
  })
})
