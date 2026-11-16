import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils.ts"
import { Truncated } from "./truncated.tsx"

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn("flex min-w-0 flex-col gap-3", className)} {...props} />
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn("flex min-w-0 gap-1 overflow-x-auto rounded-md bg-muted p-1", className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, children, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex h-control-sm min-w-0 max-w-full flex-1 items-center justify-center rounded-md px-3 text-sm text-muted-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "data-active:bg-background data-active:text-foreground data-active:font-medium",
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
