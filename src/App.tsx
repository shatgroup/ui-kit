import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable.tsx"
import { Container, Text } from "@/components/layout/index.ts"
import { SiteBar } from "@/components/patterns/site-bar.tsx"
import { ComponentsPage } from "@/pages/components-page.tsx"
import { ExampleView } from "@/showcase/shadcn-docs/example-view.tsx"
import { DocsCommandMenu } from "@/showcase/shadcn-docs/docs-shell.tsx"
import { DesignSystemPage } from "@/pages/design-system-page.tsx"
import { ShowcasePage } from "@/pages/showcase-page.tsx"
import { StreamingPage } from "@/pages/streaming-page.tsx"
import type { ReactNode } from "react"

const HEADER_HEIGHT_KEY = "site-header-height"

function headerHeight() {
  const saved = Number(localStorage.getItem(HEADER_HEIGHT_KEY))
  return Number.isFinite(saved) && saved >= 56 && saved <= 320 ? saved : 56
}

function Frame({ children, search, dark = false }: { children: ReactNode; search?: ReactNode; dark?: boolean }) {
  return (
    <TooltipProvider>
      <div className={dark ? "dark h-svh" : "h-svh"}>
        <ResizablePanelGroup orientation="vertical" className="h-full">
          <ResizablePanel
            id="site-header"
            defaultSize={headerHeight()}
            minSize={56}
            maxSize={320}
            onResize={(size, _id, previous) => {
              if (previous) localStorage.setItem(HEADER_HEIGHT_KEY, String(Math.round(size.inPixels)))
            }}
          >
            <SiteBar search={search} />
          </ResizablePanel>
          <ResizableHandle withHandle aria-label="Resize header height" />
          <ResizablePanel id="site-body" minSize={200} className="min-h-0">
            <div data-app-scroll className="h-full min-h-0 scroll-fade scrollbar-none overflow-auto">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
  if (path === "/streaming" || path.startsWith("/streaming/")) return <Frame dark><StreamingPage /></Frame>
  if (path.startsWith("/view/")) return <ExampleView name={path.slice("/view/".length)} />
  if (path === "/components" || path.startsWith("/components/")) {
    return <Frame search={<DocsCommandMenu />}><ComponentsPage /></Frame>
  }
  return (
    <Frame>
      <Container>
        <Text>This page does not exist.</Text>
      </Container>
    </Frame>
  )
}
