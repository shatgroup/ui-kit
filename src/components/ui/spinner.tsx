import { Loader2Icon } from "lucide-react"
import { cn } from "@/lib/utils.ts"

type SpinnerProps = {
  className?: string
}

export function Spinner({ className }: SpinnerProps) {
  return <Loader2Icon className={cn("size-4 animate-spin", className)} aria-hidden />
}
