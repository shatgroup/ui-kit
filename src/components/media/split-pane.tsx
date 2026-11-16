import type { ReactNode } from "react"
import { Stack } from "@/components/layout/index.ts"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx"

type SplitPaneProps = {
  start: ReactNode
  end: ReactNode
  defaultSize?: string
  minSize?: string
  maxSize?: string
}

export function SplitPane({ start, end, defaultSize = "42", minSize = "24", maxSize = "70" }: SplitPaneProps) {
  return (
    <>
      <div className="hidden h-full min-h-96 md:block">
        <ResizablePanelGroup>
          <ResizablePanel defaultSize={defaultSize} minSize={minSize} maxSize={maxSize}>
            {start}
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel minSize={minSize} maxSize={maxSize}>
            {end}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Stack gap={4} className="md:hidden">
        {start}
        {end}
      </Stack>
    </>
  )
}
