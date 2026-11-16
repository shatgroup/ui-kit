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
    if (painted && !el.closest("[data-force-state=focus]")) failures.push(`còn shadow: ${el.tagName}`)
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
              const readPaint = async (locator: ReturnType<typeof page.getByRole>) => locator.evaluate((el) => {
                const style = getComputedStyle(el)
                return `${style.backgroundColor}|${style.transform}`
              })
              const switchEl = page.getByRole("switch", { name: "Light", exact: true })
              const boxEl = page.getByRole("checkbox", { name: "Checked", exact: true })
              const beforeSwitch = await readPaint(switchEl)
              const beforeBox = await readPaint(boxEl)
              const beforeDark = await page.evaluate(() => document.documentElement.classList.contains("dark"))
              await switchEl.click()
              await boxEl.click()
              await page.getByRole("radio", { name: "Unchecked", exact: true }).click()
              await page.getByRole("button", { name: /^(Sáng|Tối)$/ }).first().click()
              await page.waitForFunction((was) => document.documentElement.classList.contains("dark") !== was, beforeDark, { timeout: 2000 }).catch(() => undefined)
              const afterSwitch = await readPaint(switchEl)
              const afterBox = await readPaint(boxEl)
              const radioChecked = await page.getByRole("radio", { name: "Unchecked", exact: true }).getAttribute("data-checked")
              const afterDark = await page.evaluate(() => document.documentElement.classList.contains("dark"))
              if (beforeSwitch === afterSwitch) failures.push(`${theme}: Switch không đổi`)
              if (beforeBox === afterBox) failures.push(`${theme}: Checkbox không đổi`)
              if (radioChecked === null) failures.push(`${theme}: Radio không checked`)
              if (beforeDark === afterDark) failures.push(`${theme}: Toggle không pressed`)
            }
          }
        }
      }
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 180_000)

  it("popup, trạng thái, xô lệch và DataTable", async () => {
    const page = await browser.newPage()
    const failures: string[] = []
    const slots = ["select-trigger", "dropdown-menu-trigger", "popover-trigger"]
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of themes) {
        for (const item of pages) {
          await page.goto(`${base}${item.path}`, { waitUntil: "networkidle" })
          await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
          for (const tab of item.tabs) {
            if (tab) await page.getByRole("tab", { name: tab }).click()
            const where = `${item.path} ${tab || "-"} ${width} ${theme}`
            const clickState = async (selector: string, attr: string, message: string) => {
              const handles = await page.locator(selector).elementHandles()
              for (const handle of handles) {
                if (!(await handle.isVisible())) continue
                const disabled = await handle.evaluate((el) => {
                  if (!(el instanceof HTMLElement)) return true
                  return el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true" || el.hasAttribute("data-disabled")
                })
                if (disabled) continue
                const before = `${await handle.getAttribute(attr)}|${await handle.getAttribute("data-indeterminate")}`
                await handle.click({ timeout: 2000 }).catch(() => undefined)
                const after = `${await handle.getAttribute(attr)}|${await handle.getAttribute("data-indeterminate")}`
                if (before === after) failures.push(`${where}: ${message}`)
              }
            }
            await clickState("[role=switch]", "data-checked", "Switch không đổi")
            await clickState("[role=checkbox]", "data-checked", "Checkbox không đổi")
            await clickState("[role=radio]:not([data-checked])", "data-checked", "Radio không đổi")
            await clickState("[data-slot=toggle-group-item]:not([data-pressed])", "data-pressed", "Toggle không đổi")

            for (const slot of slots) {
              const triggers = page.locator(`[data-slot=${slot}]`)
              const count = await triggers.count()
              for (let index = 0; index < count; index += 1) {
                const trigger = triggers.nth(index)
                if (!(await trigger.isVisible())) continue
                const already = (await trigger.getAttribute("aria-expanded")) === "true"
                await trigger.evaluate((el) => el.setAttribute("data-guard-trigger", "true"))
                if (!already) {
                  await trigger.click({ timeout: 2000 }).catch(() => failures.push(`${where}: ${slot} không bấm được`))
                }
                await page.waitForTimeout(200)
                const covered = await page.evaluate(() => {
                  const trigger = document.querySelector("[data-guard-trigger=true]")
                  trigger?.removeAttribute("data-guard-trigger")
                  if (!(trigger instanceof HTMLElement)) return "không thấy ô"
                  const rect = trigger.getBoundingClientRect()
                  const popup = [...document.querySelectorAll("[data-slot=select-content], [data-slot=dropdown-menu-content], [data-slot=popover-content]")].find((el) => {
                    const box = el.getBoundingClientRect()
                    return box.width > 2 && box.height > 2 && !el.hasAttribute("data-starting-style")
                  })
                  if (!popup) return "không mở"
                  const frame = popup.getBoundingClientRect()
                  const overlap = frame.left < rect.right - 1 && frame.right > rect.left + 1 && frame.top < rect.bottom - 1 && frame.bottom > rect.top + 1
                  return overlap ? "che ô bấm" : ""
                })
                if (covered) failures.push(`${where}: ${slot} ${covered}`)
                if (!already) await page.keyboard.press("Escape")
              }
            }

            if (width !== 768) {
              await page.keyboard.press("Escape")
              await page.evaluate(() => {
                const target = window as Window & { __shift?: number }
                target.__shift = 0
                new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) target.__shift = (target.__shift ?? 0) + ((entry as PerformanceEntry & { value?: number }).value ?? 0)
                }).observe({ type: "layout-shift", buffered: false })
              })
              for (const name of ["Dialog", "Popover", "Mở menu"]) {
                const button = page.getByRole("button", { name }).first()
                if (await button.count() && await button.isVisible()) {
                  await button.click({ timeout: 2000 }).catch(() => undefined)
                  await page.keyboard.press("Escape")
                }
              }
              const menu = page.locator("[data-slot=dropdown-menu-trigger]").first()
              if (await menu.count() && await menu.isVisible()) {
                await menu.click({ timeout: 2000 }).catch(() => undefined)
                await page.keyboard.press("Escape")
              }
              const select = page.locator("[data-slot=select-trigger]").nth(item.path === "/design-system" ? 1 : 0)
              if (await select.count() && await select.isVisible()) {
                await select.click({ timeout: 2000 }).catch(() => undefined)
                await page.keyboard.press("Escape")
              }
              const shift = await page.evaluate(() => (window as Window & { __shift?: number }).__shift ?? 0)
              if (shift > 0) failures.push(`${where}: layout shift ${shift}`)
            }
            const tabNames = (await page.locator("[role=tab]:not([data-active])").allInnerTexts()).map((text) => text.split("\n")[0]?.trim() ?? "").filter(Boolean)
            for (const name of tabNames) {
              const current = page.getByRole("tab", { name, exact: true })
              if (!(await current.count()) || !(await current.isVisible())) continue
              await current.click({ timeout: 2000 }).catch(() => undefined)
              if ((await page.getByRole("tab", { name, exact: true }).getAttribute("data-active")) === null) failures.push(`${where}: Tab không đổi`)
            }
          }
        }
      }
    }

    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of themes) {
        const where = `Dashboard ${width} ${theme}`
        await page.goto(`${base}/showcase?tab=dashboard`, { waitUntil: "networkidle" })
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
        await page.getByRole("button", { name: "Customize Columns" }).click()
        await page.getByRole("menuitemcheckbox", { name: "Header" }).click()
        await page.keyboard.press("Escape")
        if (await page.getByRole("columnheader", { name: "Header" }).count() !== 0) failures.push(`${where}: ẩn cột Header không được`)
        await page.getByRole("button", { name: "Customize Columns" }).click()
        await page.getByRole("menuitemcheckbox", { name: "Header" }).click()
        await page.keyboard.press("Escape")
        if (await page.getByRole("columnheader", { name: "Header" }).count() === 0) failures.push(`${where}: hiện lại cột Header không được`)
        const target = page.getByRole("textbox", { name: "Target Cover page" })
        await target.fill("99")
        if (await target.inputValue() !== "99") failures.push(`${where}: sửa ô số không cập nhật`)
        await page.getByRole("button", { name: "Go to next page" }).click()
        const pageText = await page.locator("[data-slot=table-pagination]").innerText()
        if (!pageText.includes("Page 2")) failures.push(`${where}: phân trang ${pageText}`)
        const firstDrag = page.getByRole("button", { name: "Drag to reorder" }).first()
        const beforeHeader = await page.getByRole("row").nth(1).innerText()
        await firstDrag.focus()
        await page.keyboard.press("Space")
        await page.waitForTimeout(100)
        for (let step = 0; step < 4; step += 1) {
          await page.keyboard.press("ArrowDown")
          await page.waitForTimeout(80)
        }
        await page.keyboard.press("Space")
        const afterKey = await page.getByRole("row").nth(1).innerText()
        if (beforeHeader === afterKey) failures.push(`${where}: kéo hàng bằng bàn phím không đổi`)
        const handle = page.getByRole("button", { name: "Drag to reorder" }).first()
        await handle.scrollIntoViewIfNeeded()
        const box = await handle.boundingBox()
        if (!box) failures.push(`${where}: không thấy nút kéo`)
        else {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
          await page.mouse.down()
          await page.mouse.move(box.x + box.width / 2, box.y + 140, { steps: 12 })
          await page.mouse.up()
          const afterMouse = await page.getByRole("row").nth(1).innerText()
          if (afterMouse === afterKey) failures.push(`${where}: kéo hàng bằng chuột không đổi`)
        }
      }
    }

    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 420_000)
})
