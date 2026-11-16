import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { Container, Text } from "@/components/layout/index.ts"
import { KitPage } from "@/pages/kit-page.tsx"
import { PreviewMotionPage } from "@/pages/preview-motion-page.tsx"
import { PreviewPage } from "@/pages/preview-page.tsx"
import { ShowcasePage } from "@/pages/showcase-page.tsx"
import { TokensPage } from "@/pages/tokens-page.tsx"

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/"
  let page = (
    <Container>
      <Text>Không có trang này.</Text>
    </Container>
  )
  if (path === "/" || path === "/tokens") page = <TokensPage />
  if (path === "/kit") page = <KitPage />
  if (path === "/preview") page = <PreviewPage />
  if (path === "/preview-motion") page = <PreviewMotionPage />
  if (path === "/showcase") page = <ShowcasePage />

  return (
    <TooltipProvider>
      {page}
      <Toaster />
    </TooltipProvider>
  )
}
