import type { ComponentProps } from "react"
import { cn } from "@/lib/utils.ts"

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn("inline-flex items-center gap-2 text-sm leading-5 font-medium", className)}
      {...props}
    />
  )
}

export { Label }
