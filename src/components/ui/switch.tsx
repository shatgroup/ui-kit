import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { focusRing } from "./control.ts"
import { Label } from "./label.tsx"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "inline-flex h-5 w-8 shrink-0 items-center rounded-full bg-input p-0",
        "data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "aria-invalid:border aria-invalid:border-destructive",
        focusRing,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block size-4 rounded-full bg-background translate-x-0 data-checked:translate-x-4"
      />
    </SwitchPrimitive.Root>
  )
}

function SwitchField({
  label,
  id,
  className,
  ...props
}: SwitchPrimitive.Root.Props & { label: ReactNode }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Switch id={fieldId} {...props} />
      <Label htmlFor={fieldId}>{label}</Label>
    </span>
  )
}

export { Switch, SwitchField }
