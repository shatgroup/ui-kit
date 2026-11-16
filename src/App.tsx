import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { Container, Text } from "@/components/layout/index.ts"
import { DesignSystemPage } from "@/pages/design-system-page.tsx"
import { ShowcasePage } from "@/pages/showcase-page.tsx"

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/"
  if (path === "/" || path === "/tokens" || path === "/kit" || path === "/design-system") {
    if (path !== "/design-system") window.history.replaceState(null, "", "/design-system")
    return (
      <TooltipProvider>
        <DesignSystemPage />
        <Toaster />
      </TooltipProvider>
    )
  }
  if (path === "/preview") {
    window.history.replaceState(null, "", "/showcase?tab=posm")
    return (
      <TooltipProvider>
        <ShowcasePage />
        <Toaster />
      </TooltipProvider>
    )
  }
  if (path === "/preview-motion") {
    window.history.replaceState(null, "", "/showcase?tab=motion")
    return (
      <TooltipProvider>
        <ShowcasePage />
        <Toaster />
      </TooltipProvider>
    )
  }
  const page = path === "/showcase" ? <ShowcasePage /> : path === "/design-system" ? <DesignSystemPage /> : (
    <Container>
      <Text>Không có trang này.</Text>
    </Container>
  )

  return (
    <TooltipProvider>
      {page}
      <Toaster />
    </TooltipProvider>
  )
}
