import { createServer, type ViteDevServer } from "vite"
import { chromium, type Browser } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

const widths = [375, 768, 1440]
const themes = ["light", "dark"] as const
const pages = [
  { path: "/design-system", tabs: [""] },
  { path: "/showcase", tabs: ["Cards", "Dashboard", "Application", "POSM", "Motion"] },
]

function scan() {
  const hidden = (el: Element) => {
    const style = getComputedStyle(el)
    if (style.display === "none" || style.visibility === "hidden") return true
    const box = el.getBoundingClientRect()
    return box.width < 2 || box.height < 2
  }
  const failures: string[] = []
  const hosts = document.querySelectorAll("[data-slot=badge], [data-slot=button], [data-slot=sidebar] button")
  hosts.forEach((host) => {
    if (!(host instanceof HTMLElement) || hidden(host)) return
    const box = host.getBoundingClientRect()
    const svg = host.querySelector("svg")
    if (svg && !hidden(svg)) {
      const icon = svg.getBoundingClientRect()
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          return node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        },
      })
      const text = walker.nextNode()
      const screenText = text?.parentElement?.closest(".sr-only") ? null : text
      if (screenText) {
        const range = document.createRange()
        range.selectNodeContents(screenText)
        const label = range.getBoundingClientRect()
        if (label.height > 1 && Math.abs(icon.top + icon.height / 2 - (label.top + label.height / 2)) > 2) {
          failures.push(`icon lệch chữ: ${host.getAttribute("aria-label") || screenText.textContent?.trim()}`)
        }
      }
      if (icon.left < box.left - 1 || icon.right > box.right + 1 || icon.top < box.top - 1 || icon.bottom > box.bottom + 1) {
        failures.push(`icon tràn khung: ${host.getAttribute("aria-label") || host.textContent?.trim()}`)
      }
    }
    host.querySelectorAll("svg, span").forEach((child) => {
      if (hidden(child)) return
      const childBox = child.getBoundingClientRect()
      if (childBox.left < box.left - 1 || childBox.right > box.right + 1 || childBox.top < box.top - 1 || childBox.bottom > box.bottom + 1) {
        failures.push(`nội dung tràn khung: ${host.textContent?.trim().slice(0, 40)}`)
      }
    })
  })

  document.querySelectorAll("[data-slot=chart] svg").forEach((svg) => {
    if (!(svg instanceof SVGSVGElement) || hidden(svg)) return
    const frame = svg.getBoundingClientRect()
    svg.querySelectorAll("text").forEach((node) => {
      const box = node.getBoundingClientRect()
      if (box.width < 1 || box.height < 1) return
      if (box.left < frame.left - 1 || box.right > frame.right + 1 || box.top < frame.top - 1 || box.bottom > frame.bottom + 1) {
        failures.push(`chữ chart bị cắt: ${node.textContent?.trim()}`)
      }
    })
  })

  const sidebar = document.querySelector("[data-slot=sidebar]")
  if (sidebar instanceof HTMLElement && !hidden(sidebar) && sidebar.getBoundingClientRect().width < 64) {
    const centers = [...sidebar.querySelectorAll("button svg")]
      .filter((icon) => !hidden(icon))
      .map((icon) => {
        const box = icon.getBoundingClientRect()
        return box.left + box.width / 2
      })
    if (centers.length > 1 && Math.max(...centers) - Math.min(...centers) > 1) {
      failures.push(`icon sidebar lệch tâm: ${centers.map((value) => value.toFixed(1)).join(", ")}`)
    }
    const logo = sidebar.querySelector("span")
    const logoText = logo?.querySelector("p, span")
    if (logoText) {
      const range = document.createRange()
      range.selectNodeContents(logoText)
      const tops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)))
      if (tops.size > 1) failures.push("logo sidebar xuống dòng")
    }
  }

  if (document.documentElement.classList.contains("dark")) {
    document.querySelectorAll(".recharts-sector").forEach((sector) => {
      if (!(sector instanceof SVGElement) || hidden(sector)) return
      if (getComputedStyle(sector).stroke === "rgb(255, 255, 255)") failures.push("sector pie còn stroke trắng")
    })
  }

  document.querySelectorAll("body *").forEach((el) => {
    if (!(el instanceof Element) || hidden(el) || el.matches(":focus, :focus-visible")) return
    const shadow = getComputedStyle(el).boxShadow
    const painted = shadow && shadow !== "none" && !/^rgba\(0,\s*0,\s*0,\s*0\) 0px 0px 0px 0px(?:, rgba\(0,\s*0,\s*0,\s*0\) 0px 0px 0px 0px)*$/.test(shadow)
    if (painted) failures.push(`còn shadow: ${el.tagName}`)
  })

  if (document.documentElement.scrollWidth > window.innerWidth + 2) failures.push("tràn trang")
  const controls = [...document.querySelectorAll("button, input, [data-slot=select-trigger]")].filter(
    (el) => el instanceof HTMLElement && !hidden(el) && !el.closest("[data-slot=calendar], [data-slot=tabs-list], [data-slot=toggle-group], [data-slot=input-group], [data-slot=badge]") && getComputedStyle(el).position !== "absolute",
  )
  const groups = new Map<Element, HTMLElement[]>()
  for (const el of controls) {
    if (!(el instanceof HTMLElement)) continue
    let node = el.parentElement
    let parent: HTMLElement | null = null
    while (node) {
      const style = getComputedStyle(node)
      if ((style.display === "flex" || style.display === "inline-flex") && style.flexDirection.startsWith("row")) {
        parent = node
        break
      }
      node = node.parentElement
    }
    if (!parent) continue
    const list = groups.get(parent) ?? []
    list.push(el)
    groups.set(parent, list)
  }
  for (const list of groups.values()) {
    const sorted = list.map((el) => ({ el, box: el.getBoundingClientRect() })).sort((a, b) => a.box.left - b.box.left)
    for (let index = 0; index < sorted.length - 1; index += 1) {
      const a = sorted[index]
      const b = sorted[index + 1]
      if (!a || !b || Math.abs(a.box.top - b.box.top) > 8) continue
      if (a.box.left < b.box.right - 1 && a.box.right > b.box.left + 1) failures.push("đè control")
      if (Math.abs(a.box.height - b.box.height) > 1 || Math.abs(a.box.top + a.box.height / 2 - (b.box.top + b.box.height / 2)) > 1) failures.push("lệch căn")
      const gap = b.box.left - a.box.right
      if (gap >= 0 && gap < 4) failures.push("dính control")
    }
  }
  return failures
}

