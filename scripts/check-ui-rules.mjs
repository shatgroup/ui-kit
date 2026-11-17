import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const root = process.cwd()
const src = path.join(root, "src")
// Khớp docs/STANDARD.md. Không thêm mức nếu chưa được duyệt.
const scale = new Set(["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16"])
const palette =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose"
const utility =
  "bg|text|border|fill|stroke|from|to|via|outline|decoration|divide|accent|caret|ring|shadow"
const shadedColor = new RegExp(`^(?:${utility})-(?:${palette})-\\d{2,3}$`)
const plainColor = new RegExp(`^(?:${utility})-(?:black|white)$`)
const spacing = /^(?:gap(?:-[xy])?|px|py|p|space(?:-[xy])?)-(.+)$/
const margin = /^-?m[trblxy]?-/
const stringLiteral = /`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g

const errors = []
const exceptions = []
const uiArbitrary = []

function walk(dir) {
  const files = []
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else if (name.endsWith(".tsx")) files.push(full)
  }
  return files
}

function skipped(file) {
  const rel = path.relative(root, file).split(path.sep).join("/")
  return (
    rel.startsWith("src/components/layout/") ||
    rel.startsWith("src/styles/") ||
    rel.startsWith("src/showcase/tweakcn/")
  )
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length
}

function hexOutsideSelector(line) {
  let depth = 0
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === "[") depth += 1
    else if (char === "]" && depth > 0) depth -= 1
    else if (char === "#" && depth === 0 && /^[0-9A-Fa-f]{3,8}\b/.test(line.slice(index + 1))) return true
  }
  return false
}

function report(file, line, message) {
  const rel = path.relative(root, file).split(path.sep).join("/")
  if (message.startsWith("Giá trị tuỳ ý") && rel.startsWith("src/components/ui/")) {
    uiArbitrary.push(`${rel}:${line}: ${message}`)
    return
  }
  errors.push(`${rel}:${line}: ${message}`)
}

function normalize(token) {
  const parts = token.trim().split(":")
  return parts[parts.length - 1].replace(/^!/, "").replace(/!$/, "")
}

function checkClass(file, line, token) {
  if (ignoredLine(file, line)) return
  const rel = path.relative(root, file).split(path.sep).join("/")
  const value = normalize(token)
  if (!value) return
  if (rel.startsWith("src/components/ui/") || rel.startsWith("src/components/flow/")) {
    if (/^shadow-(?!none(?:$|:))/.test(value)) {
      report(file, line, "Không dùng shadow, popup dùng viền")
    }
    if (rel.startsWith("src/components/flow/") && (shadedColor.test(value) || plainColor.test(value))) {
      report(file, line, "Dùng token màu, không dùng màu Tailwind mặc định")
    }
    return
  }
  if (margin.test(value)) {
    report(file, line, "Dùng gap của Stack/Inline thay vì margin")
  }
  if (!token.includes("${") && /\[[^\]]+\]/.test(token)) {
    report(file, line, "Giá trị tuỳ ý trong className")
  }
  const space = value.match(spacing)
  if (space && !scale.has(space[1])) {
    report(file, line, "Khoảng cách ngoài thang 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16")
  }
  if (shadedColor.test(value) || plainColor.test(value)) {
    report(file, line, "Dùng token màu, không dùng màu Tailwind mặc định")
  }
  if (rel.startsWith("src/pages/") && /^(?:bg-|rounded-|shadow-(?!none(?:$|:))|border(?:-|$)|text-(?:primary|muted|foreground|destructive|success|warning|info|chart|background|card|popover|secondary|accent|sidebar|badge|white|black))/.test(value)) {
    report(file, line, "Trang không chứa class trang trí")
  }
  if (/^shadow-(?!none(?:$|:))/.test(value)) {
    report(file, line, "Không dùng shadow, popup dùng viền")
  }
  if (frameFile(rel) && /grid-cols-/.test(value)) {
    report(file, line, "Dùng Grid, không dùng grid-cols tự do")
  }
}

function frameFile(rel) {
  return (rel.startsWith("src/pages/") || rel.startsWith("src/components/patterns/")) && !rel.includes("/showcase/")
}

const ignored = new Map()

function ignoredLine(file, line) {
  return ignored.get(file)?.has(line) ?? false
}

const stylesDir = path.join(src, "styles")
for (const name of readdirSync(stylesDir)) {
  if (!name.endsWith(".css")) continue
  const file = path.join(stylesDir, name)
  const rel = path.relative(root, file).split(path.sep).join("/")
  const lines = readFileSync(file, "utf8").split("\n")
  lines.forEach((line, index) => {
    const mark = line.match(/check-ui-ignore:\s*(.*)$/)
    if (mark) exceptions.push(`${rel}:${index + 1}: ${mark[1].replace(/\*\/\s*$/, "").trim() || "không ghi lý do"}`)
    if (/\[data-slot(?:=|])/.test(line)) {
      report(file, index + 1, "Style component phải nằm trong file component, không dùng [data-slot] trong CSS")
    }
  })
}

for (const file of walk(src)) {
  if (skipped(file)) continue
  const source = readFileSync(file, "utf8")
  const lines = source.split("\n")
  const rel = path.relative(root, file).split(path.sep).join("/")
  const skip = new Set()
  lines.forEach((line, index) => {
    const mark = line.match(/check-ui-ignore-next-line:\s*(.*)$/)
    if (!mark) return
    const target = index + 2
    skip.add(target)
    exceptions.push(`${rel}:${target}: ${mark[1].replace(/\*\/\s*$/, "").trim() || "không ghi lý do"}`)
  })
  ignored.set(file, skip)

  const inUi = rel.startsWith("src/components/ui/")
  const inFlow = rel.startsWith("src/components/flow/")
  lines.forEach((line, index) => {
    const lineNo = index + 1
    if (skip.has(lineNo) || inUi) return
    if (inFlow) {
      if (hexOutsideSelector(line)) report(file, lineNo, "Không ghi mã màu trong file tsx")
      if (/\brgb\s*\(/.test(line) || /\bhsl\s*\(/.test(line)) report(file, lineNo, "Không ghi mã màu trong file tsx")
      return
    }
    if (hexOutsideSelector(line)) {
      report(file, lineNo, "Không ghi mã màu trong file tsx")
    }
    if (/\brgb\s*\(/.test(line) || /\bhsl\s*\(/.test(line)) {
      report(file, lineNo, "Không ghi mã màu trong file tsx")
    }
    if (/style=\{\{/.test(line)) {
      report(file, lineNo, "Không dùng inline style")
    }
    if (!inUi && /\btransition-all\b/.test(line)) {
      report(file, lineNo, "Không dùng transition-all, ghi rõ thuộc tính")
    }
    if (!inUi && (/\d+ms\b/.test(line) || /cubic-bezier\(/.test(line))) {
      report(file, lineNo, "Thời lượng và easing chỉ dùng token CSS")
    }
    if (!inUi && /<(button|input|select|textarea)\b/.test(line)) {
      report(file, lineNo, "Dùng component kit, không dùng phần tử HTML thô")
    }
  })

  for (const match of source.matchAll(stringLiteral)) {
    const body = match[0].slice(1, -1)
    const line = lineOf(source, match.index)
    if (frameFile(rel) && /\bkit-grid\b/.test(body)) {
      for (const token of body.split(/\s+/)) {
        const gap = normalize(token).match(/^gap-(.+)$/)
        if (gap && gap[1] !== "4") report(file, line, "Lưới card chỉ dùng gap-4")
      }
    }
    for (const token of body.split(/\s+/)) checkClass(file, line, token)
  }

  if (frameFile(rel)) {
    for (const match of source.matchAll(/<Grid\b[^>]*kit-grid[^>]*>/g)) {
      const gap = match[0].match(/\bgap=\{(\d+)\}/)
      if (gap && gap[1] !== "4") report(file, lineOf(source, match.index), "Lưới card chỉ dùng gap-4")
    }
  }
}

if (uiArbitrary.length > 0) {
  console.log(`check:ui ui: ${uiArbitrary.length} giá trị tuỳ ý`)
}

if (exceptions.length > 0) {
  console.log(`check:ui: ${exceptions.length} ngoại lệ`)
  console.log(exceptions.join("\n"))
}

if (errors.length > 0) {
  console.error(errors.join("\n"))
  console.error(`check:ui: ${errors.length} lỗi, ${exceptions.length} ngoại lệ`)
  process.exit(1)
}

console.log(`check:ui: 0 lỗi, ${exceptions.length} ngoại lệ`)
