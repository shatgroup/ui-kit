import type { ReactNode } from "react"
import { cn } from "@/lib/utils.ts"

type Size = "sm" | "md" | "lg" | "xl" | "full"

const SIZE: Record<Size, string> = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-full",
}

type ContainerProps = {
  size?: Size
  className?: string
  children?: ReactNode
}

export function Container({ size = "lg", className, children }: ContainerProps) {
  return (
    <div className="grid w-full justify-items-center">
      <div className={cn("w-full min-w-0 px-4", SIZE[size], className)}>{children}</div>
    </div>
  )
}
