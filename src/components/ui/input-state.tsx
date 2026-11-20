import * as React from "react"
import { cn } from "cn"
import { Input } from "./input.tsx"

function InputState({
  state,
  className,
  ...props
}: React.ComponentProps<typeof Input> & { state?: "focus" }) {
  return (
    <Input
      data-force-state={state}
      className={cn(state === "focus" && "border-ring ring-[3px] ring-ring/50", className)}
      {...props}
    />
  )
}

export { InputState }
