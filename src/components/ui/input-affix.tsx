import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"
import { CONTROL_SIZE, fieldClass, type ControlSize } from "./control.ts"

function InputAffix({
  prefix,
  suffix,
  size = "default",
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "size" | "prefix"> & { prefix?: ReactNode; suffix?: ReactNode; size?: ControlSize }) {
  return (
    <span data-slot="input-group" className={cn(fieldClass, size === "default" ? "h-8 px-2.5 text-sm" : CONTROL_SIZE[size], "flex items-center gap-2", className)}>
      {prefix ? <span className="shrink-0 text-muted-foreground">{prefix}</span> : null}
      <input data-slot="input" className="min-w-0 flex-1 bg-transparent outline-none" {...props} />
      {suffix ? <span className="shrink-0 text-muted-foreground">{suffix}</span> : null}
    </span>
  )
}

export { InputAffix }
