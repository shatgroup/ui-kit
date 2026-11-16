import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { Label } from "./label.tsx"
import { RadioGroupItem } from "./radio-group.tsx"

function RadioField({
  label,
  id,
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupItem> & { label: ReactNode }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <RadioGroupItem id={fieldId} {...props} />
      <Label htmlFor={fieldId}>{label}</Label>
    </span>
  )
}

export { RadioField }
