import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import catalog from "../src/showcase/shadcn-docs/catalog.json"
import { localGroups, localPages } from "../src/showcase/shadcn-docs/local-docs.tsx"

const root = join(import.meta.dirname, "..")

const deleted = [
  "empty-state",
  "form-field",
  "checkbox-field",
  "radio-field",
  "switch-field",
  "input-affix",
  "kit-sidebar",
  "alert-banner",
  "button-state",
  "input-state",
  "checkbox-mark",
  "slider-tip",
  "split-pane",
  "stepper",
]

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return filesUnder(path)
    return [path]
  })
}

describe("trang component", () => {
  it("mỗi nhóm có đủ trang", () => {
    const counts = Object.fromEntries(localGroups.map((group) => [group.name, group.pages.length]))
    expect(counts).toEqual({ Kit: 15, Flow: 20, Patterns: 8 })
    expect(new Set(localPages.map((page) => page.name)).size).toBe(localPages.length)
  })

  it("mọi file component của kit, flow và pattern có trang", () => {
    const pageNames = new Set([
      ...catalog.pages.map((page) => page.name),
      ...localPages.map((page) => page.name),
    ])
    const kitFiles = [
      "number-input",
      "password-input",
      "tags-input",
      "date-input",
      "status-badge",
      "progress-circle",
      "progress-segments",
      "steps-bar",
      "truncated",
      "theme-toggle",
      "audio-player",
      "media-preview",
      "dropzone",
      "job-status",
      "meter",
    ]
    const flowFiles = readdirSync(join(root, "src/components/flow"))
      .filter((name) => name.endsWith(".tsx"))
      .map((name) => name.replace(/\.tsx$/, ""))
    const patternFiles = [
      "app-shell",
      "data-table",
      "filter-bar",
      "form-layout",
      "page-header",
      "stat-card",
      "status-timeline",
      "ticker",
    ]
    const missing = [...kitFiles, ...flowFiles, ...patternFiles].filter((name) => !pageNames.has(name))
    expect(missing).toEqual([])
    const uiFiles = readdirSync(join(root, "src/components/ui")).filter((name) => name.endsWith(".tsx") && name !== "progress-kit.test.tsx")
    const shadcnWithoutPage = new Set(["form", "combobox", "responsive-dialog"])
    const uiMissing = uiFiles
      .map((name) => name.replace(/\.tsx$/, ""))
      .filter((name) => !shadcnWithoutPage.has(name) && !pageNames.has(name))
    expect(uiMissing).toEqual([])
    const mediaFiles = readdirSync(join(root, "src/components/media"))
      .filter((name) => name.endsWith(".tsx"))
      .map((name) => name.replace(/\.tsx$/, ""))
    expect(mediaFiles.filter((name) => !pageNames.has(name))).toEqual([])
    for (const name of kitFiles) {
      const ui = join(root, "src/components/ui", `${name}.tsx`)
      const media = join(root, "src/components/media", `${name}.tsx`)
      expect(existsSync(ui) || existsSync(media)).toBe(true)
    }
  })

  it("không còn import tới file đã xoá", () => {
    const hits: string[] = []
    for (const file of filesUnder(join(root, "src"))) {
      if (!/\.(tsx|ts)$/.test(file)) continue
      const text = readFileSync(file, "utf8")
      for (const line of text.split("\n")) {
        if (!line.includes("import") && !line.includes("from")) continue
        for (const name of deleted) {
          if (line.includes(`/${name}`) || line.includes(`/${name}.tsx`)) hits.push(`${file}: ${line.trim()}`)
        }
      }
    }
    expect(hits).toEqual([])
    expect(filesUnder(join(root, "src")).some((file) => file.endsWith("kit-gallery-page.tsx"))).toBe(false)
  })

  it("catalog không còn tên đã xoá", () => {
    const names = [...catalog.kit, ...catalog.flow, ...catalog.patterns]
    for (const name of deleted) expect(names).not.toContain(name)
    expect(names).not.toContain("kit-gallery")
  })
})
