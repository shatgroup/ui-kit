import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner.tsx"

export type NodeStatus = "loading" | "success" | "error" | "initial"

export type NodeStatusVariant = "overlay" | "border"

export type NodeStatusIndicatorProps = {
  status?: NodeStatus
  variant?: NodeStatusVariant
  children: ReactNode
}

export function SpinnerLoadingIndicator({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80">
        <Spinner />
      </div>
    </div>
  )
}

export function BorderLoadingIndicator({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-lg border border-primary">
      {children}
      <span className="absolute top-1 right-1">
        <Spinner />
      </span>
    </div>
  )
}

const BORDER: Partial<Record<NodeStatus, string>> = {
  success: "border-success",
  error: "border-destructive",
}

export function NodeStatusIndicator({
  status = "initial",
  variant = "border",
  children,
}: NodeStatusIndicatorProps) {
  if (status === "loading") {
    if (variant === "overlay") return <SpinnerLoadingIndicator>{children}</SpinnerLoadingIndicator>
    return <BorderLoadingIndicator>{children}</BorderLoadingIndicator>
  }
  const border = BORDER[status]
  if (!border) return children
  return <div className={cn("rounded-lg border", border)}>{children}</div>
}
