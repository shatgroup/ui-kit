import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Meter } from "./meter.tsx"

export type JobState = "queued" | "running" | "done" | "failed" | "cancelled"

const BADGE = {
  queued: { className: "border-transparent bg-badge-neutral text-badge-neutral-foreground", label: "Queued" },
  running: { className: "border-transparent bg-badge-info text-badge-info-foreground", label: "Running" },
  done: { className: "border-transparent bg-badge-success text-badge-success-foreground", label: "Done" },
  failed: { className: "border-transparent bg-badge-destructive text-badge-destructive-foreground", label: "Failed" },
  cancelled: { className: "border-transparent bg-badge-warning text-badge-warning-foreground", label: "Cancelled" },
} as const

type JobStatusProps = {
  name: string
  status: JobState
  progress?: number
  startedAt?: number
  error?: string
  compact?: boolean
  onCancel?: () => void
  onRetry?: () => void
  statusLabels?: Partial<Record<JobState, string>>
  cancelLabel?: string
  retryLabel?: string
}

function clock(seconds: number) {
  const total = Math.max(0, Math.floor(seconds))
  const minute = Math.floor(total / 60)
  const second = total % 60
  return `${minute}:${String(second).padStart(2, "0")}`
}

export function JobStatus({
  name,
  status,
  progress = 0,
  startedAt,
  error,
  compact = false,
  onCancel,
  onRetry,
  statusLabels,
  cancelLabel = "Cancel",
  retryLabel = "Retry",
}: JobStatusProps) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (status !== "running" || !startedAt) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [status, startedAt])
  const elapsed = startedAt ? (now - startedAt) / 1000 : 0
  const badge = { ...BADGE[status], label: statusLabels?.[status] ?? BADGE[status].label }

  if (compact) {
    return (
      <Inline gap={2} align="center" className="min-w-0">
        <Badge className={badge.className}>{badge.label}</Badge>
        <Text size="sm" truncate className="min-w-0 flex-1">
          {name}
        </Text>
        {status === "running" ? (
          <Text as="span" size="xs" className="shrink-0 tabular-nums">
            {progress}%
          </Text>
        ) : null}
      </Inline>
    )
  }

  return (
    <Stack gap={2} className="rounded-md border border-border p-3">
      <Inline gap={2} align="center" justify="between">
        <Inline gap={2} align="center" className="min-w-0">
          <Badge className={badge.className}>{badge.label}</Badge>
          <Text weight="medium" truncate>
            {name}
          </Text>
        </Inline>
        <Text as="span" size="sm" tone="muted" className="shrink-0 tabular-nums">
          {clock(elapsed)}
        </Text>
      </Inline>
      {status === "running" ? <Meter value={progress} /> : null}
      {status === "failed" && error ? (
        <Text size="sm" tone="destructive">
          {error}
        </Text>
      ) : null}
      <Inline gap={2}>
        {status === "running" && onCancel ? (
          <Button variant="outline" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
        ) : null}
        {status === "failed" && onRetry ? (
          <Button size="sm" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
      </Inline>
    </Stack>
  )
}
