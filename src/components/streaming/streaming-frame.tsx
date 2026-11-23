import type { ReactNode } from "react"
import { Box } from "@/components/layout/index.ts"

export function StreamingFrame({ children }: { children: ReactNode }) {
  return (
    <Box tone="background" className="dark min-h-full">
      {children}
    </Box>
  )
}
