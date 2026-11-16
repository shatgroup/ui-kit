import { Box, Stack } from "@/components/layout/index.ts"
import { DesignSystem } from "@/components/patterns/design-system.tsx"

export function DesignSystemPage() {
  return (
    <Box padding={6}>
      <Stack gap={8}>
        <DesignSystem />
      </Stack>
    </Box>
  )
}
