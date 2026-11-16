import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const root = process.cwd()
const src = path.join(root, "src")
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
  return rel.startsWith("src/components/layout/") || rel.startsWith("src/styles/")
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length
}

function report(file, line, message) {
  const rel = path.relative(root, file).split(path.sep).join("/")
  errors.push(`${rel}:${line}: ${message}`)
}

function normalize(token) {
  const parts = token.trim().split(":")
  return parts[parts.length - 1].replace(/^!/, "").replace(/!$/, "")
}

function checkClass(file, line, token) {
  const value = normalize(token)
  if (!value) return
  if (margin.test(value)) {
    report(file, line, "Dùng gap của Stack/Inline thay vì margin")
  }
  if (!value.includes("${") && /\[[^\]]+\]/.test(value)) {
    report(file, line, "Giá trị tuỳ ý trong className")
  }
  const space = value.match(spacing)
  if (space && !scale.has(space[1])) {
    report(file, line, "Khoảng cách ngoài thang 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16")
  }
  if (shadedColor.test(value) || plainColor.test(value)) {
    report(file, line, "Dùng token màu, không dùng màu Tailwind mặc định")
  }
}

for (const file of walk(src)) {
  if (skipped(file)) continue
  const source = readFileSync(file, "utf8")
  const lines = source.split("\n")
  lines.forEach((line, index) => {
    const lineNo = index + 1
    if (/#[0-9A-Fa-f]{3,8}\b/.test(line)) {
      report(file, lineNo, "Không ghi mã màu trong file tsx")
    }
    if (/\brgb\s*\(/.test(line) || /\bhsl\s*\(/.test(line)) {
      report(file, lineNo, "Không ghi mã màu trong file tsx")
    }
    if (/style=\{\{/.test(line)) {
      report(file, lineNo, "Không dùng inline style")
    }
  })

  for (const match of source.matchAll(stringLiteral)) {
    const body = match[0].slice(1, -1)
    const line = lineOf(source, match.index)
    for (const token of body.split(/\s+/)) checkClass(file, line, token)
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"))
  process.exit(1)
}

console.log("check:ui: 0 lỗi")
