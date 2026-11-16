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
}

export function Stepper({ steps, onSelect }: StepperProps) {
  return (
    <Stack gap={2} className="md:flex-row">
      {steps.map((step, index) => {
        const body = (
          <>
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold", CIRCLE[step.status])}>
              {index + 1}
            </span>
            <Tooltip>
              <TooltipTrigger render={<span className="block min-w-0" />}>
                <Truncated>{step.label}</Truncated>
              </TooltipTrigger>
              <TooltipContent>{step.label}</TooltipContent>
            </Tooltip>
          </>
        )
        if (step.status === "done" && onSelect) {
          return (
            <Button key={step.id} variant="ghost" className="w-full justify-start md:flex-1" onClick={() => onSelect(step.id)}>
              {body}
            </Button>
          )
        }
        return (
          <span key={step.id} className="inline-flex min-w-0 items-center gap-2 md:flex-1">
            {body}
          </span>
        )
      })}
    </Stack>
  )
}
