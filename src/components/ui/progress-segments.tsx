import { cn } from "cn"

function ProgressSegments({
  value,
  max = 6,
  className,
}: {
  value: number
  max?: number
  className?: string
}) {
  const filled = Math.max(0, Math.min(max, Math.round(value)))
  return (
    <div
      data-slot="progress-segments"
      role="progressbar"
      aria-valuenow={filled}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("flex w-full gap-1", className)}
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          key={index}
          data-filled={index < filled ? "true" : "false"}
          className={cn("h-2 min-w-0 flex-1 rounded-full", index < filled ? "bg-primary" : "bg-muted")}
        />
      ))}
    </div>
  )
}

export { ProgressSegments }
