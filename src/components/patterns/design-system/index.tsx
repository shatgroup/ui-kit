import { Stack } from "@/components/layout/index.ts"
import { Header, Palette, Tokens, TypeAndColor } from "./foundation.tsx"
import { Kit } from "./kit.tsx"

function DesignSystem() {
  return (
    <Stack gap={8} className="min-w-0">
      <Header />
      <TypeAndColor />
      <Palette />
      <Tokens />
      <Kit />
    </Stack>
  )
}

export { DesignSystem }
