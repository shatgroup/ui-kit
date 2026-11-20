const shadow = /(?:[\w-]+:)*shadow-(?!none\b)[\w./[\]-]+/g
const importUi = /from (["'])@\/(?:styles\/radix-(?:nova|rhea)|registry\/(?:new-york-v4|radix-nova))\/ui\/([^"']+)\1/g
const hookImport = /from (["'])@\/registry\/bases\/radix\/hooks\/([^"']+)\1/g
const linkImport = /^import Link from ["']next\/link["'];?\n/m

function rewriteHeaderImports(text) {
  const lines = text.split("\n")
  let header = true
  let sawImport = false
  return lines.map((line) => {
    if (!header) return line
    if (line.trim() === "" || line === "\"use client\"" || line === "'use client'") return line
    if (line.startsWith("import ") || (sawImport && /^[\s}]/.test(line))) {
      sawImport = true
      return line
        .replaceAll("from \"@ai-sdk/react\"", "from \"@/lib/ai.ts\"")
        .replaceAll("from \"ai\"", "from \"@/lib/ai.ts\"")
        .replaceAll("from \"streamdown\"", "from \"@/components/markdown.tsx\"")
    }
    if (sawImport || line.trim()) header = false
    return line
  }).join("\n")
}

function stripUnusedImports(text) {
  const lines = text.split("\n")
  const body = lines.filter((line) => !line.startsWith("import ")).join("\n")
  const used = (name) => new RegExp(`\\b${name}\\b`).test(body)
  const next = []
  for (const line of lines) {
    if (line.startsWith("import * as React ") && !used("React")) continue
    const named = line.match(/^import\s+(type\s+)?\{([^}]+)\}\s+from\s+(.+)$/)
    if (!named) {
      const fallback = line.match(/^import\s+(\w+)\s+from\s+/)
      if (fallback && !used(fallback[1])) continue
      next.push(line)
      continue
    }
    const specs = named[2].split(",").map((item) => item.trim()).filter(Boolean)
    const kept = specs.filter((spec) => used(spec.replace(/^type\s+/, "").split(/\s+as\s+/).pop().trim()))
    if (!kept.length) continue
    if (kept.length === specs.length) next.push(line)
    else next.push(`import ${named[1] ?? ""}{ ${kept.join(", ")} } from ${named[3]}`)
  }
  return next.join("\n").replace(/\n{3,}/g, "\n\n")
}

const tablerToLucide = {
  IconBell: "BellIcon",
  IconBrandJavascript: "FileCodeIcon",
  IconCheck: "CheckIcon",
  IconCloud: "CloudIcon",
  IconCopy: "CopyIcon",
  IconCornerDownLeft: "CornerDownLeftIcon",
  IconFolderCode: "FolderCodeIcon",
  IconGitBranch: "GitBranchIcon",
  IconInfoCircle: "InfoIcon",
  IconPlus: "PlusIcon",
  IconRefresh: "RefreshCwIcon",
  IconStar: "StarIcon",
}

function replaceNextImage(text) {
  if (!text.includes("next/image")) return text
  let next = text.replace(/^import Image from ["']next\/image["'];?\r?\n/, "")
  next = next.replace(/\r?\nimport Image from ["']next\/image["'];?/, "")
  next = next.replace(/<Image\b([^>]*?)(\/?)>/g, (_match, attrs, slash) => {
    const kept = attrs
      .replace(/\s+fill\b/g, "")
      .replace(/\s+width=\{[^}]*\}/g, "")
      .replace(/\s+height=\{[^}]*\}/g, "")
    return `<img${kept}${slash}>`
  })
  return next.replaceAll("</Image>", "</img>")
}

function replaceTabler(text) {
  const match = text.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']@tabler\/icons-react["'];?\r?\n/)
  if (!match) return text
  const names = match[1].split(",").map((item) => item.trim()).filter(Boolean)
  const missing = names.filter((name) => !tablerToLucide[name])
  if (missing.length) throw new Error(`Tabler chưa có Lucide: ${missing.join(", ")}`)
  const lucideNames = names.map((name) => tablerToLucide[name])
  let next = text.replace(match[0], "")
  for (const name of names) next = next.replaceAll(name, tablerToLucide[name])
  const lucideImport = next.match(/import\s*\{([^}]*)\}\s*from\s*["']lucide-react["'];?/)
  if (lucideImport) {
    const existing = lucideImport[1].split(",").map((item) => item.trim()).filter(Boolean)
    const merged = [...existing]
    for (const name of lucideNames) if (!merged.includes(name)) merged.push(name)
    next = next.replace(lucideImport[0], `import { ${merged.join(", ")} } from "lucide-react"`)
  } else {
    const line = `import { ${lucideNames.join(", ")} } from "lucide-react"\n`
    const client = next.match(/^(["']use client["'];?\r?\n(?:\r?\n)?)/)
    next = client ? next.replace(client[0], `${client[0]}${line}`) : `${line}${next}`
  }
  return next
}

function replaceHijriFont(text) {
  if (!text.includes("next/font/google")) return text
  let next = text.replace(/^import \{ Vazirmatn \} from ["']next\/font\/google["'];?\r?\n/m, "")
  next = next.replace(/\r?\nconst vazirmatn = Vazirmatn\(\{ subsets: \["arabic"\] \}\)\r?\n/, "\n")
  next = next.replace("<div className={vazirmatn.className}>", "<div>")
  return next.replace(/from (["'])react-day-picker\/persian\1/g, "from $1react-day-picker$1")
}

function adapt(text) {
  let next = text.replace(importUi, (_match, quote, name) => `from ${quote}@/components/ui/${name}.tsx${quote}`)
  next = next.replace(hookImport, (_match, quote, name) => `from ${quote}@/hooks/${name}.ts${quote}`)
  next = next.replace(linkImport, "")
  next = next.replaceAll("<Link", "<a").replaceAll("</Link>", "</a>")
  next = next.replace(/from (["'])@\/registry\/icons\/__lucide__\1/g, "from \"lucide-react\"")
  next = next.replace(/import TextareaAutosize from ["']react-textarea-autosize["']\r?\n\r?\n?/, "")
  next = next.replaceAll("<TextareaAutosize", "<textarea").replaceAll("</TextareaAutosize>", "</textarea>")
  next = next.replace(/<Card\b([^>]*)\ssize="sm"/g, "<Card$1")
  next = next.replace(/<Item\b([^>]*)\ssize="xs"/g, "<Item$1 size=\"sm\"")
  next = next.replaceAll("<AlertAction>", "<div className=\"absolute top-2 right-2\">")
  next = next.replaceAll("</AlertAction>", "</div>")
  next = next.replace(/^[ \t]*AlertAction,\r?\n/m, "")
  if (!next.includes("<ItemSeparator")) next = next.replace(/^[ \t]*ItemSeparator,\r?\n/m, "")
  if (next.includes("export function ItemGroupExample")) next = next.replace("(person, index)", "(person)")
  next = replaceNextImage(next)
  next = replaceTabler(next)
  next = replaceHijriFont(next)
  next = rewriteHeaderImports(next)
  next = stripUnusedImports(next)
  next = next.replace(shadow, "")
  return next
}

export { adapt }
