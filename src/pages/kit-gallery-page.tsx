import { Container, Stack } from "@/components/layout/index.ts"
import { Kit } from "@/components/patterns/design-system/kit.tsx"

function KitGalleryPage() {
  return (
    <Container size="xl">
      <Stack gap={8}>
        <Kit />
      </Stack>
    </Container>
  )
}

export { KitGalleryPage }
