import { useLayoutEffect, useState, type ComponentType } from "react"
import { Blend, Blocks, ChevronRight, Clapperboard, LayoutTemplate, Package, Workflow } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import type { NavItem } from "./command-menu.tsx"

const GROUP_ICON: Record<string, ComponentType<{ className?: string }>> = {
  Components: Blocks,
  Kit: Package,
  Flow: Workflow,
  Patterns: LayoutTemplate,
  Streaming: Clapperboard,
  Utils: Blend,
}

const SCROLL_KEY = "docs-sidebar-scroll"
const OPEN_KEY = "docs-sidebar-open"

function readOpen() {
  const raw = sessionStorage.getItem(OPEN_KEY)
  if (!raw?.startsWith("[")) return []
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) return []
  return parsed.filter((item) => typeof item === "string")
}

function writeOpen(names: string[]) {
  sessionStorage.setItem(OPEN_KEY, JSON.stringify(names))
}

function sidebarScroller() {
  return document.querySelector<HTMLElement>("[data-docs-sidebar-content]")
}

function keepSidebarPlace(node: HTMLElement) {
  const active = node.querySelector<HTMLElement>('[data-active="true"]')
  if (!active) return
  const frame = node.getBoundingClientRect()
  const item = active.getBoundingClientRect()
  if (item.top < frame.top) node.scrollTop -= frame.top - item.top
  else if (item.bottom > frame.bottom) node.scrollTop += item.bottom - frame.bottom
}

function DocsGroup({
  name,
  items,
  pathname,
}: {
  name: string
  items: NavItem[]
  pathname: string
}) {
  const contains = items.some((item) => item.href === pathname)
  const [open, setOpen] = useState(() => contains || readOpen().includes(name))

  function toggle(next: boolean) {
    setOpen(next)
    const names = new Set(readOpen())
    if (next) names.add(name)
    else names.delete(name)
    writeOpen([...names])
  }

  const Icon = GROUP_ICON[name]
  return (
    <Collapsible open={open} onOpenChange={toggle} className="group/collapsible" asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {Icon ? <Icon /> : null}
            <span>{name}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton asChild isActive={item.href === pathname}>
                  <a
                    href={item.href}
                    onClick={() => {
                      const node = sidebarScroller()
                      if (node) sessionStorage.setItem(SCROLL_KEY, String(node.scrollTop))
                    }}
                  >
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function DocsSidebar({ groups, pathname }: { groups: { name: string; items: NavItem[] }[]; pathname: string }) {
  useLayoutEffect(() => {
    const node = sidebarScroller()
    if (!node) return
    const saved = Number(sessionStorage.getItem(SCROLL_KEY))
    if (Number.isFinite(saved)) node.scrollTop = saved
    keepSidebarPlace(node)
  }, [pathname])

  return (
    <Sidebar
      className="h-full w-full bg-transparent"
      collapsible="none"
    >
      <SidebarContent
        data-docs-sidebar-content=""
        className="w-full scroll-fade scrollbar-none overflow-x-hidden"
      >
        <SidebarGroup className="pt-6 lg:pt-8">
          <SidebarMenu>
            {groups.map((group) => (
              <DocsGroup key={group.name} name={group.name} items={group.items} pathname={pathname} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export { DocsSidebar }
