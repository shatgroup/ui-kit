import { useId, type ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { Label } from "./label.tsx"
import { Switch } from "./switch.tsx"

function SwitchField({
  label,
  id,
  className,
  ...props
}: React.ComponentProps<typeof Switch> & { label: ReactNode }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Switch id={fieldId} {...props} />
      <Label htmlFor={fieldId}>{label}</Label>
    </span>
  )
}

export { SwitchField }
