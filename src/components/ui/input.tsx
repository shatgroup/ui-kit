import { Input as InputPrimitive } from "@base-ui/react/input"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils.ts"
import { CONTROL_SIZE, fieldClass, type ControlSize } from "./control.ts"

type InputProps = Omit<ComponentProps<typeof InputPrimitive>, "size"> & {
  size?: ControlSize
}

function Input({ className, size = "md", type, ...props }: InputProps) {
  const range = type === "range"
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(range ? "h-2 w-full accent-primary" : cn(fieldClass, CONTROL_SIZE[size]), className)}
      {...props}
    />
  )
}

export { Input }
