import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { Container, Text } from "@/components/layout/index.ts"
import { SiteBar } from "@/components/patterns/site-bar.tsx"
import { DesignSystemPage } from "@/pages/design-system-page.tsx"
import { ShowcasePage } from "@/pages/showcase-page.tsx"
import type { ReactNode } from "react"

function Frame({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <div className="flex h-dvh flex-col">
        <SiteBar />
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </div>
      <Toaster />
    </TooltipProvider>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/"
  if (path === "/" || path === "/tokens" || path === "/kit" || path === "/design-system") {
    if (path !== "/design-system") window.history.replaceState(null, "", "/design-system")
    return <Frame><DesignSystemPage /></Frame>
  }
  if (path === "/preview" || path === "/preview-motion") {
    window.history.replaceState(null, "", "/showcase")
    return <Frame><ShowcasePage /></Frame>
  }
  if (path === "/showcase") return <Frame><ShowcasePage /></Frame>
  return (
    <Frame>
      <Container>
        <Text>Không có trang này.</Text>
      </Container>
    </Frame>
  )
}
