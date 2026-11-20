import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import catalog from "../src/showcase/shadcn-docs/catalog.json"

const root = process.cwd()
const contentDir = path.join(root, "docs/reference/shadcn-docs-original/content")
const originalDir = path.join(root, "docs/reference/shadcn-docs-original/examples")
const indexSource = readFileSync(path.join(root, "src/showcase/shadcn-docs/examples/index.ts"), "utf8")

type Page = { name: string; blocks: { type: string; name?: string }[] }

function previewTags(mdx: string) {
  const tags: { name: string; direction?: string }[] = []
  let cursor = 0
  while (cursor < mdx.length) {
    const start = mdx.indexOf("<ComponentPreview", cursor)
    if (start < 0) break
    let quote = ""
    let end = start + "<ComponentPreview".length
    for (; end < mdx.length; end += 1) {
      const char = mdx[end] ?? ""
      if (quote) {
        if (char === quote) quote = ""
        continue
      }
      if (char === "\"" || char === "'") {
        quote = char
        continue
      }
      if (char === "/" && mdx[end + 1] === ">") {
        end += 2
        break
      }
      if (char === ">") {
        end += 1
        break
      }
    }
    const raw = mdx.slice(start, end)
    const name = raw.match(/\bname="([^"]+)"/)?.[1]
    if (name) tags.push({ name, direction: raw.match(/\bdirection="([^"]+)"/)?.[1] })
    cursor = end
  }
  return tags
}

function skipped(tag: { name: string; direction?: string }, source: string) {
  if (tag.direction === "rtl" || tag.name.endsWith("-rtl")) return true
  if (/next\/image|next\/font/.test(source)) return true
  if (/@tabler\/icons-react/.test(source)) return true
  if (/react-day-picker\/locale/.test(source)) return true
  return false
}

describe("trang /components đủ ví dụ docs", () => {
  const pages = (catalog as { pages: Page[] }).pages

  it("đủ bản gốc mdx cho 62 trang", () => {
    const files = readdirSync(contentDir).filter((name) => name.endsWith(".mdx"))
    expect(files.length).toBe(62)
    for (const page of pages) {
      expect(existsSync(path.join(contentDir, `${page.name}.mdx`)), page.name).toBe(true)
    }
  })

  it("mỗi trang có đủ khung xem trước", () => {
    const problems: string[] = []
    for (const page of pages) {
      const mdx = readFileSync(path.join(contentDir, `${page.name}.mdx`), "utf8")
      const wanted: string[] = []
      for (const tag of previewTags(mdx)) {
        const file = path.join(originalDir, `${tag.name}.tsx`)
        const source = existsSync(file) ? readFileSync(file, "utf8") : ""
        if (!source) {
          problems.push(`${page.name}: thiếu file gốc ${tag.name}`)
          continue
        }
        if (!skipped(tag, source)) wanted.push(tag.name)
      }
      const shown = page.blocks.filter((block) => block.type === "preview").map((block) => block.name ?? "")
      if (shown.join("\n") !== wanted.join("\n")) {
        problems.push(`${page.name}: có ${shown.length}, cần ${wanted.length}\ncó: ${shown.join(", ")}\ncần: ${wanted.join(", ")}`)
      }
      for (const name of shown) {
        if (!indexSource.includes(`"${name}":`)) problems.push(`${page.name}: ${name} không có trong examples`)
        if (!existsSync(path.join(root, "src/showcase/shadcn-docs/examples", `${name}.tsx`))) {
          problems.push(`${page.name}: thiếu ${name}.tsx`)
        }
      }
    }
    expect(problems, problems.join("\n")).toEqual([])
  })
})
