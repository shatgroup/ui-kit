import { useEffect, useRef, useState } from "react"
import { Stack } from "@/components/layout/index.ts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx"
import { isReduced } from "@/components/ui/theme-toggle.tsx"
import { Header, Tokens, TypeAndColor } from "./foundation.tsx"
import { Kit } from "./kit.tsx"

const SECTIONS = [
  { id: "nen-tang", label: "Nền tảng" },
  { id: "token", label: "Token" },
  { id: "hanh-dong", label: "Hành động" },
  { id: "nhap-lieu", label: "Nhập liệu" },
  { id: "phan-hoi", label: "Phản hồi" },
  { id: "du-lieu", label: "Dữ liệu" },
  { id: "icons", label: "Icons" },
] as const

function SectionNav() {
  const [active, setActive] = useState<(typeof SECTIONS)[number]["id"]>(SECTIONS[0].id)
  const lock = useRef(false)

  useEffect(() => {
    const nodes = SECTIONS.map((item) => document.getElementById(item.id)).filter((node) => node instanceof HTMLElement)
    const observer = new IntersectionObserver((entries) => {
      if (lock.current) return
      const hit = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      const id = hit?.target.id
      if (id && SECTIONS.some((item) => item.id === id)) setActive(id as (typeof SECTIONS)[number]["id"])
    }, { rootMargin: "-10% 0px -70% 0px", threshold: 0 })
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function choose(id: string) {
    if (!SECTIONS.some((item) => item.id === id)) return
    setActive(id as (typeof SECTIONS)[number]["id"])
    lock.current = true
    document.getElementById(id)?.scrollIntoView({ behavior: isReduced() ? "auto" : "smooth", block: "start" })
    window.setTimeout(() => { lock.current = false }, isReduced() ? 50 : 800)
  }

  return (
    <div data-slot="section-nav" className="sticky top-14 z-10 min-w-0 border-b border-border bg-background py-2">
      <div data-slot="section-nav-scroll" className="scrollbar-none min-w-0 overflow-x-auto md:overflow-x-visible">
        <Tabs value={active} onValueChange={choose} className="w-max md:w-fit">
          <TabsList>
            {SECTIONS.map((item) => (
              <TabsTrigger key={item.id} value={item.id}>{item.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

function DesignSystem() {
  return (
    <Stack gap={8} className="min-w-0">
      <Header />
      <SectionNav />
      <TypeAndColor />
      <Tokens />
      <Kit />
    </Stack>
  )
}

export { DesignSystem }
