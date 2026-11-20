import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { MoreVerticalIcon } from "lucide-react"
import { Box, Inline, Text } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar.tsx"
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
  sidebarAction?: ReactNode | ((collapsed: boolean) => ReactNode)
  account?: { name: string; email: string }
  title?: string
  inset?: boolean
  maxWidth?: boolean
  children?: ReactNode
  collapseLabel?: string
  collapseAriaLabel?: string
  expandLabel?: string
  menuLabel?: string
  bottomNav?: ReactNode
}

function ShellTrigger({
  collapseAriaLabel,
  expandLabel,
  menuLabel,
}: {
  collapseAriaLabel: string
  expandLabel: string
  menuLabel: string
}) {
  const { isMobile, state } = useSidebar()
  const label = isMobile ? menuLabel : state === "collapsed" ? expandLabel : collapseAriaLabel
  return <SidebarTrigger aria-label={label} />
}

function ShellSidebar({
  logo,
  mark,
  groups,
  activeId,
  onNavigate,
  footer,
  sidebarAction,
  account,
}: Pick<AppShellProps, "logo" | "mark" | "groups" | "activeId" | "onNavigate" | "footer" | "sidebarAction" | "account">) {
  const { state, isMobile, setOpenMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  const action = typeof sidebarAction === "function" ? sidebarAction(collapsed) : sidebarAction

  function choose(id: string) {
    onNavigate(id)
    if (isMobile) setOpenMobile(false)
  }

  return (
    <>
      <SidebarHeader>
        <span className={cn("flex h-8 items-center px-2", collapsed && "justify-center px-0")}>
          {collapsed ? (
            <span className="flex size-8 items-center justify-center overflow-hidden">{mark ?? logo}</span>
          ) : logo}
        </span>
        {action}
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon
                  const active = item.id === activeId
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={item.label}
                        aria-label={item.label}
                        aria-current={active ? "page" : undefined}
                        onClick={() => choose(item.id)}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {footer}
        {account ? (
          <Inline gap={2} align="center" justify={collapsed ? "center" : "between"} wrap={false}>
            {collapsed ? null : (
              <span className="min-w-0">
                <Text size="sm" weight="medium">{account.name}</Text>
                <Text size="xs" tone="muted">{account.email}</Text>
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="size-8 p-0" aria-label={`Menu ${account.name}`}>
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Account</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Inline>
        ) : null}
      </SidebarFooter>
    </>
  )
}

export function AppShell({
  logo,
  mark,
  groups,
  activeId,
  onNavigate,
  leading,
  topbar,
  footer,
  sidebarAction,
  account,
  title,
  inset = false,
  maxWidth = true,
  children,
  collapseAriaLabel = "Thu gọn sidebar",
  expandLabel = "Mở sidebar",
  menuLabel = "Mở menu",
  bottomNav,
}: AppShellProps) {
  return (
    <div data-app-shell className={cn(inset ? "h-full min-h-0" : "min-h-dvh")}>
      <SidebarProvider className={inset ? "h-full min-h-0" : undefined}>
        <Sidebar collapsible="icon">
          <ShellSidebar
            logo={logo}
            mark={mark}
            groups={groups}
            activeId={activeId}
            onNavigate={onNavigate}
            footer={footer}
            sidebarAction={sidebarAction}
            account={account}
          />
        </Sidebar>
        <SidebarInset className={cn("min-w-0", inset && "min-h-0 overflow-hidden")}>
          <header data-app-header className="flex h-14 shrink-0 items-center border-b border-border px-4">
            <Inline gap={2} align="center" justify="between" wrap={false} className="w-full min-w-0">
              <Inline gap={2} align="center" wrap={false} className="min-w-0">
                <ShellTrigger collapseAriaLabel={collapseAriaLabel} expandLabel={expandLabel} menuLabel={menuLabel} />
                {title ? <Text weight="medium" className="truncate">{title}</Text> : null}
                {leading}
              </Inline>
              {topbar}
            </Inline>
          </header>
          <div className="flex min-h-0 w-full flex-1 justify-center">
            <Box slot="app-content" className={cn("flex w-full min-w-0 flex-col gap-4 px-4 py-4 md:px-6", maxWidth && "max-w-7xl")}>
              {children}
            </Box>
          </div>
          {bottomNav ? (
            <div data-app-tabbar className="flex h-14 shrink-0 items-center border-t border-border px-4 md:hidden">
              {bottomNav}
            </div>
          ) : null}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
