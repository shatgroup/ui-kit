import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Inline, Stack, Text } from "@/components/layout/index.ts"
import { Meter } from "./meter.tsx"

export type JobState = "queued" | "running" | "done" | "failed" | "cancelled"

const BADGE = {
  queued: { variant: "neutral", label: "Chờ" },
  running: { variant: "info", label: "Đang chạy" },
  done: { variant: "success", label: "Xong" },
  failed: { variant: "destructive", label: "Lỗi" },
  cancelled: { variant: "warning", label: "Đã huỷ" },
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
}: JobStatusProps) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (status !== "running" || !startedAt) return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [status, startedAt])
  const elapsed = startedAt ? (now - startedAt) / 1000 : 0
  const badge = BADGE[status]

  if (compact) {
    return (
      <Inline gap={2} align="center" className="min-w-0">
        <Badge variant={badge.variant}>{badge.label}</Badge>
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
          <Badge variant={badge.variant}>{badge.label}</Badge>
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
            Huỷ
          </Button>
        ) : null}
        {status === "failed" && onRetry ? (
          <Button size="sm" onClick={onRetry}>
            Thử lại
          </Button>
        ) : null}
      </Inline>
    </Stack>
  )
}
