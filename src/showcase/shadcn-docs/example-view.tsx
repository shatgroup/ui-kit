import * as React from "react"

import { Toaster } from "@/components/ui/sonner.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { examples } from "./examples/index.ts"

function ExampleView({ name }: { name: string }) {
  React.useEffect(() => {
    const root = document.documentElement
    const parent = window.parent?.document?.documentElement
    if (!parent || parent === root) return
    const sync = () => root.classList.toggle("dark", parent.classList.contains("dark"))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(parent, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const Example = examples[name]
  if (!Example) return null
  return (
    <TooltipProvider>
      <div className="h-svh w-full bg-background text-foreground">
        <Example />
      </div>
      <Toaster />
    </TooltipProvider>
  )
}

export { ExampleView }
