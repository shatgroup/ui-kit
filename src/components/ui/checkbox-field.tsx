import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { Checkbox } from "./checkbox.tsx"
import { Label } from "./label.tsx"

function CheckboxField({
  label,
  id,
  className,
  indeterminate,
  checked,
  ...props
}: React.ComponentProps<typeof Checkbox> & { label: ReactNode; indeterminate?: boolean }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Checkbox id={fieldId} checked={indeterminate ? "indeterminate" : checked} {...props} />
      <Label htmlFor={fieldId}>{label}</Label>
    </span>
  )
}

export { CheckboxField }
