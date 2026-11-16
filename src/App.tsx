import { Container, Text } from "@/components/layout/index.ts"
import { TokensPage } from "@/pages/tokens-page.tsx"

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/"
  if (path === "/" || path === "/tokens") return <TokensPage />

  return (
    <Container>
      <Text>Không có trang này.</Text>
    </Container>
  )
}
