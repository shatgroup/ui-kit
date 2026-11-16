import type { ComponentProps } from "react"
import { cn } from "@/lib/utils.ts"
import { fieldClass } from "./control.ts"

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(fieldClass, "min-h-16 px-3 py-2 text-sm", className)}
      {...props}
    />
  )
}

export { Textarea }
