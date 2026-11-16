import { useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { MenuIcon, PanelLeftIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { cn } from "@/lib/utils.ts"

export type AppNavItem = {
  id: string
  label: string
  icon: LucideIcon
}

export type AppNavGroup = {
  label: string
  items: AppNavItem[]
}

type AppShellProps = {
  logo: ReactNode
  groups: AppNavGroup[]
  activeId: string
  onNavigate: (id: string) => void
  topbar?: ReactNode
  children?: ReactNode
}

function NavButton({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: AppNavItem
  active: boolean
  collapsed: boolean
  onNavigate: (id: string) => void
}) {
  const Icon = item.icon
  const button = (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        collapsed && "w-10 px-0",
        active && "bg-sidebar-primary text-sidebar-primary-foreground",
      )}
      aria-current={active ? "page" : undefined}
      aria-label={item.label}
      onClick={() => onNavigate(item.id)}
    >
      <Icon className="size-4 shrink-0" />
      {collapsed ? null : item.label}
    </Button>
  )
  if (!collapsed) return button
  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent>{item.label}</TooltipContent>
    </Tooltip>
  )
}

function NavGroups({
  groups,
  activeId,
  collapsed,
  onNavigate,
}: {
  groups: AppNavGroup[]
  activeId: string
  collapsed: boolean
  onNavigate: (id: string) => void
}) {
  return (
    <Stack gap={4}>
      {groups.map((group) => (
        <Stack key={group.label} gap={1}>
          {collapsed ? null : (
            <Text size="sm" tone="muted" weight="medium">
              {group.label}
            </Text>
          )}
          {group.items.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={item.id === activeId}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </Stack>
      ))}
    </Stack>
  )
}

export function AppShell({ logo, groups, activeId, onNavigate, topbar, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Box className="min-h-dvh">
      <Inline align="stretch" wrap={false} className="min-h-dvh">
        <Box tone="card" border className={cn("hidden shrink-0 md:block", collapsed ? "w-16" : "w-60")}>
          <Stack gap={4} className="h-dvh p-3">
            <Inline align="center" justify={collapsed ? "center" : "start"}>
              {logo}
            </Inline>
            <Box className="min-h-0 flex-1 overflow-y-auto">
              <NavGroups groups={groups} activeId={activeId} collapsed={collapsed} onNavigate={onNavigate} />
            </Box>
            <Button
              variant="ghost"
              className={cn("w-full justify-start", collapsed && "w-10 px-0")}
              aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
              onClick={() => setCollapsed((value) => !value)}
            >
              <PanelLeftIcon className="size-4" />
              {collapsed ? null : "Thu gọn"}
            </Button>
          </Stack>
        </Box>
        <Stack gap={4} className="min-w-0 flex-1 p-4">
          <Inline gap={2} align="center" justify="between">
            <Inline gap={2} align="center" className="min-w-0">
              <Button
                variant="outline"
                className="w-10 px-0 md:hidden"
                aria-label="Mở menu"
                onClick={() => setMenuOpen(true)}
              >
                <MenuIcon className="size-4" />
              </Button>
              {topbar}
            </Inline>
          </Inline>
          <Box className="min-w-0 flex-1">{children}</Box>
        </Stack>
      </Inline>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <SheetBody>
            <NavGroups
              groups={groups}
              activeId={activeId}
              collapsed={false}
              onNavigate={(id) => {
                onNavigate(id)
                setMenuOpen(false)
              }}
            />
          </SheetBody>
        </SheetContent>
      </Sheet>
    </Box>
  )
}
