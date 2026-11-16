import type { ReactNode } from "react"
import { Badge } from "./badge.tsx"

const STATUS = {
  pending: "warning",
  in_progress: "info",
  done: "success",
  failed: "destructive",
  draft: "neutral",
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
    <Badge variant={STATUS[status]}>
      {icon}
      {label ?? LABEL[status]}
    </Badge>
  )
}

export { StatusBadge }
export type { Status }
