import { CheckIcon } from "lucide-react"
import { Stack } from "@/components/layout/index.ts"
import { Button } from "@/components/ui/button.tsx"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx"
import { Truncated } from "@/components/ui/truncated.tsx"
import { cn } from "@/lib/utils.ts"

export type StepStatus = "todo" | "current" | "done" | "error"

export type StepItem = {
  id: string
  label: string
  status: StepStatus
}

const CIRCLE = {
  todo: "bg-muted text-muted-foreground",
  current: "bg-primary text-primary-foreground",
  done: "bg-success text-success-foreground",
  error: "bg-destructive text-destructive-foreground",
} as const

type StepperProps = {
  steps: StepItem[]
  onSelect?: (id: string) => void
  className?: string
}

export function Stepper({ steps, onSelect, className }: StepperProps) {
  return (
    <Stack gap={2} className={cn("md:flex-row", className)}>
      {steps.map((step, index) => {
        const body = (
          <>
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold", CIRCLE[step.status])}>
              {step.status === "done" ? <CheckIcon className="size-4" /> : index + 1}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block w-full min-w-0 text-center">
                  <Truncated>{step.label}</Truncated>
                </span>
              </TooltipTrigger>
              <TooltipContent>{step.label}</TooltipContent>
            </Tooltip>
          </>
        )
        if (step.status === "done" && onSelect) {
          return (
            <Button key={step.id} variant="ghost" className="h-auto w-full flex-col gap-2 md:flex-1" onClick={() => onSelect(step.id)}>
              {body}
            </Button>
          )
        }
        return (
          <span key={step.id} className="inline-flex w-full min-w-0 flex-col items-center gap-2 md:flex-1" aria-current={step.status === "current" ? "step" : undefined}>
            {body}
          </span>
        )
      })}
    </Stack>
  )
}