describe("kiểm showcase", () => {
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

  it("icon, chart, sidebar, pie và bố cục", async () => {
    const page = await browser.newPage()
    const failures: string[] = []
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of themes) {
        for (const item of pages) {
          await page.goto(`${base}${item.path}`, { waitUntil: "networkidle" })
          await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
          for (const tab of item.tabs) {
            if (tab) await page.getByRole("tab", { name: tab }).click()
            const collapse = page.getByRole("button", { name: "Thu gọn sidebar" })
            if (await collapse.isVisible()) await collapse.click()
            await page.waitForTimeout(300)
            const found = await page.evaluate(scan)
            for (const message of found) failures.push(`${item.path} ${tab || "-"} ${width} ${theme}: ${message}`)
            if (item.path === "/design-system" && width === 1440) {
              const states = await page.evaluate(() => {
                const read = (label: string) => {
                  const el = document.querySelector(`[aria-label="${label}"]`)
                  if (!(el instanceof HTMLElement)) return ""
                  const style = getComputedStyle(el)
                  return `${style.backgroundColor}|${style.transform}`
                }
                return { switch: read("Bật tắt"), box: read("Đã chọn") }
              })
              await page.getByRole("switch", { name: "Bật tắt" }).click()
              await page.getByRole("checkbox", { name: "Đã chọn" }).click()
              await page.getByRole("radio", { name: "Hai" }).click()
              await page.getByRole("button", { name: "Bảng" }).click()
              const after = await page.evaluate(() => {
                const read = (label: string) => {
                  const el = document.querySelector(`[aria-label="${label}"]`)
                  if (!(el instanceof HTMLElement)) return ""
                  const style = getComputedStyle(el)
                  return `${style.backgroundColor}|${style.transform}`
                }
                const radio = document.querySelector('[aria-label="Radio"] [data-checked]')
                const toggle = document.querySelector('[data-slot="toggle-group-item"][data-pressed]')
                return {
                  switch: read("Bật tắt"),
                  box: read("Đã chọn"),
                  radio: radio ? getComputedStyle(radio).backgroundColor : "",
                  toggle: toggle ? getComputedStyle(toggle).backgroundColor : "",
                }
              })
              if (states.switch === after.switch) failures.push(`${theme}: Switch không đổi`)
              if (states.box === after.box) failures.push(`${theme}: Checkbox không đổi`)
              if (!after.radio) failures.push(`${theme}: Radio không checked`)
              if (!after.toggle) failures.push(`${theme}: Toggle không pressed`)
            }
          }
        }
      }
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 180_000)
})
