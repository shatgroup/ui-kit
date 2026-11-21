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
  const body = text.replace(/import[\s\S]*?from\s+["'][^"']+["'];?\r?\n/g, "")
  const used = (name) => new RegExp(`\\b${name}\\b`).test(body)
  let next = text.replace(/import\s+(type\s+)?\{([\s\S]*?)\}\s+from\s+(["'][^"']+["']);?/g, (full, typeKw, inner, from) => {
    const specs = inner.split(",").map((item) => item.trim()).filter(Boolean)
    const kept = specs.filter((spec) => used(spec.replace(/^type\s+/, "").split(/\s+as\s+/).pop().trim()))
    if (!kept.length) return ""
    if (kept.length === specs.length) return full
    return `import ${typeKw ?? ""}{ ${kept.join(", ")} } from ${from}`
  })
  next = next.replace(/^import\s+(\w+)\s+from\s+["'][^"']+["'];?\r?\n/gm, (full, name) => used(name) ? full : "")
  next = next.replace(/^import \* as (\w+) from ["'][^"']+["'];?\r?\n/gm, (full, name) => used(name) ? full : "")
  return next
}

function replaceNextImage(text) {
  if (!text.includes("next/image")) return text
  let next = text.replace(/^import Image from ["']next\/image["'];?\r?\n/, "")
  next = next.replace(/\r?\nimport Image from ["']next\/image["'];?/, "")
  next = next.replace(/<Image\b([^>]*?)(\/?)>/g, (_match, attrs, slash) => {
    const hasFill = /\bfill\b/.test(attrs)
    let kept = attrs.replace(/\s+fill\b/g, "")
    if (hasFill) {
      const classMatch = kept.match(/className="([^"]*)"/)
      if (classMatch) {
        kept = kept.replace(classMatch[0], `className="${classMatch[1]} absolute inset-0 size-full"`)
      } else {
        kept += ` className="absolute inset-0 size-full"`
      }
    }
    return `<img${kept}${slash}>`
  })
  return next.replaceAll("</Image>", "</img>")
}

function adapt(text) {
  let next = text.replace(importUi, (_match, quote, name) => `from ${quote}@/components/ui/${name}.tsx${quote}`)
  next = next.replace(hookImport, (_match, quote, name) => `from ${quote}@/hooks/${name}.ts${quote}`)
  next = next.replace(linkImport, "")
  next = next.replaceAll("<Link", "<a").replaceAll("</Link>", "</a>")
  next = next.replace(/from (["'])@\/registry\/icons\/__lucide__\1/g, "from \"lucide-react\"")
  next = replaceNextImage(next)
  next = rewriteHeaderImports(next)
  next = stripUnusedImports(next)
  if (!/\bindex\b/.test(next.replace("(person, index)", ""))) {
    next = next.replace("(person, index)", "(person)")
  }
  return next
}

export { adapt }
