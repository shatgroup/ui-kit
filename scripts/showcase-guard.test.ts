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
    const exampleCard = el.closest("[data-showcase-scroll] [data-slot=card]")
    if (painted && !el.closest("[data-force-state=focus]") && !exampleCard) failures.push(`còn shadow: ${el.tagName}`)
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
              const radioChecked = await page.getByRole("radio", { name: "Unchecked", exact: true }).getAttribute("data-state")
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
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${base}/showcase?tab=cards`, { waitUntil: "networkidle" })
    const calendar = await page.evaluate(() => {
      const notes: string[] = []
      const roots = [...document.querySelectorAll(".rdp-root")].filter((el) => {
        const box = el.getBoundingClientRect()
        return box.width > 2 && box.height > 2
      })
      if (!roots.length) return ["không thấy lịch"]
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
    })
    for (const note of calendar) failures.push(`calendar: ${note}`)

    const rangeButton = page.getByRole("button", { name: /Jan|Pick a date/ }).first()
    await rangeButton.click()
    await page.waitForTimeout(300)
    const range = await page.evaluate(() => {
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
      if (!sideBySide) notes.push("2 tháng không xếp cạnh nhau")
      return notes
    })
    for (const note of range) failures.push(`khoảng ngày: ${note}`)

    const selects = await page.evaluate(() => {
      const expected = ["Can edit", "Billing", "Severity 2"]
      const triggers = [...document.querySelectorAll("[data-slot=select-trigger]")].filter((el) => el.getBoundingClientRect().width > 2)
      const texts = triggers.map((el) => el.textContent?.replace(/\s+/g, " ").trim() ?? "")
      return expected.filter((label) => !texts.some((text) => text.includes(label))).map((label) => `thiếu nhãn ${label} (đang có: ${texts.join(" | ")})`)
    })
    for (const note of selects) failures.push(`select: ${note}`)

    await page.goto(`${base}/showcase?tab=dashboard`, { waitUntil: "networkidle" })
    await page.waitForTimeout(1600)
    const sidebar = await page.evaluate(() => {
      const bar = [...document.querySelectorAll("a, button")].find((el) => el.textContent?.trim() === "Design System")
      const side = document.querySelector("[data-slot=sidebar-container]")
      if (!(bar instanceof HTMLElement) || !(side instanceof HTMLElement)) return "không thấy thanh trên hoặc sidebar"
      const top = bar.getBoundingClientRect()
      const box = side.getBoundingClientRect()
      const overlap = box.top < top.bottom - 1 && box.bottom > top.top + 1 && box.left < top.right - 1 && box.right > top.left + 1
      return overlap ? `sidebar đè thanh trên (${box.top.toFixed(0)} < ${top.bottom.toFixed(0)})` : ""
    })
    if (sidebar) failures.push(sidebar)

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
    if (badge) failures.push(`tab: ${badge}`)

    const ranges = ["Last 3 months", "Last 30 days", "Last 7 days"]
    for (const name of ranges) {
      const item = page.getByRole("radio", { name, exact: true })
      if (await item.count()) await item.click()
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
      if (chart) failures.push(`chart: ${chart}`)
    }

    await page.close()
    expect(failures, failures.join("\n")).toEqual([])
  }, 60_000)
})
