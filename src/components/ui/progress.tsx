import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { cn } from "@/lib/utils.ts"

function Progress({ className, value, children, ...props }: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root value={value} data-slot="progress" className={cn("flex w-full flex-col gap-2", className)} {...props}>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      data-slot="progress-track"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}
      {...props}
    />
  )
}

function ProgressIndicator({ className, ...props }: ProgressPrimitive.Indicator.Props) {
  return <ProgressPrimitive.Indicator data-slot="progress-indicator" className={cn("h-full bg-primary", className)} {...props} />
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return <ProgressPrimitive.Label data-slot="progress-label" className={cn("text-sm font-medium", className)} {...props} />
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value data-slot="progress-value" className={cn("text-sm text-muted-foreground tabular-nums", className)} {...props} />
  )
}

export { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue }
