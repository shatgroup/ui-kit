import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function BaseNode({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flow-node relative rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      tabIndex={0}
      {...props}
    />
  )
}

export function BaseNodeHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn("flex flex-row items-center justify-between gap-2 px-3 py-2", className)}
    />
  )
}

export function BaseNodeHeaderTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("min-w-0 flex-1 font-semibold select-none", className)}
      {...props}
    />
  )
}

export function BaseNodeContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-2 p-3", className)}
      {...props}
    />
  )
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn("flex flex-col items-center gap-2 border-t border-border px-3 py-2", className)}
      {...props}
    />
  )
}
