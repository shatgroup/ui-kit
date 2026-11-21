const iconImport = /import \{ IconPlaceholder \} from ["']@\/app\/\(create\)\/components\/icon-placeholder["'];?\r?\n/

function adaptUi(text) {
  const names = []
  let next = text
    .replaceAll('from "@/registry/radix-nova/ui/', 'from "@/components/ui/')
    .replaceAll('from "@/registry/radix-nova/hooks/', 'from "@/hooks/')
    .replaceAll('from "@/registry/new-york-v4/ui/', 'from "@/components/ui/')
    .replaceAll('from "@/registry/new-york-v4/hooks/', 'from "@/hooks/')
  next = next.replace(/<IconPlaceholder\b([\s\S]*?)\/>/g, (_match, inner) => {
    const lucide = inner.match(/\blucide="([^"]+)"/)?.[1]
    if (!lucide) throw new Error("IconPlaceholder thiếu lucide")
    names.push(lucide)
    const cleaned = inner
      .replace(/^[ \t]*lucide="[^"]*"\r?\n?/gm, "")
      .replace(/^[ \t]*tabler="[^"]*"\r?\n?/gm, "")
      .replace(/^[ \t]*hugeicons="[^"]*"\r?\n?/gm, "")
      .replace(/^[ \t]*phosphor="[^"]*"\r?\n?/gm, "")
      .replace(/^[ \t]*remixicon="[^"]*"\r?\n?/gm, "")
    return `<${lucide}${cleaned}/>`
  })
  if (!names.length) return next
  const unique = []
  for (const name of names) if (!unique.includes(name)) unique.push(name)
  const line = `import { ${unique.join(", ")} } from "lucide-react"\n`
  if (!iconImport.test(next)) throw new Error("thiếu import IconPlaceholder")
  return next.replace(iconImport, line)
}

export { adaptUi }
