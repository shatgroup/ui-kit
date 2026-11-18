import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { ReadingText } from "./reading-text.tsx"

const sentences = [
  { id: "field", text: "The field was split in two." },
  { id: "line", text: "“This half is yours,” she said.", kind: "speech" as const },
  { id: "well", text: "Who keeps the well?", kind: "question" as const },
]

describe("ReadingText", () => {
  it("đọc liền, thoại nghiêng, câu hỏi đậm, câu đang chọn", () => {
    const html = renderToStaticMarkup(createElement(ReadingText, {
      sentences,
      selectedId: "line",
      onSelect: () => undefined,
    }))
    expect(html.startsWith("<p")).toBe(true)
    expect(html.indexOf("The field was split in two.")).toBeLessThan(html.indexOf("This half is yours"))
    expect(html.indexOf("This half is yours")).toBeLessThan(html.indexOf("Who keeps the well?"))
    expect(html).toContain("italic")
    expect(html).toContain("font-bold")
    expect(html).toContain('aria-pressed="true"')
    expect(html).toContain('data-state="selected"')
    expect(html).toContain("bg-accent")
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(2)
  })
})
