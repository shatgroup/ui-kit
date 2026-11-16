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
        "inline-flex shrink-0 items-center rounded-full bg-input",
        "data-checked:bg-primary data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "aria-invalid:border aria-invalid:border-destructive",
        focusRing,
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className="pointer-events-none block rounded-full bg-background" />
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
