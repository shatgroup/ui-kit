import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"
import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { focusRing } from "./control.ts"
import { Label } from "./label.tsx"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-primary-foreground",
        "data-checked:border-primary data-checked:bg-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        focusRing,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

function CheckboxField({
  label,
  id,
  className,
  ...props
}: CheckboxPrimitive.Root.Props & { label: ReactNode }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Checkbox id={fieldId} {...props} />
      <Label htmlFor={fieldId}>{label}</Label>
    </span>
  )
}

export { Checkbox, CheckboxField }
