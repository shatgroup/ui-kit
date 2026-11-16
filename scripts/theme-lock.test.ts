import { readFileSync } from "node:fs"
import { createServer, type ViteDevServer } from "vite"
import { chromium, type Browser, type Page } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

type Lock = { light: Record<string, string>; dark: Record<string, string> }

const lock = JSON.parse(readFileSync(new URL("../src/styles/theme.lock.json", import.meta.url), "utf8")) as Lock

function namesFor(mode: Record<string, string>) {
  const names = new Set(Object.keys(mode))
  for (const value of Object.values(mode)) {
    for (const match of value.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/gi)) {
      const name = match[1]
      if (name) names.add(name)
    }
  }
  return [...names]
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

function resolve(expected: string, actual: Record<string, string>) {
  return expected.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi, (_, name: string) => actual[name] ?? "")
}

function mismatches(mode: string, expected: Record<string, string>, actual: Record<string, string>) {
  const lines: string[] = []
  for (const [name, value] of Object.entries(expected)) {
    const got = normalize(actual[name] ?? "")
    const raw = normalize(value)
    const resolved = normalize(resolve(value, actual))
    if (got !== raw && got !== resolved) lines.push(`${mode} ${name}: đang có ${actual[name] || "(trống)"} · đúng ${value}`)
  }
  return lines
}

async function readVars(page: Page, names: string[]) {
  return page.evaluate((keys) => {
    const style = getComputedStyle(document.documentElement)
    const values: Record<string, string> = {}
    for (const key of keys) values[key] = style.getPropertyValue(key).trim()
    return values
  }, names)
}

describe("khoá theme", () => {
  let browser: Browser
  let server: ViteDevServer
  let base = ""

  beforeAll(async () => {
    server = await createServer({ server: { host: "127.0.0.1", port: 0 }, logLevel: "silent" })
    await server.listen()
    const address = server.httpServer?.address()
    const port = typeof address === "object" && address ? address.port : 0
    base = `http://127.0.0.1:${port}`
    browser = await chromium.launch({ channel: "chrome" })
  }, 60_000)

  afterAll(async () => {
    await browser?.close()
    await server?.close()
  })

  it("mỗi biến trên /tokens khớp theme.lock.json", async () => {
    const page = await browser.newPage()
    await page.goto(`${base}/tokens`, { waitUntil: "networkidle" })
    const failures: string[] = []
    for (const mode of ["light", "dark"] as const) {
      await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), mode === "dark")
      const actual = await readVars(page, namesFor(lock[mode]))
      failures.push(...mismatches(mode, lock[mode], actual))
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 60_000)
})
