import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils.ts"
import { Truncated } from "./truncated.tsx"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex min-w-0 flex-col gap-3", className)} {...props} />
}

function TabsList({
  className,
  fullWidth = false,
  children,
  ...props
}: TabsPrimitive.List.Props & { fullWidth?: boolean }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-full-width={fullWidth ? "true" : undefined}
      className={cn(
        "flex w-max max-w-full min-w-0 gap-1 overflow-x-auto rounded-md bg-muted p-1",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
      <TabsPrimitive.Indicator data-slot="tabs-indicator" />
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-control-md w-max min-w-0 max-w-full items-center justify-center gap-1 rounded-md px-3 text-sm whitespace-nowrap text-muted-foreground",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "data-active:bg-background data-active:font-medium data-active:text-foreground data-active:shadow-sm",
        className,
      )}
      {...props}
    >
      <Truncated>{children}</Truncated>
    </TabsPrimitive.Tab>
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel data-slot="tabs-content" className={cn("min-w-0", className)} {...props} />
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
