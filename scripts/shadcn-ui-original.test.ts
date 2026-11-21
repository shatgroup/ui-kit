import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { adaptUi } from "./adapt-radix-ui.mjs"

const root = process.cwd()
const originalDir = path.join(root, "docs/reference/shadcn-ui-original")
const uiDir = path.join(root, "src/components/ui")

describe("src/components/ui giữ bản gốc shadcn radix-nova", () => {
  const files = readdirSync(originalDir).filter((name) => name.endsWith(".tsx")).sort()

  it("có bản gốc để đối chiếu", () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const name of files) {
    it(name, () => {
      const original = readFileSync(path.join(originalDir, name), "utf8")
      const current = readFileSync(path.join(uiDir, name), "utf8")
      expect(current).toBe(adaptUi(original))
    })
  }
})
