import { Container, Stack } from "@/components/layout/index.ts"
import { DesignSystem } from "@/components/patterns/design-system.tsx"

export function DesignSystemPage() {
  return (
    <Container size="xl">
      <Stack gap={8}>
        <DesignSystem />
      </Stack>
    </Container>
  )
}
