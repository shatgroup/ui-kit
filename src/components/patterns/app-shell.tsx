import { useState, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { MenuIcon, MoreVerticalIcon, PanelLeftIcon } from "lucide-react"
import { Box, Inline, Stack, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import { Separator } from "@/components/ui/separator.tsx"
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
  mark?: ReactNode
  groups: AppNavGroup[]
  activeId: string
  onNavigate: (id: string) => void
  leading?: ReactNode
  topbar?: ReactNode
  footer?: ReactNode
  sidebarAction?: ReactNode
  account?: { name: string; email: string }
  title?: string
  inset?: boolean
  maxWidth?: boolean
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
        collapsed && "size-8! w-8! justify-center p-0!",
        active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
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
      <TooltipContent side="right">{item.label}</TooltipContent>
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

export function AppShell({ logo, mark, groups, activeId, onNavigate, leading, topbar, footer, sidebarAction, account, title, inset = false, maxWidth = true, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <Box className={cn(inset ? "flex h-full bg-muted p-2" : "min-h-dvh")}>
      <Inline align="stretch" wrap={false} className={cn(inset ? "min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl border border-border bg-background" : "min-h-dvh")}>
        <Box slot="sidebar" border className={cn("sticky top-0 hidden shrink-0 bg-sidebar text-sidebar-foreground md:block", collapsed ? "w-12" : "w-60", inset ? "h-full" : "h-dvh")}>
          <Stack gap={4} align={collapsed ? "center" : "stretch"} className={cn("h-full", collapsed ? "p-2" : "p-3")}>
            <span className={cn("flex items-center whitespace-nowrap", collapsed && "size-8 justify-center overflow-hidden")}>
              {collapsed ? (mark ?? logo) : logo}
            </span>
            {sidebarAction}
            <Box className="min-h-0 flex-1 overflow-y-auto">
              <NavGroups groups={groups} activeId={activeId} collapsed={collapsed} onNavigate={onNavigate} />
            </Box>
            {footer}
            {account && !collapsed ? (
              <Inline gap={2} align="center" justify="between" wrap={false}>
                <Stack gap={0} className="min-w-0">
                  <Text size="sm" weight="medium">{account.name}</Text>
                  <Text size="xs" tone="muted">{account.email}</Text>
                </Stack>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="size-8 p-0" aria-label={`Menu ${account.name}`} />}>
                    <MoreVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Inline>
            ) : null}
            {inset ? null : (
              <Button
                variant="ghost"
                className={cn("w-full justify-start", collapsed && "size-8! w-8! justify-center p-0!")}
                aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
                onClick={() => setCollapsed((value) => !value)}
              >
                <PanelLeftIcon className="size-4" />
                {collapsed ? null : "Thu gọn"}
              </Button>
            )}
          </Stack>
        </Box>
        <Box className="flex min-w-0 flex-1 justify-center">
          <Stack gap={4} className={cn("min-h-dvh w-full p-4", maxWidth && "max-w-page")}>
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
                {inset ? (
                  <Inline gap={2} align="center" className="hidden md:flex">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 p-0"
                      aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
                      onClick={() => setCollapsed((value) => !value)}
                    >
                      <PanelLeftIcon className="size-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-4" />
                    <Text weight="medium">{title}</Text>
                  </Inline>
                ) : null}
                {leading}
              </Inline>
              {topbar}
            </Inline>
            <Box className="min-w-0 flex-1">{children}</Box>
          </Stack>
        </Box>
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
