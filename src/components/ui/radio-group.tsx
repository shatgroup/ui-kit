import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { focusRing } from "./control.ts"
import { Label } from "./label.tsx"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("grid gap-2", className)} {...props} />
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background",
        "data-checked:border-primary data-checked:bg-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        focusRing,
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator data-slot="radio-indicator" className="size-2 rounded-full bg-primary-foreground" />
    </RadioPrimitive.Root>
  )
}

function RadioField({
  label,
  id,
  className,
  ...props
}: RadioPrimitive.Root.Props & { label: ReactNode }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <RadioGroupItem id={fieldId} {...props} />
      <Label htmlFor={fieldId}>{label}</Label>
    </span>
  )
}

export { RadioField, RadioGroup, RadioGroupItem }
