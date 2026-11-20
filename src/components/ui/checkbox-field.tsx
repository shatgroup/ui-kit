import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { CheckboxMark } from "./checkbox-mark.tsx"
import { Label } from "./label.tsx"

function CheckboxField({
  label,
  id,
  className,
  indeterminate,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxMark> & { label: ReactNode; indeterminate?: boolean }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <CheckboxMark id={fieldId} checked={indeterminate ? "indeterminate" : checked} {...props} />
      <Label htmlFor={fieldId}>{label}</Label>
    </span>
  )
}

export { CheckboxField }
