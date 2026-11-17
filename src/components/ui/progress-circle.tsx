import type { ReactNode } from "react"
import { cn } from "cn"

function ProgressCircle({
  value,
  max = 100,
  className,
  children,
}: {
  value: number
  max?: number
  className?: string
  children?: ReactNode
}) {
  const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, value / max))
  const radius = 18
  const circumference = 2 * Math.PI * radius
  return (
    <div
      data-slot="progress-circle"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("relative size-16 shrink-0", className)}
    >
      <svg viewBox="0 0 48 48" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="24" cy="24" r={radius} fill="none" strokeWidth="4" className="stroke-muted" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-primary"
          strokeDasharray={`${circumference * ratio} ${circumference}`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-center text-xs font-semibold">{children}</span>
    </div>
  )
}

export { ProgressCircle }
