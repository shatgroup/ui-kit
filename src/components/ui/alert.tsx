import { XIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { Button } from "./button.tsx"

const TONE = {
  info: "border-info bg-badge-info text-badge-info-foreground",
  success: "border-success bg-badge-success text-badge-success-foreground",
  warning: "border-warning bg-badge-warning text-badge-warning-foreground",
  error: "border-destructive bg-badge-destructive text-badge-destructive-foreground",
} as const

type AlertTone = keyof typeof TONE

const BAR = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
} as const

function Alert({
  tone = "info",
  title,
  children,
  onClose,
  icon,
  variant = "soft",
}: {
  tone?: AlertTone
  title: string
  children?: ReactNode
  onClose?: () => void
  icon?: ReactNode
  variant?: "soft" | "line"
}) {
  const line = variant === "line"
  return (
    <div data-slot="alert" role="status" className={cn("relative flex items-center gap-3 overflow-hidden rounded-lg border p-3 text-sm", line ? "border-border bg-card" : TONE[tone])}>
      {line ? <span className={cn("absolute inset-y-0 left-0 w-1", BAR[tone])} /> : null}
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-medium">{title}</span>
        {children ? <span>{children}</span> : null}
      </div>
      {onClose ? (
        <Button variant="ghost" size="sm" className="size-8 p-0" aria-label="Đóng" onClick={onClose}>
          <XIcon />
        </Button>
      ) : null}
    </div>
  )
}

export { Alert }
export type { AlertTone }
