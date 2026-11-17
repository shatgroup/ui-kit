import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { ProgressCircle } from "./progress-circle.tsx"
import { ProgressSegments } from "./progress-segments.tsx"
import { StepsBar } from "./steps-bar.tsx"

describe("progress kit", () => {
  it("tô đúng số đoạn đầu", () => {
    const html = renderToStaticMarkup(createElement(ProgressSegments, { value: 2, max: 6 }))
    expect(html).toContain('aria-valuenow="2"')
    expect(html.match(/data-filled="true"/g)).toHaveLength(2)
    expect(html.match(/data-filled="false"/g)).toHaveLength(4)
  })

  it("vòng tròn hiện chữ giữa và giá trị", () => {
    const html = renderToStaticMarkup(createElement(ProgressCircle, { value: 2, max: 5 }, "2 of 5"))
    expect(html).toContain('aria-valuenow="2"')
    expect(html).toContain('aria-valuemax="5"')
    expect(html).toContain("2 of 5")
  })

  it("thanh mũi tên đánh dấu bước xong và bước đang làm", () => {
    const html = renderToStaticMarkup(createElement(StepsBar, {
      steps: [
        { label: "Step 1", status: "done" },
        { label: "Step 2", status: "current" },
        { label: "Step 3", status: "todo" },
      ],
    }))
    expect(html).toContain('data-status="done"')
    expect(html).toContain('aria-current="step"')
    expect(html).toContain("Step 1")
    expect(html).toContain("Step 3")
    expect(html.indexOf("Step 1")).toBeLessThan(html.indexOf("Step 2"))
    expect(html.indexOf("Step 2")).toBeLessThan(html.indexOf("Step 3"))
  })
})
