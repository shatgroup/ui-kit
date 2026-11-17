import type { ReactNode } from "react"
import { Badge } from "./badge.tsx"

const STATUS = {
  pending: "border-transparent bg-badge-warning text-badge-warning-foreground",
  in_progress: "border-transparent bg-badge-info text-badge-info-foreground",
  done: "border-transparent bg-badge-success text-badge-success-foreground",
  failed: "border-transparent bg-badge-destructive text-badge-destructive-foreground",
  draft: "border-transparent bg-badge-neutral text-badge-neutral-foreground",
} as const

type Status = keyof typeof STATUS

const LABEL: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In Process",
  done: "Done",
  failed: "Failed",
  draft: "Draft",
}

function StatusBadge({ status, label, icon }: { status: Status; label?: string; icon?: ReactNode }) {
  return (
    <Badge className={STATUS[status]}>
      {icon}
      {label ?? LABEL[status]}
    </Badge>
  )
}

export { StatusBadge }
export type { Status }
