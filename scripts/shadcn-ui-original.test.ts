import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const originalDir = path.join(root, "docs/reference/shadcn-ui-original")
const uiDir = path.join(root, "src/components/ui")
const palette = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black"
const colorClass = new RegExp(`(?:bg|text|border|fill|stroke|from|to|via|ring|outline|decoration|divide|accent|caret)-(?:${palette})(?:-\\d{2,3})?(?:/\\d+)?`, "g")
const tokenClass = /(?:bg|text|border|fill|stroke|from|to|via|ring|outline|decoration|divide|accent|caret)-(?:background|foreground|card|popover|primary|secondary|muted|accent|destructive|border|input|ring|sidebar|chart|badge|info|success|warning)(?:-[\w-]+)?(?:\/\d+)?/g

function stripShadow(text: string) {
  let next = text
    .replaceAll("shadow-[0_0_0_1px_var(--sidebar-border)]", "border border-sidebar-border")
    .replaceAll("hover:shadow-[0_0_0_1px_var(--sidebar-accent)]", "hover:border-sidebar-accent")
  let out = ""
  let i = 0
  while (i < next.length) {
    const at = next.indexOf("shadow-", i)
    if (at < 0) {
      out += next.slice(i)
      break
    }
    const none = "shadow-none"
    if (next.startsWith(none, at) && !/[\w-]/.test(next[at + none.length] ?? " ")) {
      out += next.slice(i, at + none.length)
      i = at + none.length
      continue
    }
    let start = at
    while (start > 0 && !/\s/.test(next[start - 1] ?? "") && next[start - 1] !== '"' && next[start - 1] !== "'" && next[start - 1] !== "`") start -= 1
    let end = at + "shadow-".length
    while (end < next.length && !/\s/.test(next[end] ?? "") && next[end] !== '"' && next[end] !== "'" && next[end] !== "`") end += 1
    if (start > 0 && next[start - 1] === " ") start -= 1
    out += next.slice(i, start)
    i = end
  }
  return out
}

function adapt(text: string) {
  let next = text.replace(/from (["'])@\/registry\/new-york-v4\/ui\/([^"']+)\1/g, (_match, quote: string, name: string) => `from ${quote}@/components/ui/${name}.tsx${quote}`)
  next = next.replace(/from (["'])@\/registry\/new-york-v4\/hooks\/([^"']+)\1/g, (_match, quote: string, name: string) => `from ${quote}@/hooks/${name}.ts${quote}`)
  next = next.replace(/from (["'])@\/lib\/utils\1/g, (_match, quote: string) => `from ${quote}@/lib/utils.ts${quote}`)
  return stripShadow(next)
}

function colorNorm(line: string) {
  return line
    .replace(colorClass, "COLOR")
    .replace(/#[0-9A-Fa-f]{3,8}\b/g, "COLOR")
    .replace(/rgba?\([^)]*\)/g, "COLOR")
    .replace(/hsla?\([^)]*\)/g, "COLOR")
    .replace(/var\(--[A-Za-z0-9-]+\)/g, "COLOR")
    .replace(tokenClass, "COLOR")
    .replace(/[ \t]+/g, " ")
    .trim()
}

function linesOf(source: string) {
  return source.replace(/\n$/, "").split("\n")
}

function otherLines(before: string, after: string) {
  const left = linesOf(before)
  const right = linesOf(after)
  const n = left.length
  const m = right.length
  const score: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      score[i][j] = left[i] === right[j] ? score[i + 1][j + 1] + 1 : Math.max(score[i + 1][j], score[i][j + 1])
    }
  }
  const removed: string[] = []
  const added: string[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (left[i] === right[j]) {
      i += 1
      j += 1
    } else if (score[i + 1][j] >= score[i][j + 1]) removed.push(left[i++])
    else added.push(right[j++])
  }
  while (i < n) removed.push(left[i++])
  while (j < m) added.push(right[j++])
  const used = new Set<number>()
  const other: string[] = []
  for (const line of removed) {
    const hit = added.findIndex((item, index) => !used.has(index) && colorNorm(line) === colorNorm(item))
    if (hit >= 0) used.add(hit)
    else other.push(`- ${line}`)
  }
  added.forEach((line, index) => {
    if (!used.has(index)) other.push(`+ ${line}`)
  })
  return other
}

describe("src/components/ui giữ bản gốc shadcn", () => {
  const files = readdirSync(originalDir).filter((name) => name.endsWith(".tsx")).sort()

  it("có bản gốc để đối chiếu", () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const name of files) {
    it(name, () => {
      const original = readFileSync(path.join(originalDir, name), "utf8")
      const current = readFileSync(path.join(uiDir, name), "utf8")
      const other = otherLines(adapt(original), current)
      expect(other, other.slice(0, 12).join("\n")).toEqual([])
    })
  }
})
