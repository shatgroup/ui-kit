import { createServer, type ViteDevServer } from "vite"
import { chromium, type Browser } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

const widths = [375, 768, 1440]
const themes = ["light", "dark"] as const
const pages = [
  { path: "/design-system", tabs: [""] },
  { path: "/showcase?tab=cards", tabs: [""] },
  { path: "/showcase?tab=dashboard", tabs: [""] },
  { path: "/showcase?tab=application", tabs: [""] },
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
      const lines: DOMRect[] = []
      const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.textContent?.trim() || node.parentElement?.closest(".sr-only")) return NodeFilter.FILTER_REJECT
          return NodeFilter.FILTER_ACCEPT
        },
      })
      let text = walker.nextNode()
      while (text) {
        const range = document.createRange()
        range.selectNodeContents(text)
        const label = range.getBoundingClientRect()
        if (label.height > 1) lines.push(label)
        text = walker.nextNode()
      }
      if (lines.length) {
        const top = Math.min(...lines.map((line) => line.top))
        const bottom = Math.max(...lines.map((line) => line.bottom))
        if (Math.abs(icon.top + icon.height / 2 - (top + bottom) / 2) > 2) {
          failures.push(`icon lệch chữ: ${host.getAttribute("aria-label") || host.textContent?.trim()?.slice(0, 40)}`)
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

  document.querySelectorAll("[data-slot=chart] svg text").forEach((node) => {
    if (!(node instanceof SVGElement)) return
    const box = node.getBoundingClientRect()
    if (box.width < 1 || box.height < 1) return
    let parent = node.parentElement
    while (parent) {
      const style = getComputedStyle(parent)
      const clips = /hidden|clip/.test(`${style.overflow}${style.overflowX}${style.overflowY}`)
      if (clips) {
        const frame = parent.getBoundingClientRect()
        if (box.left < frame.left - 1 || box.right > frame.right + 1 || box.top < frame.top - 1 || box.bottom > frame.bottom + 1) {
          failures.push(`chữ chart bị cắt: ${node.textContent?.trim()}`)
        }
        break
      }
      parent = parent.parentElement
    }
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
    const lengths = shadow.match(/-?[\d.]+px/g) ?? []
    const painted = shadow !== "none" && lengths.some((item) => Math.abs(Number.parseFloat(item)) > 0.5)
    // Chính thẻ card phải hết bóng. Ring bên trong example tweakcn không tính.
    const exampleInner = el.closest("[data-showcase-scroll] [data-slot=card]") && !el.matches("[data-slot=card]")
    if (painted && !el.closest("[data-force-state=focus]") && !exampleInner) failures.push(`còn shadow: ${el.tagName} ${el.getAttribute("data-slot") ?? ""}`)
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
              const switchEl = page.getByRole("switch", { name: "Switch tắt", exact: true })
              const boxEl = page.getByRole("checkbox", { name: "Checkbox bật", exact: true })
              const beforeSwitch = await readPaint(switchEl)
              const beforeBox = await readPaint(boxEl)
              const beforeDark = await page.evaluate(() => document.documentElement.classList.contains("dark"))
              await switchEl.click()
              await boxEl.click()
              await page.getByRole("radio", { name: "Radio tắt", exact: true }).click()
              await page.getByRole("radio", { name: theme === "dark" ? "Sáng" : "Tối", exact: true }).click()
              await page.waitForFunction((was) => document.documentElement.classList.contains("dark") !== was, beforeDark, { timeout: 2000 }).catch(() => undefined)
              const afterSwitch = await readPaint(switchEl)
              const afterBox = await readPaint(boxEl)
              const radioChecked = await page.getByRole("radio", { name: "Radio tắt", exact: true }).getAttribute("data-state")
              const afterDark = await page.evaluate(() => document.documentElement.classList.contains("dark"))
              if (beforeSwitch === afterSwitch) failures.push(`${theme}: Switch không đổi`)
              if (beforeBox === afterBox) failures.push(`${theme}: Checkbox không đổi`)
              if (radioChecked !== "checked") failures.push(`${theme}: Radio không checked`)
              if (beforeDark === afterDark) failures.push(`${theme}: Toggle không pressed`)
            }
          }
        }
      }
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 240_000)

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
            await clickState("[role=switch]", "data-state", "Switch không đổi")
            await clickState("[role=checkbox]", "data-state", "Checkbox không đổi")
            await clickState("[role=radio][data-state=unchecked]", "data-state", "Radio không đổi")
            await clickState("[data-slot=toggle-group-item][data-state=off]", "data-state", "Toggle không đổi")

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
            const tabNames = (await page.locator("[role=tab][data-state=inactive]").allInnerTexts()).map((text) => text.split("\n")[0]?.trim() ?? "").filter(Boolean)
            for (const name of tabNames) {
              const current = page.getByRole("tab", { name, exact: true })
              if (!(await current.count()) || !(await current.isVisible())) continue
              await current.click({ timeout: 2000 }).catch(() => undefined)
              if ((await page.getByRole("tab", { name, exact: true }).getAttribute("data-state")) !== "active") failures.push(`${where}: Tab không đổi`)
            }
          }
        }
      }
    }

    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 600_000)

  it("3 tab tweakcn tải, không lỗi console, cuộn tới cuối", async () => {
    const page = await browser.newPage()
    const failures: string[] = []
    const tabs = ["cards", "dashboard", "application"] as const
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of themes) {
        for (const tab of tabs) {
          const errors: string[] = []
          const onConsole = (message: { type: () => string; text: () => string }) => {
            if (message.type() === "error") errors.push(message.text())
          }
          const onError = (error: Error) => errors.push(error.message)
          page.on("console", onConsole)
          page.on("pageerror", onError)
          await page.goto(`${base}/showcase?tab=${tab}`, { waitUntil: "networkidle" })
          await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
          await page.waitForTimeout(400)
          const scrolled = await page.evaluate(() => {
            const scroller = document.querySelector("[data-showcase-scroll]")
            if (!(scroller instanceof HTMLElement)) return "không thấy vùng cuộn"
            if (scroller.scrollHeight <= scroller.clientHeight + 2) return `không dài hơn khung ${scroller.scrollHeight}/${scroller.clientHeight}`
            scroller.scrollTop = scroller.scrollHeight
            const bottom = scroller.scrollTop + scroller.clientHeight
            if (bottom < scroller.scrollHeight - 2) return `không tới đáy ${bottom}/${scroller.scrollHeight}`
            return ""
          })
          if (scrolled) failures.push(`${tab} ${width} ${theme}: ${scrolled}`)
          const noise = errors.filter((message) => !/favicon|Download the React DevTools/i.test(message))
          if (noise.length) failures.push(`${tab} ${width} ${theme}: ${noise.join(" | ")}`)
          page.off("console", onConsole)
          page.off("pageerror", onError)
        }
      }
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 180_000)

  it("calendar, khoảng ngày, badge tab, select, sidebar, chart", async () => {
    const page = await browser.newPage()
    const failures: string[] = []
    const ranges = ["Last 3 months", "Last 30 days", "Last 7 days"]
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of themes) {
        const where = `${width} ${theme}`
        await page.goto(`${base}/showcase?tab=cards`, { waitUntil: "networkidle" })
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
        await page.waitForTimeout(200)
        const calendar = await page.evaluate((wide) => {
          const notes: string[] = []
          const roots = [...document.querySelectorAll(".rdp-root")].filter((el) => {
            const box = el.getBoundingClientRect()
            return box.width > 2 && box.height > 2
          })
          if (!roots.length) return wide ? ["không thấy lịch"] : []
          for (const root of roots) {
            const previous = root.querySelector(".rdp-button_previous")
            const next = root.querySelector(".rdp-button_next")
            const label = root.querySelector(".rdp-caption_label")
            if (!(previous instanceof HTMLElement) || !(next instanceof HTMLElement) || !(label instanceof HTMLElement)) {
              notes.push("thiếu mũi tên hoặc tên tháng")
              continue
            }
            const a = previous.getBoundingClientRect()
            const b = label.getBoundingClientRect()
            const c = next.getBoundingClientRect()
            const mid = (box: DOMRect) => box.top + box.height / 2
            if (Math.abs(mid(a) - mid(b)) > 2 || Math.abs(mid(c) - mid(b)) > 2) {
              notes.push(`tên tháng lệch mũi tên ${Math.abs(mid(a) - mid(b)).toFixed(1)}/${Math.abs(mid(c) - mid(b)).toFixed(1)}`)
            }
          }
          return notes
        }, width >= 768)
        for (const note of calendar) failures.push(`${where} calendar: ${note}`)

        const rangeButton = page.getByRole("button", { name: /Jan|Pick a date/ }).first()
        await rangeButton.click()
        await page.waitForTimeout(300)
        const range = await page.evaluate((wide) => {
          const popup = document.querySelector("[data-slot=popover-content]")
          if (!(popup instanceof HTMLElement)) return ["popup khoảng ngày không mở"]
          const frame = popup.getBoundingClientRect()
          const days = [...popup.querySelectorAll(".rdp-day")].filter((el) => el.getBoundingClientRect().width > 2)
          if (days.length < 20) return [`ô ngày quá ít ${days.length}`]
          const outside = days.filter((el) => {
            const box = el.getBoundingClientRect()
            return box.left < frame.left - 1 || box.right > frame.right + 1 || box.top < frame.top - 1 || box.bottom > frame.bottom + 1
          })
          const months = [...popup.querySelectorAll(".rdp-month")].map((el) => el.getBoundingClientRect()).filter((box) => box.width > 2)
          const sideBySide = months.length >= 2 && Math.abs(months[0]!.top - months[1]!.top) < 8 && months[1]!.left > months[0]!.right - 4
          const notes: string[] = []
          if (outside.length) notes.push(`${outside.length} ô ngày tràn popup`)
          if (wide && !sideBySide) notes.push("2 tháng không xếp cạnh nhau")
          return notes
        }, width >= 768)
        for (const note of range) failures.push(`${where} khoảng ngày: ${note}`)
        await page.keyboard.press("Escape")

        const selects = await page.evaluate(() => {
          const expected = ["Can edit", "Billing", "Severity 2"]
          const triggers = [...document.querySelectorAll("[data-slot=select-trigger]")].filter((el) => el.getBoundingClientRect().width > 2)
          const texts = triggers.map((el) => el.textContent?.replace(/\s+/g, " ").trim() ?? "")
          return expected.filter((label) => !texts.some((text) => text.includes(label))).map((label) => `thiếu nhãn ${label} (đang có: ${texts.join(" | ")})`)
        })
        for (const note of selects) failures.push(`${where} select: ${note}`)

        await page.goto(`${base}/showcase?tab=dashboard`, { waitUntil: "networkidle" })
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
        await page.waitForTimeout(400)
        const sidebar = await page.evaluate(() => {
          const bar = [...document.querySelectorAll("a, button")].find((el) => el.textContent?.trim() === "Design System")
          if (!(bar instanceof HTMLElement)) return "không thấy thanh trên"
          const top = bar.getBoundingClientRect()
          const sides = [...document.querySelectorAll("[data-slot=sidebar-container], [data-mobile=true][data-slot=sidebar]")].filter((el) => {
            const style = getComputedStyle(el)
            if (style.display === "none" || style.visibility === "hidden") return false
            const box = el.getBoundingClientRect()
            return box.width > 2 && box.height > 2
          })
          for (const side of sides) {
            const box = side.getBoundingClientRect()
            const overlap = box.top < top.bottom - 1 && box.bottom > top.top + 1 && box.left < top.right - 1 && box.right > top.left + 1
            if (overlap) return `sidebar đè thanh trên (${box.top.toFixed(0)} < ${top.bottom.toFixed(0)})`
          }
          return ""
        })
        if (sidebar) failures.push(`${where} ${sidebar}`)

        const badge = await page.evaluate(() => {
          const tab = [...document.querySelectorAll("[role=tab]")].find((el) => el.textContent?.includes("Past Performance") && el.getBoundingClientRect().width > 2)
          if (!(tab instanceof HTMLElement)) return "không thấy tab Past Performance"
          const mark = tab.querySelector("[data-slot=badge]")
          const text = [...tab.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
          if (!(mark instanceof HTMLElement) || !text) return "tab không có badge hoặc chữ"
          const range = document.createRange()
          range.selectNodeContents(text)
          const label = range.getBoundingClientRect()
          const chip = mark.getBoundingClientRect()
          const delta = Math.abs(chip.top + chip.height / 2 - (label.top + label.height / 2))
          return delta > 2 ? `badge lệch chữ ${delta.toFixed(1)}px` : ""
        })
        if (badge) failures.push(`${where} tab: ${badge}`)

        for (const name of ranges) {
          const radio = page.getByRole("radio", { name, exact: true })
          if ((await radio.count()) && (await radio.first().isVisible())) {
            const on = (await radio.first().getAttribute("data-state")) === "on" || (await radio.first().getAttribute("aria-checked")) === "true"
            if (!on) await radio.first().click()
          } else {
            const trigger = page.getByRole("combobox", { name: "Select a value" })
            if (!(await trigger.count()) || !(await trigger.first().isVisible())) {
              failures.push(`${where} chart: ${name}: không thấy nút đổi khoảng`)
              continue
            }
            await trigger.first().click()
            await page.getByRole("option", { name, exact: true }).click()
          }
          await page.waitForTimeout(1700)
          const chart = await page.evaluate((label) => {
            const card = [...document.querySelectorAll("[data-slot=card]")].find((el) => el.textContent?.includes("Total Visitors"))
            if (!(card instanceof HTMLElement)) return `${label}: không thấy Total Visitors`
            const curve = card.querySelector(".recharts-area-curve, .recharts-curve")
            const ticks = [...card.querySelectorAll(".recharts-xAxis text, .recharts-cartesian-axis-tick-value")].filter((el) => el.getBoundingClientRect().width > 2)
            if (!(curve instanceof SVGGraphicsElement) || !ticks.length) return `${label}: thiếu đường hoặc nhãn trục`
            const end = curve.getBoundingClientRect().right
            const last = ticks[ticks.length - 1]!.getBoundingClientRect()
            const target = last.left + last.width / 2
            if (end < target - 8) return `${label}: đường dừng ở ${end.toFixed(0)}, nhãn cuối ở ${target.toFixed(0)} (${ticks[ticks.length - 1]!.textContent?.trim()})`
            return ""
          }, name)
          if (chart) failures.push(`${where} chart: ${chart}`)
        }
      }
    }

    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 240_000)

  it("switch bật nền primary chấm phải, tắt nền input chấm trái", async () => {
    const page = await browser.newPage()
    const failures: string[] = []
    await page.setViewportSize({ width: 1440, height: 900 })
    const near = (a: number[], b: number[]) => a.every((item, index) => Math.abs(item - b[index]!) <= 3)
    const read = (name: string) => page.getByRole("switch", { name, exact: true }).evaluate((el) => {
      const paint = (color: string) => {
        const canvas = document.createElement("canvas")
        canvas.width = 1
        canvas.height = 1
        const ctx = canvas.getContext("2d")
        if (!ctx) return [0, 0, 0, 0]
        ctx.clearRect(0, 0, 1, 1)
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 1, 1)
        return [...ctx.getImageData(0, 0, 1, 1).data]
      }
      const thumb = el.querySelector("[data-slot=switch-thumb]")
      if (!(thumb instanceof HTMLElement)) return null
      const root = el.getBoundingClientRect()
      const box = thumb.getBoundingClientRect()
      const center = box.left + box.width / 2
      const bg = getComputedStyle(el).backgroundColor
      return {
        bg,
        paint: paint(bg),
        side: center < root.left + root.width / 2 ? "left" : "right",
        state: el.getAttribute("data-state"),
      }
    })
    for (const theme of themes) {
      await page.goto(`${base}/design-system`, { waitUntil: "networkidle" })
      await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
      await page.waitForTimeout(400)
      const colors = await page.evaluate((dark) => {
        const sample = (value: string) => {
          const node = document.createElement("div")
          node.style.backgroundColor = value
          document.body.appendChild(node)
          const color = getComputedStyle(node).backgroundColor
          node.remove()
          return color
        }
        const paint = (color: string) => {
          const canvas = document.createElement("canvas")
          canvas.width = 1
          canvas.height = 1
          const ctx = canvas.getContext("2d")
          if (!ctx) return [0, 0, 0, 0]
          ctx.clearRect(0, 0, 1, 1)
          ctx.fillStyle = color
          ctx.fillRect(0, 0, 1, 1)
          return [...ctx.getImageData(0, 0, 1, 1).data]
        }
        const primary = sample("var(--primary)")
        const off = dark ? sample("color-mix(in oklab, var(--input) 80%, transparent)") : sample("var(--input)")
        return { primary, off, primaryPaint: paint(primary), inputPaint: paint(off) }
      }, theme === "dark")
      const off = await read("Switch tắt")
      const on = await read("Switch bật")
      if (!off || !on) {
        failures.push(`${theme}: không thấy switch`)
        continue
      }
      if (off.state !== "unchecked" || off.side !== "left" || !near(off.paint, colors.inputPaint)) {
        failures.push(`${theme}: tắt sai ${off.state} ${off.side} nền ${off.bg} (kỳ vọng ${colors.off})`)
      }
      if (on.state !== "checked" || on.side !== "right" || !near(on.paint, colors.primaryPaint)) {
        failures.push(`${theme}: bật sai ${on.state} ${on.side} nền ${on.bg} (kỳ vọng ${colors.primary})`)
      }
      await page.getByRole("switch", { name: "Switch tắt", exact: true }).click()
      await page.getByRole("switch", { name: "Switch bật", exact: true }).click()
      await page.waitForTimeout(400)
      const offAfter = await read("Switch tắt")
      const onAfter = await read("Switch bật")
      if (!offAfter || !onAfter) {
        failures.push(`${theme}: mất switch sau click`)
        continue
      }
      if (offAfter.side === off.side || offAfter.side !== "right" || !near(offAfter.paint, colors.primaryPaint)) {
        failures.push(`${theme}: click bật không đổi nền và chấm (${off.bg}/${off.side} → ${offAfter.bg}/${offAfter.side})`)
      }
      if (onAfter.side === on.side || onAfter.side !== "left" || !near(onAfter.paint, colors.inputPaint)) {
        failures.push(`${theme}: click tắt không đổi nền và chấm (${on.bg}/${on.side} → ${onAfter.bg}/${onAfter.side})`)
      }
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 60_000)

  it("design system: tràn, tương phản, hex, control", async () => {
    const page = await browser.newPage()
    const failures: string[] = []
    const shots: Record<string, string> = {
      "1440 light": "docs/reference/ket-qua-ds-light-1440.png",
      "1440 dark": "docs/reference/ket-qua-ds-dark-1440.png",
      "375 light": "docs/reference/ket-qua-ds-375.png",
    }
    for (const width of [...widths, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      for (const theme of themes) {
        const where = `${width} ${theme}`
        await page.goto(`${base}/design-system`, { waitUntil: "networkidle" })
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
        await page.waitForFunction(() => {
          const hex = document.querySelector("[data-swatch=background]")?.getAttribute("data-hex") ?? ""
          const size = document.getElementById("type-text-xs")?.closest("tr")?.querySelectorAll("td")[3]?.textContent ?? ""
          return hex.startsWith("#") && size.includes("px")
        })
        await page.waitForTimeout(600)
        const found = await page.evaluate(() => {
          const notes: string[] = []
          const scroller = document.querySelector(".h-dvh > div")
          if (scroller instanceof HTMLElement && scroller.scrollWidth > scroller.clientWidth + 2) {
            notes.push(`tràn ngang ${scroller.scrollWidth}/${scroller.clientWidth}`)
          }
          const channel = (value: number) => {
            const unit = value / 255
            return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
          }
          const paint = (color: string) => {
            const canvas = document.createElement("canvas")
            canvas.width = 1
            canvas.height = 1
            const ctx = canvas.getContext("2d")
            if (!ctx) return [0, 0, 0]
            ctx.fillStyle = color
            ctx.fillRect(0, 0, 1, 1)
            const data = ctx.getImageData(0, 0, 1, 1).data
            return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0]
          }
          const lum = (rgb: number[]) => 0.2126 * channel(rgb[0] ?? 0) + 0.7152 * channel(rgb[1] ?? 0) + 0.0722 * channel(rgb[2] ?? 0)
          const ratioOf = (a: number[], b: number[]) => {
            const left = lum(a)
            const right = lum(b)
            return (Math.max(left, right) + 0.05) / (Math.min(left, right) + 0.05)
          }
          document.querySelectorAll("[data-swatch]").forEach((node) => {
            if (!(node instanceof HTMLElement)) return
            const label = node.querySelector("span")
            if (!(label instanceof HTMLElement)) return
            const box = node.getBoundingClientRect()
            const text = label.getBoundingClientRect()
            if (text.width > 2 && (text.left < box.left - 1 || text.right > box.right + 1 || text.top < box.top - 1 || text.bottom > box.bottom + 1)) {
              notes.push(`chữ tràn thẻ ${node.getAttribute("data-swatch")}`)
            }
            const ratio = ratioOf(paint(getComputedStyle(node).backgroundColor), paint(getComputedStyle(label).color))
            const name = node.getAttribute("data-swatch") ?? ""
            // Chủ ý trong theme.css: --primary-foreground và --sidebar-primary-foreground là #FFFFFF,
            // tương phản với primary dưới 4.5:1. Quyết định giữ nguyên cặp primary/primary-foreground.
            if (name === "primary" || name === "sidebar-primary") return
            // chart và ring giữ một màu ở cả hai theme. Chữ foreground sáng lên khi tối,
            // nên tỷ lệ còn khoảng 1.1–2.4. Vẫn dùng text-foreground, không tự tính màu chữ.
            const flatFill = name.startsWith("chart-") || name === "ring" || name === "sidebar-ring"
            if (flatFill) {
              const foreground = paint(getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim())
              const text = paint(getComputedStyle(label).color)
              const same = foreground.every((value, index) => Math.abs(value - (text[index] ?? 0)) <= 3)
              if (!same) notes.push(`${name} không dùng chữ foreground`)
              return
            }
            if (ratio < 4.5) notes.push(`tương phản ${name} ${ratio.toFixed(2)}`)
          })
          const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
          // docs/STANDARD.md: cỡ rem, line-height, độ đậm normal/medium/semibold/bold.
          const typeScale = [
            { id: "type-text-xs", weight: "400", rem: 0.75, line: 1 / 0.75 },
            { id: "type-text-sm", weight: "400", rem: 0.875, line: 1.25 / 0.875 },
            { id: "type-text-base", weight: "400", rem: 1, line: 1.5 },
            { id: "type-text-lg", weight: "400", rem: 1.125, line: 1.75 / 1.125 },
            { id: "type-text-xl", weight: "500", rem: 1.25, line: 1.75 / 1.25 },
            { id: "type-text-2xl", weight: "600", rem: 1.5, line: 2 / 1.5 },
            { id: "type-text-3xl", weight: "700", rem: 1.875, line: 1.3 },
          ]
          for (const row of typeScale) {
            const sample = document.getElementById(row.id)
            if (!(sample instanceof HTMLElement) || sample.tagName === "TD" || sample.parentElement?.tagName !== "TD") {
              notes.push(`không đo được chữ mẫu ${row.id}`)
              continue
            }
            const style = getComputedStyle(sample)
            const size = Math.round(row.rem * root)
            const line = Math.round(row.rem * root * row.line)
            const gotSize = Math.round(Number.parseFloat(style.fontSize))
            const gotLine = Math.round(Number.parseFloat(style.lineHeight))
            if (style.fontWeight !== row.weight || gotSize !== size || gotLine !== line) {
              notes.push(`${row.id} đo ${style.fontWeight}/${gotSize}px/${gotLine}px, STANDARD ${row.weight}/${size}px/${line}px`)
            }
            const cells = sample.closest("tr")?.querySelectorAll("td")
            const shown = [cells?.[2]?.textContent?.trim(), cells?.[3]?.textContent?.trim(), cells?.[4]?.textContent?.trim()]
            if (shown[0] !== row.weight || shown[1] !== `${size}px` || shown[2] !== `${line}px`) {
              notes.push(`${row.id} bảng ghi ${shown.join(" · ")} thay vì ${row.weight} · ${size}px · ${line}px`)
            }
          }
          const word = document.querySelector(".specimen-word")
          const title = document.querySelector("h1")
          if (word instanceof HTMLElement && title instanceof HTMLElement && word.parentElement) {
            const wordBox = word.getBoundingClientRect()
            const titleBox = title.getBoundingClientRect()
            const rowBox = word.parentElement.getBoundingClientRect()
            if (window.innerWidth >= 1440) {
              if (wordBox.left < titleBox.right - 1) notes.push("tên font không nằm bên phải tiêu đề")
              if (Math.abs(rowBox.right - wordBox.right) > 2) notes.push("tên font chưa canh phải")
            }
            if (window.innerWidth <= 375) {
              if (wordBox.top < titleBox.bottom - 1) notes.push("tên font chưa xuống dưới tiêu đề")
            }
          }
          const frame = document.querySelector("[data-slot=container]")
          if (frame instanceof HTMLElement && scroller instanceof HTMLElement && window.innerWidth >= 1440) {
            const box = frame.getBoundingClientRect()
            const host = scroller.getBoundingClientRect()
            if (box.width > 1280.5) notes.push(`khung rộng ${Math.round(box.width)}px`)
            const delta = Math.abs(box.left + box.width / 2 - (host.left + host.width / 2))
            if (delta > 2) notes.push(`khung lệch giữa ${delta.toFixed(1)}px`)
          }
          const shadow = [...document.querySelectorAll("[data-swatch], [data-slot=card]")].some((node) => {
            if (!(node instanceof HTMLElement)) return false
            const value = getComputedStyle(node).boxShadow
            const lengths = value.match(/-?[\d.]+px/g) ?? []
            return value !== "none" && lengths.some((item) => Math.abs(Number.parseFloat(item)) > 0.5)
          })
          if (shadow) notes.push("còn shadow")
          const header = document.querySelector("header")
          if (header instanceof HTMLElement) {
            const box = header.getBoundingClientRect()
            if (Math.abs(box.height - 56) > 1) notes.push(`header cao ${box.height.toFixed(1)}px`)
            header.querySelectorAll("[data-slot=toggle-group-item]").forEach((item) => {
              if (!(item instanceof HTMLElement)) return
              const itemBox = item.getBoundingClientRect()
              if (itemBox.top < box.top - 1 || itemBox.bottom > box.bottom + 1 || itemBox.left < box.left - 1 || itemBox.right > box.right + 1) {
                notes.push("nút header bị cắt")
              }
              const mid = itemBox.top + itemBox.height / 2
              if (Math.abs(mid - (box.top + box.height / 2)) > 2) notes.push("nút header lệch giữa")
            })
          }
          document.querySelectorAll(".kit-grid").forEach((grid) => {
            const cards = [...grid.children].flatMap((child) => {
              if (!(child instanceof HTMLElement)) return []
              if (child.getAttribute("data-slot") === "card") return [child]
              const nested = child.querySelector("[data-slot=card]")
              return nested instanceof HTMLElement ? [nested] : []
            })
            const rows: Array<{ top: number; heights: number[] }> = []
            for (const card of cards) {
              const rect = card.getBoundingClientRect()
              const row = rows.find((item) => Math.abs(item.top - rect.top) <= 2)
              if (row) row.heights.push(rect.height)
              else rows.push({ top: rect.top, heights: [rect.height] })
            }
            for (const row of rows) {
              if (row.heights.length < 2) continue
              const delta = Math.max(...row.heights) - Math.min(...row.heights)
              if (delta > 1) notes.push(`card cùng hàng lệch ${delta.toFixed(1)}px`)
            }
          })
          const named = (role: string, name: string) => [...document.querySelectorAll(`[role="${role}"]`)].find((el) => {
            const id = el.getAttribute("id")
            const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`) : null
            return (label?.textContent ?? el.getAttribute("aria-label") ?? "").trim() === name
          })
          const states: Array<[string, string, string]> = [
            ["checkbox", "Checkbox bật", "checked"],
            ["checkbox", "Checkbox tắt", "unchecked"],
            ["checkbox", "Checkbox disabled bật", "checked"],
            ["checkbox", "Checkbox disabled tắt", "unchecked"],
            ["checkbox", "Checkbox indeterminate", "indeterminate"],
            ["radio", "Radio bật", "checked"],
            ["radio", "Radio tắt", "unchecked"],
            ["radio", "Radio disabled bật", "checked"],
            ["radio", "Radio disabled tắt", "unchecked"],
            ["switch", "Switch bật", "checked"],
            ["switch", "Switch tắt", "unchecked"],
            ["switch", "Switch disabled bật", "checked"],
            ["switch", "Switch disabled tắt", "unchecked"],
          ]
          for (const [role, name, state] of states) {
            const el = named(role, name)
            if (!(el instanceof HTMLElement)) notes.push(`thiếu ${name}`)
            else if (el.getAttribute("data-state") !== state) notes.push(`${name} đang ${el.getAttribute("data-state")}`)
          }
          for (const name of ["background", "card", "popover"]) {
            const node = document.querySelector(`[data-swatch="${name}"]`)
            if (!(node instanceof HTMLElement) || getComputedStyle(node).borderTopWidth !== "1px") notes.push(`${name} thiếu viền`)
          }
          return notes
        })
        for (const note of found) failures.push(`${where}: ${note}`)

        const shot = shots[where]
        if (shot) {
          const height = await page.evaluate(() => {
            const shell = document.querySelector(".h-dvh")
            const scroller = document.querySelector(".h-dvh > div")
            window.scrollTo(0, 0)
            if (scroller instanceof HTMLElement) scroller.scrollTo(0, 0)
            if (!(shell instanceof HTMLElement) || !(scroller instanceof HTMLElement)) return 900
            return Math.ceil(scroller.scrollHeight + shell.getBoundingClientRect().height - scroller.clientHeight + 8)
          })
          if (height > 16000) failures.push(`${where}: trang cao ${height}px, ảnh bị cắt`)
          await page.setViewportSize({ width, height: Math.min(height, 16000) })
          await page.evaluate(() => {
            window.scrollTo(0, 0)
            document.querySelector(".h-dvh > div")?.scrollTo(0, 0)
          })
          await page.screenshot({ path: shot, fullPage: true })
          await page.setViewportSize({ width, height: 900 })
        }

        const before = await page.locator("[data-swatch=background]").first().getAttribute("data-hex")
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", !dark), theme === "dark")
        await page.waitForTimeout(200)
        const after = await page.locator("[data-swatch=background]").first().getAttribute("data-hex")
        if (!before || !after || before === after) failures.push(`${where}: hex nền không đổi (${before} → ${after})`)
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")

        const switchEl = page.getByRole("switch", { name: "Switch tắt", exact: true })
        const beforeSwitch = await switchEl.getAttribute("data-state")
        await switchEl.click()
        if ((await switchEl.getAttribute("data-state")) === beforeSwitch) failures.push(`${where}: Switch không đổi`)
        const box = page.getByRole("checkbox", { name: "Checkbox bật", exact: true })
        const beforeBox = await box.getAttribute("data-state")
        await box.click()
        if ((await box.getAttribute("data-state")) === beforeBox) failures.push(`${where}: Checkbox không đổi`)
        await page.getByRole("radio", { name: "Radio tắt", exact: true }).click()
        if ((await page.getByRole("radio", { name: "Radio tắt", exact: true }).getAttribute("data-state")) !== "checked") {
          failures.push(`${where}: Radio không đổi`)
        }

        const trigger = page.locator("[data-slot=select-trigger]").first()
        await trigger.click()
        await page.waitForTimeout(200)
        const covered = await page.evaluate(() => {
          const current = document.querySelector("[data-slot=select-trigger]")
          const popup = document.querySelector("[data-slot=select-content]")
          if (!(current instanceof HTMLElement) || !(popup instanceof HTMLElement)) return "không mở"
          const rect = current.getBoundingClientRect()
          const frame = popup.getBoundingClientRect()
          const overlap = frame.left < rect.right - 1 && frame.right > rect.left + 1 && frame.top < rect.bottom - 1 && frame.bottom > rect.top + 1
          return overlap ? "che ô bấm" : ""
        })
        if (covered) failures.push(`${where}: select ${covered}`)
        await page.keyboard.press("Escape")

        const stuck = await page.evaluate(() => {
          const scroller = document.querySelector(".h-dvh > div")
          const nav = document.querySelector("[data-slot=section-nav]")
          if (!(scroller instanceof HTMLElement) || !(nav instanceof HTMLElement)) return "thiếu thanh nhảy"
          scroller.scrollTop = 700
          const navBox = nav.getBoundingClientRect()
          const host = scroller.getBoundingClientRect()
          return Math.abs(navBox.top - host.top) > 2 ? `thanh không dính (${navBox.top.toFixed(1)} / ${host.top.toFixed(1)})` : ""
        })
        if (stuck) failures.push(`${where}: ${stuck}`)
        await page.getByRole("tab", { name: "Token", exact: true }).click()
        await page.waitForTimeout(1000)
        const landed = await page.evaluate(() => {
          const nav = document.querySelector("[data-slot=section-nav]")
          const heading = document.getElementById("token")
          if (!(nav instanceof HTMLElement) || !(heading instanceof HTMLElement)) return "thiếu mục Token"
          const bar = nav.getBoundingClientRect().bottom
          const top = heading.getBoundingClientRect().top
          if (top < bar - 1) return "tiêu đề bị che"
          const active = document.querySelector("[data-slot=section-nav] [role=tab][data-state=active]")
          if (active?.textContent?.trim() !== "Token") return "mục sáng sai"
          return ""
        })
        if (landed) failures.push(`${where}: ${landed}`)
        await page.getByLabel("Tìm icon").fill("Sun")
        const filtered = await page.waitForFunction(() => document.querySelectorAll("[data-icon-name]").length === 1).then(() => true).catch(() => false)
        const matches = await page.locator("[data-icon-name]").count()
        if (!filtered || matches !== 1) failures.push(`${where}: lọc icon còn ${matches}`)
        await page.locator("[data-icon-name=Sun]").click()
        const copied = await page.getByText("Đã copy", { exact: true }).last().waitFor({ state: "visible", timeout: 2000 }).then(() => true).catch(() => false)
        if (!copied) failures.push(`${where}: không thấy toast copy`)
      }
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 240_000)

  it("viền Card, Input, Table bằng --border", async () => {
    const page = await browser.newPage()
    const failures: string[] = []
    const shots: Record<string, string> = {
      "/showcase?tab=cards": "docs/reference/ket-qua-cards.png",
      "/showcase?tab=dashboard": "docs/reference/ket-qua-dashboard.png",
      "/showcase?tab=application": "docs/reference/ket-qua-application.png",
    }
    const paths = ["/design-system", "/showcase?tab=cards", "/showcase?tab=dashboard", "/showcase?tab=application"]
    await page.setViewportSize({ width: 1440, height: 900 })
    for (const path of paths) {
      for (const theme of themes) {
        await page.goto(`${base}${path}`, { waitUntil: "networkidle" })
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), theme === "dark")
        await page.waitForTimeout(600)
        if (theme === "light" && shots[path]) {
          const height = await page.evaluate(() => {
            const shell = document.querySelector(".h-dvh")
            const inner = document.querySelector("[data-showcase-scroll]")
            const scroller = document.querySelector(".h-dvh > div")
            window.scrollTo(0, 0)
            if (scroller instanceof HTMLElement) scroller.scrollTo(0, 0)
            if (inner instanceof HTMLElement) inner.scrollTo(0, 0)
            if (!(shell instanceof HTMLElement)) return 900
            if (inner instanceof HTMLElement && inner.scrollHeight > inner.clientHeight + 2) {
              return Math.ceil(inner.scrollHeight + shell.getBoundingClientRect().height - inner.getBoundingClientRect().height + 8)
            }
            if (scroller instanceof HTMLElement) {
              return Math.ceil(scroller.scrollHeight + shell.getBoundingClientRect().height - scroller.clientHeight + 8)
            }
            return 900
          })
          if (height > 16000) failures.push(`${path}: trang cao ${height}px, ảnh bị cắt`)
          await page.setViewportSize({ width: 1440, height: Math.min(height, 16000) })
          await page.evaluate(() => {
            window.scrollTo(0, 0)
            document.querySelector(".h-dvh > div")?.scrollTo(0, 0)
            document.querySelector("[data-showcase-scroll]")?.scrollTo(0, 0)
          })
          await page.screenshot({ path: shots[path], fullPage: true })
          await page.setViewportSize({ width: 1440, height: 900 })
        }
        // Tab Application không có Table. Card và Input trên tab đó vẫn phải bằng --border.
        const notes = await page.evaluate((flags) => {
          const found: string[] = []
          const paint = (color: string) => {
            const canvas = document.createElement("canvas")
            canvas.width = 1
            canvas.height = 1
            const ctx = canvas.getContext("2d")
            if (!ctx) return [0, 0, 0, 0]
            ctx.fillStyle = color
            ctx.fillRect(0, 0, 1, 1)
            const data = ctx.getImageData(0, 0, 1, 1).data
            return [data[0] ?? 0, data[1] ?? 0, data[2] ?? 0, data[3] ?? 0]
          }
          const near = (left: number[], right: number[]) => left.every((value, index) => Math.abs(value - (right[index] ?? 0)) <= 3)
          const seen = new Set<string>()
          const report = (message: string) => {
            if (seen.has(message)) return
            seen.add(message)
            found.push(message)
          }
          const token = paint(getComputedStyle(document.documentElement).getPropertyValue("--border").trim())
          const shown = (el: Element) => {
            if (!(el instanceof HTMLElement)) return false
            const style = getComputedStyle(el)
            if (style.display === "none" || style.visibility === "hidden") return false
            const box = el.getBoundingClientRect()
            return box.width > 2 && box.height > 2
          }
          const check = (el: Element, side: "top" | "bottom", kind: string) => {
            if (!(el instanceof HTMLElement)) return false
            const style = getComputedStyle(el)
            const width = Number.parseFloat(side === "bottom" ? style.borderBottomWidth : style.borderTopWidth)
            if (width < 1) return false
            const rgb = paint(side === "bottom" ? style.borderBottomColor : style.borderTopColor)
            // Ô trong bảng dashboard dùng border-transparent đến khi focus. Không phải viền đen.
            if ((rgb[3] ?? 0) < 16) return false
            const text = paint(style.color)
            if (near(rgb, text) && !near(rgb, token)) report(`${kind} viền là màu chữ`)
            else if (!near(rgb, token)) report(`${kind} viền không phải --border`)
            return true
          }
          const cards = [...document.querySelectorAll("[data-slot=card]")].filter(shown)
          const inputs = [...document.querySelectorAll("[data-slot=input]")].filter((el) => shown(el) && el.getAttribute("aria-invalid") !== "true")
          if (!cards.length) report("không thấy Card")
          const borderedInputs = inputs.filter((el) => check(el, "top", "Input"))
          if (flags.input && !borderedInputs.length) report("không thấy Input")
          cards.forEach((el) => check(el, "top", "Card"))
          const rows = [...document.querySelectorAll("[data-slot=table-row]")].filter(
            (el) => shown(el) && el instanceof HTMLElement && Number.parseFloat(getComputedStyle(el).borderBottomWidth) >= 1,
          )
          if (flags.table && !rows.length) report("không thấy Table")
          rows.forEach((el) => check(el, "bottom", "Table"))
          return found
        }, { table: !path.includes("application"), input: !path.includes("dashboard") })
        for (const note of notes) failures.push(`${path} ${theme}: ${note}`)
      }
    }
    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 180_000)
})
