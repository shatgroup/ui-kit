import { CheckIcon } from "lucide-react"
import { cn } from "cn"

type StepState = "done" | "current" | "todo"

function StepsBar({
  steps,
  className,
}: {
  steps: Array<{ label: string; status: StepState }>
  className?: string
}) {
  return (
    <ol data-slot="steps-bar" className={cn("flex w-full", className)}>
      {steps.map((step, index) => (
        <li
          key={step.label}
          data-status={step.status}
          aria-current={step.status === "current" ? "step" : undefined}
          className={cn(
            "flex h-9 min-w-0 flex-1 items-center justify-center gap-2 text-sm",
            index === 0
              ? "py-2 ps-3 pe-5 [clip-path:polygon(0_0,calc(100%-0.75rem)_0,100%_50%,calc(100%-0.75rem)_100%,0_100%)]"
              : "-ms-3 py-2 ps-6 pe-5 [clip-path:polygon(0_0,calc(100%-0.75rem)_0,100%_50%,calc(100%-0.75rem)_100%,0_100%,0.75rem_50%)]",
            step.status === "done" && "bg-primary text-primary-foreground",
            step.status === "current" && "bg-accent text-foreground",
            step.status === "todo" && "bg-muted text-muted-foreground",
          )}
        >
          {step.status === "done" ? <CheckIcon className="size-4 shrink-0" /> : null}
          <span className="truncate">{step.label}</span>
        </li>
      ))}
    </ol>
  )
}

export { StepsBar }
