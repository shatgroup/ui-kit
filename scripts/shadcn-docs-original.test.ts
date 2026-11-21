import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { adapt } from "./adapt-docs-example.mjs"

const root = process.cwd()
const originalDir = path.join(root, "docs/reference/shadcn-docs-original/examples")
const adaptedDir = path.join(root, "src/showcase/shadcn-docs/examples")

function changedCount(before: string, after: string) {
  const left = before.replace(/\n$/, "").split("\n")
  const right = after.replace(/\n$/, "").split("\n")
  const n = left.length
  const m = right.length
  const score: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      score[i][j] = left[i] === right[j] ? score[i + 1][j + 1] + 1 : Math.max(score[i + 1][j], score[i][j + 1])
    }
  }
  let removed = 0
  let added = 0
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (left[i] === right[j]) {
      i += 1
      j += 1
    } else if (score[i + 1][j] >= score[i][j + 1]) {
      removed += 1
      i += 1
    } else {
      added += 1
      j += 1
    }
  }
  return removed + added + (n - i) + (m - j)
}

describe("ví dụ shadcn giữ bản gốc", () => {
  const files = readdirSync(adaptedDir).filter((name) => name.endsWith(".tsx"))

  it("mọi file đã chép còn bản gốc để đối chiếu", () => {
    expect(files.length).toBeGreaterThan(0)
    for (const name of files) {
      expect(readFileSync(path.join(originalDir, name), "utf8").length).toBeGreaterThan(0)
    }
  })

  for (const name of files) {
    it(name, () => {
      const before = readFileSync(path.join(originalDir, name), "utf8")
      const after = readFileSync(path.join(adaptedDir, name), "utf8")
      // Kit không có language-selector. Ví dụ này gắn dir="rtl" và nhãn tiếng Ả Rập.
      if (name === "scroll-area-rtl.tsx") {
        expect(after).toContain('dir="rtl"')
        expect(after).not.toContain("language-selector")
        return
      }
      expect(after, `${changedCount(before, after)} dòng khác`).toBe(adapt(before))
    })
  }
})
