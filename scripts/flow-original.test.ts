import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const originalDir = path.join(root, "docs/reference/react-flow-ui-original")
const flowDir = path.join(root, "src/components/flow")

const palette =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black"
const colorToken =
  "border-border|bg-muted|bg-card(?:/50)?|border-info(?:/\\d+)?|bg-info(?:/\\d+)?|text-info|border-success|border-destructive|border-muted-foreground|text-muted-foreground|bg-border|transparent"
const shadowToken = "(?:[\\w[\\]%.+-]+:)*shadow-(?!none\\b)[\\w./[\\]-]+"
const copyNames =
  /placeholder|emptyLabel|groupLabel|fitLabel|selectedLabel|idleLabel|labels|label = "Nút"|label\?: string|Không có kết quả|Tìm node|Thu phóng|Vừa khung|Đã chọn|Chưa chọn|Chưa có thay đổi|Kiểm tra node|Nhật ký|No results found|heading="Nodes"|CommandEmpty|Best Fit|Omit<PanelProps|No Changes Triggered|NoChanges|ChangeLogger|NodeInspector|DevTools = \(|Node Inspector|Change Logger|Viewport Logger|"Selected"|Not Selected|\{label\}|inspector\?:|changes\?:|viewport\?:|selected\?:|idle\?:|empty\?:|limit = 20|PlaceholderNode|children,|node\.data, label|id, label,|setEdges, setNodes|nodeInspectorActive/

function normalize(line: string) {
  return line
    .replace(new RegExp(shadowToken, "g"), "")
    .replace(new RegExp(`(?:bg|text|border|fill|stroke)-(?:${palette})(?:-\\d{2,3})?(?:/\\d+)?`, "g"), "COLOR")
    .replace(/bg-opacity-\d+/g, "")
    .replace(/#[0-9A-Fa-f]{3,8}\b/g, "COLOR")
    .replace(/rgba?\([^)]*\)/g, "COLOR")
    .replace(/var\(--[A-Za-z0-9-]+\)/g, "COLOR")
    .replace(new RegExp(colorToken, "g"), "COLOR")
    .replace(/[ \t]+/g, " ")
    .replace(/ +"/g, '"')
    .trim()
}

function punctuationOnly(line: string) {
  return line.trim().length > 0 && /^[\s{}()[\].,:;<>/=&|"'`?-]*$/.test(line)
}

function shadowOnly(line: string) {
  const stripped = line.replace(new RegExp(shadowToken, "g"), "").replace(/["',]/g, "").trim()
  return stripped.length === 0
}

function importChange(before: string, after: string) {
  const from = /from\s+["']([^"']+)["']/
  const left = before.match(from)
  const right = after.match(from)
  if (!left || !right) return false
  const expected = left[1].replace("@/components/", "@/components/flow/")
  return right[1] === expected && before.replace(left[1], right[1]) === after
}

function copyChange(line: string) {
  return copyNames.test(line)
}

// React 19 từ chối snapshot mới mỗi lần của useOptionsStore. Zoom select giữ cùng danh sách mức zoom, nhưng tính ngoài selector.
const react19Snapshot = new Set([
  'import React, { useCallback } from "react";',
  'import { useCallback, useMemo } from "react";',
  "  const zoomLevels = useOptionsStore((state) => {",
  "    const { minZoom, maxZoom } = state;",
  "  const minZoom = useOptionsStore((state) => state.minZoom);",
  "  const maxZoom = useOptionsStore((state) => state.maxZoom);",
  "  const zoomLevels = useMemo(() => {",
  "  }, [minZoom, maxZoom]);",
])

function fragmentOf(line: string, others: string[]) {
  const text = line.trim()
  return text.length >= 12 && others.some((other) => other.includes(text))
}

function withoutUnusedReact(line: string) {
  return line.replace(/\bReact, /, "").replace(/^import React from "react";$/, "")
}

function linesOf(source: string) {
  return source.replace(/\n$/, "").split("\n")
}

function changedLines(before: string, after: string) {
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
    } else if (score[i + 1][j] >= score[i][j + 1]) {
      removed.push(left[i])
      i += 1
    } else {
      added.push(right[j])
      j += 1
    }
  }
  while (i < n) removed.push(left[i++])
  while (j < m) added.push(right[j++])
  return { removed, added }
}

function explains(before: string, after: string) {
  return normalize(before) === normalize(after) || importChange(before, after) || withoutUnusedReact(before) === after || radiusFix(before, after) || spinName(before, after)
}

function spinName(before: string, after: string) {
  return before.replaceAll("spin", "SPIN") === after.replaceAll("rf-status-spin", "SPIN").replaceAll("spin", "SPIN")
}

// Bản gốc bo 9px. Bo của kit là --radius-md (6px). 9px để lại vai vuông ở góc node.
function radiusFix(before: string, after: string) {
  return before.replaceAll("rounded-[9px]", "RADIUS") === after.replaceAll("rounded-[calc(var(--radius-md)+1px)]", "RADIUS")
}

describe("flow giữ bản gốc React Flow UI", () => {
  const files = readdirSync(originalDir).filter((name) => name.endsWith(".tsx"))

  it("mọi file gốc có bản trong kit", () => {
    expect(files.length).toBe(17)
  })

  for (const name of files) {
    it(name, () => {
      const before = readFileSync(path.join(originalDir, name), "utf8")
      const after = readFileSync(path.join(flowDir, name), "utf8")
      const { removed, added } = changedLines(before, after)
      const snapshot = name === "zoom-select.tsx" ? (line: string) => react19Snapshot.has(line) : () => false
      const blocked = [
        ...removed.filter((line) => !(snapshot(line) || shadowOnly(line) || punctuationOnly(line) || line.trim() === 'import React from "react";' || copyChange(line) || fragmentOf(line, added) || added.some((next) => explains(line, next)))).map((line) => `- ${line}`),
        ...added.filter((line) => !(snapshot(line) || copyChange(line) || punctuationOnly(line) || fragmentOf(line, removed) || removed.some((prev) => explains(prev, line)))).map((line) => `+ ${line}`),
      ]
      expect(blocked, blocked.join("\n")).toEqual([])
    })
  }
})
